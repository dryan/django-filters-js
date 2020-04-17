djangoFilters.intcomma = (value) => {
  value = value.toString().split(".");
  const int = value[0];
  const parts = [int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")];
  if (value.length > 1) {
    parts.push(value.slice(1).join("."));
  }
  return parts.join(".");
};
