djangoFilters.ordinal = (value) => {
  const num = parseInt(
    value.toString().replace(/[^\d]+/g, ""),
    10
  ).toPrecision();
  if (isNaN(num) || num >= Number.MAX_SAFE_INTEGER) {
    return value;
  }

  if ([11, 12, 13].indexOf(num % 100) > -1) {
    return [value, djangoFilters._utils.translate("ordinals", "11-13")].join(
      ""
    );
  }
  return [value, djangoFilters._utils.translate("ordinals", num % 10)].join("");
};
