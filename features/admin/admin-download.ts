/**
 * Browser-side exports for the admin tables. Files are built from the rows
 * already on screen, so nothing goes back to the server.
 */

type CsvValue = string | number | null;

/** Quotes a cell only when it holds a comma, quote or line break. */
function csvCell(value: CsvValue) {
  const text = value === null ? "" : String(value);
  return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

/** Rows of cells as CSV text, one line per row. */
export function toCsv(rows: readonly (readonly CsvValue[])[]) {
  return rows.map((row) => row.map(csvCell).join(",")).join("\n");
}

/** Saves text to the user's computer under the given file name. */
export function downloadFile(contents: string, fileName: string, type: string) {
  const url = URL.createObjectURL(new Blob([contents], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}
