export const center = (value, length = 0) => {
    value = value.toString();
    const right = Math.max(0, Math.ceil((length - value.length) / 2));
    value = value.padEnd(right + value.length, " ");
    value = value.padStart(length, " ");
    return value;
};
//# sourceMappingURL=center.js.map