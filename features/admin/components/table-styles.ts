// Class names shared by the admin tables. They live outside table-kit.tsx,
// which is a client module, so server components can import the strings too.

/** Compact tables inside the overview, analytics and revenue panels. */
export const summaryTable = {
  head: "h-10 px-3 text-xs font-medium text-muted-foreground",
  cell: "px-3 py-3",
  row: "border-border/60 hover:bg-transparent",
};

/** Full-width record tables, shown from md up in a soft panel. */
export const recordTable = {
  panel: "hidden rounded-2xl bg-muted/50 px-2 py-1 md:block",
  head: "h-11 px-4 text-xs font-medium text-muted-foreground",
  cell: "px-4 py-3.5",
  row: "border-border/60 hover:bg-transparent",
};

/** Wrapper that lets a row of tabs scroll sideways below md. */
export const tabScroller =
  "-mx-4 overflow-x-auto px-4 [scrollbar-width:none] md:mx-0 md:px-0";

/** Padding for a `Panel` that holds a table, hidden below md. */
export const tablePanelPadding = "px-3 py-2 max-md:hidden md:px-4 md:py-2";
