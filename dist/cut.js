export const cut = (value, toCut) => {
    const regex = new RegExp(toCut, "g");
    return value.toString().replace(regex, "");
};
//# sourceMappingURL=cut.js.map