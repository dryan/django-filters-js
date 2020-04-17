djangoFilters.escape = (value) => {
  value = value.toString();
  value = value
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#x27;")
    .replace(/"/g, "&quot;")
    // the ampersand regex is from https://stackoverflow.com/a/7727714/2918278
    .replace(/&(?!\w+;|#[0-9]+;|#x[0-9A-F]+;)/g, "&amp;");
  return value;
};
