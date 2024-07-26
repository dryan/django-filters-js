export const pluralize = (value, suffixes = ",s") => {
    if (suffixes.indexOf(",") === -1) {
        suffixes = `,${suffixes}`;
    }
    if (suffixes.split(",").length > 2) {
        return "";
    }
    const [singularSuffix, pluralSuffix] = suffixes.split(",");
    if (typeof value === "number" || typeof value === "string") {
        value = parseFloat(value.toString());
    }
    else if (Array.isArray(value)) {
        value = value.length;
    }
    if (isNaN(value)) {
        return "";
    }
    if (value === 1) {
        return singularSuffix;
    }
    return pluralSuffix;
};
//# sourceMappingURL=pluralize.js.map