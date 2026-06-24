import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export { store } from "./store";
export type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Read one top-level slice only: `useAppSelector((s) => s.jobs)`.
 * No transforms in the callback — use `useMemo` in the component. No selector modules.
 * See `.cursor/architecture/001-redux-patterns.md` §5.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
