djangoFilters.addslashes = (value) =>
  value
    .toString()
    .replace(/\\/g, String.raw`\\`)
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");
