import { useEffect, useRef, useState } from "react";

export function useStateEffect(effect = () => {}, deps = [], initialState) {
  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  const effectRef = useRef(effect);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    effectRef.current = effect;
  }, [effect]);

  useEffect(() => {
    const cleanup = effectRef.current(stateRef.current, setState);
    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [state, setState];
}
