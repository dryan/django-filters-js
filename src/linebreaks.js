djangoFilters.linebreaks = (value, autoescape) => {
  if (typeof autoescape === "undefined") {
    autoescape = true;
  }
  value = value.toString();
  value = value.replace(/\r\n|\r/g, "\n");
  value = value.split(/\n{2,}/g);
  if (autoescape) {
    value = value.map(
      (para) => `<p>${djangoFilters.escape(para).replace(/\n/g, "<br>")}</p>`
    );
  } else {
    value = value.map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`);
  }
  value = value.join("\n\n");
  return value;
};
