djangoFilters.floatformat = (value, precision) => {
  // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
  function decimalAdjust(type, val, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === "undefined" || +exp === 0) {
      return Math[type](val);
    }
    val = +val;
    exp = +exp;
    // Shift
    val = val.toString().split("e");
    val = Math[type](+(val[0] + "e" + (val[1] ? +val[1] - exp : -exp)));
    // Shift back
    val = val.toString().split("e");
    return +(val[0] + "e" + (val[1] ? +val[1] + exp : exp));
  }

  if (value === null) {
    value = "";
  } else if (value === Number.POSITIVE_INFINITY) {
    return "inf";
  } else if (value === Number.NEGATIVE_INFINITY) {
    return "-inf";
  }
  value = value.toString();
  value = parseFloat(value);
  if (isNaN(value)) {
    return "";
  }
  if (typeof precision === "undefined") {
    precision = -1;
  }
  precision = parseInt(precision, 10);
  if (isNaN(precision)) {
    return value.toString();
  }
  const m = parseInt(value, 10) - value;
  if (!m && precision < 0) {
    return parseInt(value, 10).toString();
  }
  return decimalAdjust("round", value, -Math.abs(precision)).toFixed(
    Math.abs(precision)
  );
};
