export const addslashes = (value) =>
  value
    .toString()
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
export const addSlashes = addslashes;
//# sourceMappingURL=addslashes.js.map
