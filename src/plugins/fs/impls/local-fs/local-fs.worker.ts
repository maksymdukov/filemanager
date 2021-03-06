import fs, { Dirent } from 'fs';
import * as Comlink from 'comlink';
import path from 'path';
import chokidar from 'chokidar';
import {
  FsItemTypeEnum,
  FSWorker,
  IFSRawNode,
  ReadWatchDirProps,
  OnFsChangeBindCb,
  OnFsErrorBindCb,
  OnFsReadDirBindCb,
} from 'elcommander-plugin-sdk';

export class LocalFSWorker extends FSWorker {
  private static getReadDirStartNode({ node }: ReadWatchDirProps): IFSRawNode {
    return {
      ...node,
      id: node.path,
      type: FsItemTypeEnum.Directory,
      name: node.name,
      meta: {},
    };
  }

  private static getRawNodes(
    startNode: IFSRawNode,
    dirents: Dirent[]
  ): IFSRawNode[] {
    const { path: startNodePath } = startNode;
    return [startNode].concat(
      dirents
        .filter((file) => file.isDirectory() || file.isFile())
        .map((dirent) => {
          const constructedPath = `${
            startNodePath === '/' ? '' : startNodePath
          }/${dirent.name}`;
          return {
            id: constructedPath,
            type: dirent.isDirectory()
              ? FsItemTypeEnum.Directory
              : FsItemTypeEnum.File,
            name: dirent.name,
            path: constructedPath,
            meta: {},
          };
        })
    );
  }

  async readWatchDir(
    { node, up }: ReadWatchDirProps,
    onReadDir: OnFsReadDirBindCb,
    onChange: OnFsChangeBindCb,
    onError: OnFsErrorBindCb
  ) {
    const { path: targetPath } = node;

    const watcher = chokidar
      .watch(targetPath, {
        depth: 0,
        alwaysStat: true,
        ignoreInitial: true,
      })
      .on('error', (error) => {
        onError(error);
      })
      .on('ready', () => {
        (async () => {
          try {
            const nodes = await this.readDir({ node, up });
            await onReadDir(nodes);
            watcher.on('all', () => {
              onChange();
            });
          } catch (e) {
            console.dir(e);
            await onError(e);
          }
        })();
      });

    this.subscriptions.add({
      path: targetPath,
      ctx: watcher,
    });
  }

  async readDir({ node, up }: ReadWatchDirProps): Promise<IFSRawNode[]> {
    const startNode = LocalFSWorker.getReadDirStartNode({ node, up });
    const { path: targetPath } = startNode;
    const files = await fs.promises.readdir(path.normalize(targetPath), {
      encoding: 'utf8',
      withFileTypes: true,
    });
    return LocalFSWorker.getRawNodes(startNode, files);
  }
}

Comlink.expose(LocalFSWorker);
