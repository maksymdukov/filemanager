import { ViewsState } from './tree-state.interface';
import { FsItemTypeEnum } from '../../../enums/fs-item-type.enum';

export const initialState: ViewsState = {
  views: [
    {
      viewName: 'LocalFS',
      viewId: '1',
      byId: {},
      allIds: [],
      cursor: null,
      enterStack: [],
      selectedIds: new Set(),
      startNode: {
        id: '/',
        name: 'root',
        type: FsItemTypeEnum.Directory,
        children: [],
        isLoading: false,
        isOpened: false,
        isCursored: false,
        isHighlighted: false,
        isSelected: false,
        error: null,
        path: '/',
        nestLevel: -1,
        meta: {},
      },
      startPathLoading: false,
      startPathError: null,
    },
    {
      viewName: 'GoogleDriveFS',
      viewId: '2',
      byId: {},
      allIds: [],
      cursor: null,
      enterStack: [],
      selectedIds: new Set(),
      startPathLoading: false,
      startPathError: null,
      startNode: {
        id: 'root',
        name: 'root',
        type: FsItemTypeEnum.Directory,
        children: [],
        isLoading: false,
        isOpened: false,
        isCursored: false,
        isHighlighted: false,
        isSelected: false,
        error: null,
        path: '/',
        nestLevel: -1,
        meta: {
          parents: ['root'],
        },
      },
    },
  ],
};
