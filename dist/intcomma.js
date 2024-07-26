export const intcomma = (value) => {
    const valueAsArray = value.toString().split(".");
    const int = valueAsArray[0];
    const parts = [int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")];
    if (valueAsArray.length > 1) {
        parts.push(valueAsArray.slice(1).join("."));
    }
    return parts.join(".");
};
//# sourceMappingURL=intcomma.js.map