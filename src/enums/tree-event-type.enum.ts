export enum TreeEventType {
  OpenNode = 1,
  CloseNode,
  EnterNode,
  ItemCursorSelect,
  ItemShiftSelect,
  ItemShiftMouseSelect,
  ItemCtrlSelect,
  LassoSelectStart,
  MoveSelectionMaybeStart,
  MoveSelectionEnter,
  MoveSelectionLeave,
  MoveSelectionFinish,
  DNDNodeDrop,
}
