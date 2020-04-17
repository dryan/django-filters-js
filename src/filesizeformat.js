djangoFilters.filesizeformat = (bytes, useL10n) => {
  if (typeof useL10n === "undefined") {
    useL10n = true;
  }

  bytes = parseInt(bytes, 10);
  if (isNaN(bytes)) {
    return djangoFilters._utils.avoidWrapping(
      `0 ${djangoFilters._utils.translate("filesizeformat", "bytes")}`
    );
  }

  const filesizeNumberFormat = (number) => {
    if (useL10n) {
      const formatter = new Intl.NumberFormat(
        djangoFilters._utils.getLanguageCode(),
        { minimumFractionDigits: 1 }
      );
      return formatter.format(parseFloat(number.toFixed(1)));
    }
    return number.toFixed(1);
  };

  const KB = 1024,
    MB = 1048576,
    GB = 1073741824,
    TB = 1099511627776,
    PB = 1125899906842624;

  let value = "";
  const negative = bytes < 0;

  if (negative) {
    bytes = -bytes;
  }

  if (bytes < KB) {
    value = `${bytes} ${djangoFilters._utils.translate(
      "filesizeformat",
      bytes === 1 ? "byte" : "bytes"
    )}`;
  } else if (bytes < MB) {
    value = `${filesizeNumberFormat(
      bytes / KB
    )} ${djangoFilters._utils.translate("filesizeformat", "KB")}`;
  } else if (bytes < GB) {
    value = `${filesizeNumberFormat(
      bytes / MB
    )} ${djangoFilters._utils.translate("filesizeformat", "MB")}`;
  } else if (bytes < TB) {
    value = `${filesizeNumberFormat(
      bytes / GB
    )} ${djangoFilters._utils.translate("filesizeformat", "GB")}`;
  } else if (bytes < PB) {
    value = `${filesizeNumberFormat(
      bytes / TB
    )} ${djangoFilters._utils.translate("filesizeformat", "TB")}`;
  } else {
    value = `${filesizeNumberFormat(
      bytes / PB
    )} ${djangoFilters._utils.translate("filesizeformat", "PB")}`;
  }

  if (negative) {
    value = `-${value}`;
  }

  return djangoFilters._utils.avoidWrapping(value);
};
