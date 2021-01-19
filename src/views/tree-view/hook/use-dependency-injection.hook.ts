import { useEffect, useRef, useState } from 'react';
import { unstable_batchedUpdates } from 'react-dom';
import { useSelector } from 'react-redux';
import { getFSBackendsMap, IFSBackendDescriptor } from 'backends/backends-map';
import { FSBackend } from 'backends/abstracts/fs-backend.abstract';
import { RootState } from 'store/root-types';
import {
  getViewClassId,
  getViewConfigName,
} from 'store/features/views/views.selectors';
import { PluginPersistence } from 'plugins/plugin-persistence';
import { createAppendedElement, removeElement } from 'utils/dom/element';
import { UserCancelError } from 'error/fs-plugin/user-cancel.error';

interface UseDependencyInjectionHookProps {
  viewId: string;
  index: number;
  onSuccessfulInit: (fsManager: FSBackend, viewIndex: number) => void;
  onFailInit: (e: any, viewIndex: number) => void;
}

export const useDependencyInjection = ({
  index,
  viewId,
  onSuccessfulInit,
  onFailInit,
}: UseDependencyInjectionHookProps) => {
  const [
    fsBackendDescriptor,
    setFsBackendDescriptor,
  ] = useState<IFSBackendDescriptor | null>(null);
  const [fsManager, setFsManager] = useState<FSBackend | null>(null);
  const domContainerRef = useRef<Element>();

  const [instantiating, setInstantiating] = useState(false);
  const [initializing, setInitializing] = useState(false);

  const classId = useSelector((state: RootState) =>
    getViewClassId(state, index)
  );
  const configName = useSelector((state: RootState) =>
    getViewConfigName(state, index)
  );

  // DI
  useEffect(() => {
    // instantiate fsManager
    if (!fsManager && !instantiating) {
      setInstantiating(true);

      // inject
      (async () => {
        const FSBackendsMap = await getFSBackendsMap();
        setFsBackendDescriptor(FSBackendsMap[classId]);
        const FsBackendClass = FSBackendsMap[classId].klass;

        // our app's global class to allow plugins access to fs
        const pluginPersistence = new PluginPersistence(
          FsBackendClass.Persistence.category,
          FsBackendClass.Persistence.dirName
        );

        // implementation of plugin's specific persistence class
        const persistence = new FsBackendClass.Persistence(pluginPersistence);

        // give plugin dom container
        const domContainer = createAppendedElement();
        domContainerRef.current = domContainer;

        // create plugin instance
        const instance = await FsBackendClass.createInstance({
          viewId,
          persistence,
          configName,
          domContainer,
        });
        unstable_batchedUpdates(() => {
          setInstantiating(false);
          setInitializing(true);
          setFsManager(instance);
        });
        try {
          await instance.onInit();
          setInitializing(false);
          onSuccessfulInit(instance, index);
          // TODO
          // dispatch this.configName save
        } catch (e) {
          // dispatch removeView action
          onFailInit(e, index);
          console.log('error was caught', e);
          if (e instanceof UserCancelError) {
            // do nothing
            return;
          }
          // TODO
          // dispatch error notification
        }
      })();
    }
  }, [
    setInitializing,
    onFailInit,
    fsManager,
    classId,
    configName,
    instantiating,
    initializing,
    viewId,
    setFsBackendDescriptor,
    index,
    onSuccessfulInit,
  ]);

  // cleanup
  useEffect(() => {
    return () => {
      if (fsManager) {
        (async () => {
          await fsManager.onDestroy();
          if (domContainerRef.current) {
            removeElement(domContainerRef.current);
            domContainerRef.current = undefined;
          }
        })();
      }
    };
  }, [fsManager]);

  // remove domContainer in case fsManager.onInit fails
  useEffect(
    () => () => {
      if (domContainerRef.current) {
        removeElement(domContainerRef.current);
        domContainerRef.current = undefined;
      }
    },
    []
  );

  return {
    fsBackendDescriptor,
    fsManager,
    instantiating,
    initializing,
  };
};