djangoFilters.linenumbers = (value, autoescape) => {
  if (typeof autoescape === "undefined") {
    autoescape = true;
  }
  value = value.toString();
  let lines = value.split("\n");
  const width = lines.length.toString().length;
  lines = lines.map((line, index) => {
    const lineNumber = djangoFilters._utils.padStart(index + 1, width, "0");
    if (autoescape) {
      line = djangoFilters.escape(line);
    }
    return `${lineNumber}. ${line}`;
  });
  return lines.join("\n");
};
