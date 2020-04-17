djangoFilters._utils = {
  avoidWrapping: (value) => value.replace(/ /g, "\xa0"),

  padStart: (obj, len, pad) => {
    obj = obj.toString();
    pad = pad.toString();
    return obj.padStart(len, pad);
  },

  padEnd: (obj, len, pad) => {
    obj = obj.toString();
    pad = pad.toString();
    return obj.padEnd(len, pad);
  },

  parseDate: (value) => {
    if (value instanceof Date) {
      return value;
    } else if (typeof value === "number") {
      return new Date(value);
    }
    value = String(value); // not using toString here to handle null, undefined, etc.
    const date = new Date(value.replace(/-/g, "/").replace(/T/g, " "));
    if (date.toString().toLowerCase() === "invalid date") {
      if (console && console.warn) {
        console.warn(`${value} was not parsed as a Date`);
      }
      return value;
    }
    return date;
  },

  getLanguageCode: () => {
    return (
      djangoFilters.language ||
      (navigator && navigator.language ? navigator.language : "en-US")
    );
  },

  translate: (group, id) => {
    const languageCode = djangoFilters._utils.getLanguageCode().toLowerCase();
    let lang;
    if (djangoFilters.translations[languageCode]) {
      lang = djangoFilters.translations[languageCode];
    } else if (djangoFilters.translations[languageCode.split("-")[0]]) {
      lang = djangoFilters.translations[languageCode.split("-")[0]];
    } else {
      lang = djangoFilters.translations["en-us"];
    }
    if (lang && lang[group]) {
      return lang[group][id];
    }
    return undefined;
  },

  urlquote: (value, safe) => {
    value = value.toString();
    if (typeof safe === "undefined") {
      safe = "/";
    }
    safe = safe
      .split("")
      .map((chr) => `\\${chr}`)
      .join("|");
    const notSafe = new RegExp(`[^${safe}]`, "g");
    return value.replace(notSafe, encodeURIComponent);
  },
};
