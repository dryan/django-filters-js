export const addslashes = (value: string) =>
  value
    .toString()
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

export const addSlashes = addslashes;
