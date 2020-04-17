djangoFilters.linebreaksbr = (value, autoescape) => {
  if (typeof autoescape === "undefined") {
    autoescape = true;
  }
  value = value.toString();
  value = value.replace(/\r\n|\r/g, "\n");
  if (autoescape) {
    value = djangoFilters.escape(value);
  }
  value = value.replace(/\n/g, "<br>");
  return value;
};
