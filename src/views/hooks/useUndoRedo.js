import { useState, useCallback } from "react";

export function useUndoRedo() {
  /*
  pointer at points at the index where a new snapshot will be added
  pointerat-1 is the index of the snapshot that will be returned at undoing
  pointerat+1 is the index of the snapshot that will be returned at redoing
*/
  const [stack, setStack] = useState([]);
  const [pointerAt, setPointerAt] = useState(-1);

  const flush = useCallback(() => {
    setPointerAt(-1);
    setStack([]);
  }, []);

  const canUndo = useCallback(() => pointerAt > 0, [pointerAt]);
  const canRedo = useCallback(
    () => pointerAt < stack.length - 1,
    [pointerAt, stack]
  );
  const undo = useCallback(() => {
    if (!canUndo()) return;
    const snapShotToReturn = stack[pointerAt - 1];
    setPointerAt(pointerAt - 1);
    return snapShotToReturn;
  }, [canUndo, pointerAt, stack]);

  const redo = useCallback(() => {
    if (!canRedo) return;
    const sanpShotToReturn = stack[pointerAt + 1];
    setPointerAt(pointerAt + 1);
    return sanpShotToReturn;
  }, [canRedo, pointerAt, stack]);

  const push = useCallback(
    (snapShot) => {
      setStack((prevStack) => {
        const newStack = [...prevStack];
        newStack.splice(pointerAt+1);
        newStack.push(snapShot);
        return newStack;
      });
      setPointerAt(previousPointerAt => previousPointerAt + 1);
    },
    [pointerAt]
  );

  return {
    canUndo,
    canRedo,
    undo,
    redo,
    push,
    stack,
    flush,
  };
}
