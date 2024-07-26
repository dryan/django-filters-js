export const addslashes = (value: string) =>
  value
    .toString()
    .replace(/\\/g, String.raw`\\`)
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

export const addSlashes = addslashes;
