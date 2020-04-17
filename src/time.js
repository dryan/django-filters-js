djangoFilters.time = (value, format) =>
  djangoFilters.date(value, format || djangoFilters.date.defaultFormats.time);
