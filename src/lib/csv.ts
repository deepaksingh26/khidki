export function toCsv(rows: Record<string, string | number | null | undefined>[]) {
  if (rows.length === 0) {
    return "";
  }

  const headers = Object.keys(rows[0]);
  const escapeCell = (value: string | number | null | undefined) => {
    const cell = value == null ? "" : String(value);
    return `"${cell.replaceAll('"', '""')}"`;
  };

  const lines = [headers.join(",")];
  rows.forEach((row) => {
    lines.push(headers.map((header) => escapeCell(row[header])).join(","));
  });

  return lines.join("\n");
}

