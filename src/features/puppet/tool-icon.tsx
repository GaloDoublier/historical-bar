export function ToolIcon({ name }: { name: "insert" | "hand" | "select" | "undo" | "redo" }) {
  const paths = {
    insert: "M4 17V7h10M4 7l5 5M15 14h7M18.5 10.5v7M4 17h5",
    hand: "M8 12V5a2 2 0 0 1 4 0v6V4a2 2 0 0 1 4 0v7V6a2 2 0 0 1 4 0v9c0 5-3 7-7 7-3 0-5-2-7-5l-3-4a2 2 0 0 1 3-3l2 2",
    select: "M5 3l14 10-7 1-3 7-4-18Z",
    undo: "M8 4 3 9l5 5M3 9h11a7 7 0 0 1 0 14",
    redo: "m16 4 5 5-5 5M21 9H10a7 7 0 0 0 0 14",
  };
  return <svg aria-hidden="true" focusable="false" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d={paths[name]} /></svg>;
}
