djangoFilters.striptags = (value) => {
  value = value.toString();
  value = value.replace(/<(?:.|\s)*?>/g, "");
  return value;
};
