import { translations, } from "./translations";
/* istanbul ignore next */
export const inspect = (obj) => JSON.stringify(obj, null, 2);
export const avoidWrapping = (value) => value.replace(/ /g, "\xa0");
export const padStart = (obj, len, pad) => {
    obj = obj.toString();
    pad = pad.toString();
    return obj.padStart(len, pad);
};
export const padEnd = (obj, len, pad) => {
    obj = obj.toString();
    pad = pad.toString();
    return obj.padEnd(len, pad);
};
export const parseDate = (value) => {
    if (value instanceof Date) {
        return value;
    }
    else if (typeof value === "number") {
        return new Date(value);
    }
    value = String(value); // not using toString here to handle null, undefined, etc.
    const date = new Date(value.replace(/-/g, "/").replace(/T/g, " "));
    if (date.toString().toLowerCase() === "invalid date") {
        if (console && console.warn) {
            console.warn(`${value} was not parsed as a Date`);
        }
        return null;
    }
    return date;
};
export const getLanguageCode = () => {
    return (navigator && navigator.language ? navigator.language : "en-US")
        .toLowerCase()
        .replace("_", "-");
};
export function translate(group, id, languageCode) {
    languageCode = languageCode || getLanguageCode().toLowerCase();
    let lang;
    if (translations[languageCode]) {
        lang = translations[languageCode];
    }
    else if (translations[languageCode.split("-")[0]]) {
        lang = translations[languageCode.split("-")[0]];
    }
    else {
        lang = translations["en-us"];
    }
    if (lang && lang[group]) {
        return lang[group][id];
    }
    return undefined;
}
translate.translations = translations;
export const urlquote = (value, safe = "/") => {
    value = value.toString();
    safe = safe
        .split("")
        .map((chr) => `\\${chr}`)
        .join("|");
    const notSafe = new RegExp(`[^${safe}]`, "g");
    return value.replace(notSafe, encodeURIComponent);
};
//# sourceMappingURL=_utils.js.map