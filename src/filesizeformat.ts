import { avoidWrapping, translate, getLanguageCode } from "./_utils";

const filesizeNumberFormat = (number: number, useL10n: boolean) => {
  if (useL10n) {
    const formatter = new Intl.NumberFormat(getLanguageCode(), {
      minimumFractionDigits: 1,
    });
    return formatter.format(parseFloat(number.toFixed(1)));
  }
  return number.toFixed(1);
};

const KB = 1024;
const MB = 1048576;
const GB = 1073741824;
const TB = 1099511627776;
const PB = 1125899906842624;

export const filesizeformat = (
  bytes: number | string,
  useL10n: boolean = true
): string => {
  bytes = parseInt(bytes.toString(), 10);
  if (isNaN(bytes)) {
    return avoidWrapping(`0 ${translate("filesizeformat", "bytes")}`);
  }

  let value = "";
  const negative = bytes < 0;

  if (negative) {
    bytes = -bytes;
  }

  if (bytes < KB) {
    value = `${bytes} ${translate(
      "filesizeformat",
      bytes === 1 ? "byte" : "bytes"
    )}`;
  } else if (bytes < MB) {
    value = `${filesizeNumberFormat(
      bytes / KB,
      useL10n
    )} ${translate("filesizeformat", "KB")}`;
  } else if (bytes < GB) {
    value = `${filesizeNumberFormat(
      bytes / MB,
      useL10n
    )} ${translate("filesizeformat", "MB")}`;
  } else if (bytes < TB) {
    value = `${filesizeNumberFormat(
      bytes / GB,
      useL10n
    )} ${translate("filesizeformat", "GB")}`;
  } else if (bytes < PB) {
    value = `${filesizeNumberFormat(
      bytes / TB,
      useL10n
    )} ${translate("filesizeformat", "TB")}`;
  } else {
    value = `${filesizeNumberFormat(
      bytes / PB,
      useL10n
    )} ${translate("filesizeformat", "PB")}`;
  }

  if (negative) {
    value = `-${value}`;
  }

  return avoidWrapping(value);
};

export const fileSizeFormat = filesizeformat;
