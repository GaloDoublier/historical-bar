import type { PuppetRigV1 } from "./rig";

export type RigHistory = { past: PuppetRigV1[]; present: PuppetRigV1; future: PuppetRigV1[] };
export type HistoryAction = { type: "edit"; value: PuppetRigV1; record?: boolean } | { type: "undo" | "redo" };
export function historyReducer(state: RigHistory, action: HistoryAction): RigHistory {
  if (action.type === "edit") return { past: action.record === false ? state.past : [...state.past.slice(-99), state.present], present: action.value, future: [] };
  if (action.type === "undo" && state.past.length) return { past: state.past.slice(0,-1), present: state.past[state.past.length-1], future: [state.present,...state.future] };
  if (action.type === "redo" && state.future.length) return { past: [...state.past,state.present], present: state.future[0], future: state.future.slice(1) };
  return state;
}
