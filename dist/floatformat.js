import { getLanguageCode } from "./_utils";
export const floatformat = (value, precision = -1) => {
    const grouping = precision.toString().endsWith("g");
    precision = parseInt(precision.toString().replace("g", ""), 10);
    if (value === Number.POSITIVE_INFINITY) {
        return "inf";
    }
    else if (value === Number.NEGATIVE_INFINITY) {
        return "-inf";
    }
    else if (value === null || isNaN(value)) {
        return "";
    }
    if (isNaN(precision)) {
        return value.toString();
    }
    const formatterOptions = {
        useGrouping: grouping,
        maximumFractionDigits: Math.abs(precision),
        trailingZeroDisplay: precision < 0 ? "stripIfInteger" : "auto",
    };
    if (precision >= 0 || (precision < 0 && value % 1 !== 0)) {
        formatterOptions.minimumFractionDigits = Math.abs(precision);
    }
    const formatter = new Intl.NumberFormat(getLanguageCode(), formatterOptions);
    let output = formatter.format(value);
    if (parseFloat(output) === 0) {
        if (output.startsWith("-")) {
            output = output.replace(/^-/, "");
        }
    }
    return output;
};
export const floatFormat = floatformat;
//# sourceMappingURL=floatformat.js.map