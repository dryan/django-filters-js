export const striptags = (value) => {
    value = value.toString();
    value = value.replace(/<(?:.|\s)*?>/g, "");
    return value;
};
export const stripTags = striptags;
//# sourceMappingURL=striptags.js.map