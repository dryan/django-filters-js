const djangoFilters = window.djangoFilters || {};

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

djangoFilters.addslashes = (value) =>
  value
    .toString()
    .replace(/\\/g, String.raw`\\`)
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

djangoFilters.apnumber = (value) => {
  return djangoFilters._utils.translate("apnumbers", value) || value.toString();
};

djangoFilters.capfirst = (value) => {
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
};

djangoFilters.center = (value, length) => {
  value = value.toString();
  const right = Math.max(0, Math.ceil((length - value.length) / 2));
  value = value.padEnd(right + value.length, " ");
  value = value.padStart(length, " ");
  return value;
};

djangoFilters.cut = (value, toCut) => {
  const regex = new RegExp(toCut, "g");
  return value.toString().replace(regex, "");
};

djangoFilters.date = (value, format) => {
  /*
    To escape a character, use '%'; to print a literal '%', use '%%'.
    Otherwise, formatting follows https://docs.djangoproject.com/en/1.3/ref/templates/builtins/#date.
  */
  if (
    !value ||
    (value.toString && value.toString().toLowerCase() === "invalid date")
  ) {
    return value;
  }
  format = format || djangoFilters.date.defaultFormats.date;
  const jan1 = new Date(value.getFullYear(), 0, 1);

  const normalize12Hours = (hours) => {
    if (hours > 12) {
      hours = hours - 12;
    } else if (hours === 0) {
      hours = 12;
    }
    return hours;
  };

  const formats = {
    a:
      value.getHours() < 12
        ? djangoFilters._utils.translate("meridians:ap", "am")
        : djangoFilters._utils.translate("meridians:ap", "pm"),
    A:
      value.getHours() < 12
        ? djangoFilters._utils.translate("meridians", "am")
        : djangoFilters._utils.translate("meridians", "pm"),
    b: djangoFilters._utils
      .translate("months:short", value.getMonth())
      .toLowerCase(),
    d: djangoFilters._utils.padStart(value.getDate(), 2, 0),
    D: djangoFilters._utils.translate("days:short", value.getDay()),
    E:
      djangoFilters._utils.translate("months:locale", value.getMonth()) ||
      djangoFilters._utils.translate("months:long", value.getMonth()),
    f: ((v) => {
      const ret = [normalize12Hours(v.getHours())];
      if (v.getMinutes() !== 0) {
        ret.push(":");
        ret.push(djangoFilters._utils.padStart(v.getMinutes(), 2, 0));
      }
      return ret.join("");
    })(value),
    F: djangoFilters._utils.translate("months:long", value.getMonth()),
    g: normalize12Hours(value.getHours()),
    G: value.getHours(),
    h: djangoFilters._utils.padStart(normalize12Hours(value.getHours()), 2, 0),
    H: djangoFilters._utils.padStart(value.getHours(), 2, 0),
    i: djangoFilters._utils.padStart(value.getMinutes(), 2, 0),
    j: value.getDate(),
    l: djangoFilters._utils.translate("days:long", value.getDay()),
    L: Boolean(new Date(value.getFullYear(), 1, 29).getDate() === 29),
    m: djangoFilters._utils.padStart(value.getMonth() + 1, 2, 0),
    M: djangoFilters._utils.translate("months:short", value.getMonth()),
    n: value.getMonth() + 1,
    N: djangoFilters._utils.translate("months:ap", value.getMonth()),
    O: ((v) => {
      const offsetHours = Math.ceil(v.getTimezoneOffset() / 60),
        offsetMinutes = v.getTimezoneOffset() % 60;
      return (
        (offsetHours <= 0 ? "+" : "-") +
        djangoFilters._utils.padStart(offsetHours, 2, 0) +
        djangoFilters._utils.padStart(offsetMinutes, 2, 0)
      );
    })(value),
    P: ((v) => {
      if ((v.getHours() === 0 || v.getHours() === 12) && v.getMinutes() === 0) {
        return djangoFilters._utils.translate("meridians", v.getHours());
      }
      const ret = [normalize12Hours(v.getHours())];
      if (v.getMinutes() !== 0) {
        ret.push(":");
        ret.push(djangoFilters._utils.padStart(v.getMinutes(), 2, 0));
      }
      ret.push(" ");
      ret.push(
        v.getHours() < 12
          ? djangoFilters._utils.translate("meridians:ap", "am")
          : djangoFilters._utils.translate("meridians:ap", "pm")
      );
      return ret.join("");
    })(value),
    s: djangoFilters._utils.padStart(value.getSeconds(), 2, 0),
    S: djangoFilters.ordinal(value.getDate()).replace(value.getDate(), ""),
    t: 32 - new Date(value.getYear(), value.getMonth(), 32).getDate(),
    T: ((v) =>
      v
        .toLocaleTimeString(navigator ? navigator.language : "en-US", {
          timeZoneName: "short",
        })
        .split(" ")[2])(value),
    u: value.getMilliseconds() * 1000,
    U: Math.floor(value.getTime() / 1000),
    w: value.getDay(),
    W: ((v) => {
      // from https://stackoverflow.com/a/6117889/2918278
      const d = new Date(Date.UTC(v.getFullYear(), v.getMonth(), v.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    })(value),
    y: value.getFullYear().toString().substr(2),
    Y: value.getFullYear(),
    z: Math.ceil((value - jan1) / 86400000),
    Z: ((v) => {
      const offsetSeconds = v.getTimezoneOffset() * 60 * -1;
      return (
        (offsetSeconds < 0 ? "-" : "") +
        djangoFilters._utils.padEnd(Math.abs(offsetSeconds), 5, 0)
      );
    })(value),
  };
  // special cases
  // ISO 8601
  // YYYY, MM, DD, HH, MM, SS, mmmmmm
  formats.c = [
    formats.Y,
    "-",
    formats.m,
    "-",
    formats.d,
    "T",
    formats.H,
    ":",
    formats.i,
    ":",
    formats.s,
    ".",
    djangoFilters._utils.padStart(formats.u, 6, 0),
  ].join("");
  // RFC 2822
  //Short Day, Date, Short Month, Year, HH, MM, SS, Timezone Offset
  formats.r = [
    formats.D,
    ", ",
    formats.j,
    " ",
    formats.M,
    " ",
    formats.Y,
    " ",
    formats.H,
    ":",
    formats.i,
    ":",
    formats.s,
    " ",
    formats.O,
  ].join("");

  const ret = [];
  format.match(/(\\?.)/g).forEach((f) => {
    if (f.match(/^\\/)) {
      ret.push(f.replace(/^\\/, ""));
    } else {
      ret.push(f in formats ? formats[f] : f);
    }
  });
  if (ret.length === 1 && typeof ret[0] === "boolean") {
    return ret[0];
  }
  return ret.join("");
};
djangoFilters.date.defaultFormats = {
  date: "N j, Y",
  time: "P",
};

djangoFilters.escape = (value) => {
  value = value.toString();
  value = value
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/'/g, "&#x27;")
    .replace(/"/g, "&quot;")
    // the ampersand regex is from https://stackoverflow.com/a/7727714/2918278
    .replace(/&(?!\w+;|#[0-9]+;|#x[0-9A-F]+;)/g, "&amp;");
  return value;
};

djangoFilters.escapejs = (value) => {
  const translations = {
    "\\\\": "\\u005C",
    "'": "\\u0027",
    '"': "\\u0022",
    ">": "\\u003E",
    "<": "\\u003C",
    "&": "\\u0026",
    "=": "\\u003D",
    "-": "\\u002D",
    ";": "\\u003B",
    "`": "\\u0060",
    "\u2028": "\\u2028",
    "\u2029": "\\u2029",
    "\u0000": "\\u0000",
    "\u0001": "\\u0001",
    "\u0002": "\\u0002",
    "\u0003": "\\u0003",
    "\u0004": "\\u0004",
    "\u0005": "\\u0005",
    "\u0006": "\\u0006",
    "\u0007": "\\u0007",
    "\b": "\\u0008",
    "\t": "\\u0009",
    "\n": "\\u000A",
    "\u000b": "\\u000B",
    "\f": "\\u000C",
    "\r": "\\u000D",
    "\u000e": "\\u000E",
    "\u000f": "\\u000F",
    "\u0010": "\\u0010",
    "\u0011": "\\u0011",
    "\u0012": "\\u0012",
    "\u0013": "\\u0013",
    "\u0014": "\\u0014",
    "\u0015": "\\u0015",
    "\u0016": "\\u0016",
    "\u0017": "\\u0017",
    "\u0018": "\\u0018",
    "\u0019": "\\u0019",
    "\u001a": "\\u001A",
    "\u001b": "\\u001B",
    "\u001c": "\\u001C",
    "\u001d": "\\u001D",
    "\u001e": "\\u001E",
    "\u001f": "\\u001F",
  };

  value = value.toString();

  Object.entries(translations).forEach((entry) => {
    const find = new RegExp(entry[0], "g");
    const replace = entry[1];
    value = value.replace(find, replace);
  });

  return value;
};

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

djangoFilters.floatformat = (value, precision) => {
  // from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/floor
  function decimalAdjust(type, val, exp) {
    // If the exp is undefined or zero...
    if (typeof exp === "undefined" || +exp === 0) {
      return Math[type](val);
    }
    val = +val;
    exp = +exp;
    // Shift
    val = val.toString().split("e");
    val = Math[type](+(val[0] + "e" + (val[1] ? +val[1] - exp : -exp)));
    // Shift back
    val = val.toString().split("e");
    return +(val[0] + "e" + (val[1] ? +val[1] + exp : exp));
  }

  if (value === null) {
    value = "";
  } else if (value === Number.POSITIVE_INFINITY) {
    return "inf";
  } else if (value === Number.NEGATIVE_INFINITY) {
    return "-inf";
  }
  value = value.toString();
  value = parseFloat(value);
  if (isNaN(value)) {
    return "";
  }
  if (typeof precision === "undefined") {
    precision = -1;
  }
  precision = parseInt(precision, 10);
  if (isNaN(precision)) {
    return value.toString();
  }
  const m = parseInt(value, 10) - value;
  if (!m && precision < 0) {
    return parseInt(value, 10).toString();
  }
  return decimalAdjust("round", value, -Math.abs(precision)).toFixed(
    Math.abs(precision)
  );
};

djangoFilters.force_escape = (value) => {
  return djangoFilters.escape(value);
};

djangoFilters.forceEscape = djangoFilters.force_escape;

djangoFilters.intcomma = (value) => {
  value = value.toString().split(".");
  const int = value[0];
  const parts = [int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")];
  if (value.length > 1) {
    parts.push(value.slice(1).join("."));
  }
  return parts.join(".");
};

djangoFilters.iriencode = (value) => {
  value = value.toString();
  return djangoFilters._utils.urlquote(value, "/#%[]=:;$&()+,!?*@'~");
};

djangoFilters.linebreaks = (value, autoescape) => {
  if (typeof autoescape === "undefined") {
    autoescape = true;
  }
  value = value.toString();
  value = value.replace(/\r\n|\r/g, "\n");
  value = value.split(/\n{2,}/g);
  if (autoescape) {
    value = value.map(
      (para) => `<p>${djangoFilters.escape(para).replace(/\n/g, "<br>")}</p>`
    );
  } else {
    value = value.map((para) => `<p>${para.replace(/\n/g, "<br>")}</p>`);
  }
  value = value.join("\n\n");
  return value;
};

djangoFilters.linebreaksbr = (value, autoescape) => {
  if (typeof autoescape === "undefined") {
    autoescape = true;
  }
  value = value.toString();
  value = value.replace(/\r\n|\r/g, "\n");
  if (autoescape) {
    value = djangoFilters.escape(value);
  }
  value = value.replace(/\n/g, "<br>");
  return value;
};

djangoFilters.linenumbers = (value, autoescape) => {
  if (typeof autoescape === "undefined") {
    autoescape = true;
  }
  value = value.toString();
  let lines = value.split("\n");
  const width = lines.length.toString().length;
  lines = lines.map((line, index) => {
    const lineNumber = djangoFilters._utils.padStart(index + 1, width, "0");
    if (autoescape) {
      line = djangoFilters.escape(line);
    }
    return `${lineNumber}. ${line}`;
  });
  return lines.join("\n");
};

djangoFilters.ljust = (value, width) =>
  djangoFilters._utils.padEnd(value, width || 0, " ");

djangoFilters.ordinal = (value) => {
  const num = parseInt(
    value.toString().replace(/[^\d]+/g, ""),
    10
  ).toPrecision();
  if (isNaN(num) || num >= Number.MAX_SAFE_INTEGER) {
    return value;
  }

  if ([11, 12, 13].indexOf(num % 100) > -1) {
    return [value, djangoFilters._utils.translate("ordinals", "11-13")].join(
      ""
    );
  }
  return [value, djangoFilters._utils.translate("ordinals", num % 10)].join("");
};

djangoFilters.phone2numeric = (value) => {
  const char2number = {
    a: "2",
    b: "2",
    c: "2",
    d: "3",
    e: "3",
    f: "3",
    g: "4",
    h: "4",
    i: "4",
    j: "5",
    k: "5",
    l: "5",
    m: "6",
    n: "6",
    o: "6",
    p: "7",
    q: "7",
    r: "7",
    s: "7",
    t: "8",
    u: "8",
    v: "8",
    w: "9",
    x: "9",
    y: "9",
    z: "9",
  };
  value = value.toString();
  value = value
    .toLowerCase()
    .split("")
    .map((char) => char2number[char] || char)
    .join("");
  return value;
};

djangoFilters.pluralize = (value, suffixes) => {
  if (typeof suffixes === "undefined") {
    suffixes = ",s";
  }
  if (suffixes.indexOf(",") === -1) {
    suffixes = `,${suffixes}`;
  }
  if (suffixes.split(",").length > 2) {
    return "";
  }
  const [singularSuffix, pluralSuffix] = suffixes.split(",");
  if (typeof value === "number" || typeof value === "string") {
    value = parseFloat(value);
  } else if (Array.isArray(value)) {
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

djangoFilters.rjust = (value, width) =>
  djangoFilters._utils.padStart(value, width || 0, " ");

djangoFilters.slugify = (value, allowUnicode) => {
  value = value.toString();
  if (allowUnicode) {
    value = value.normalize("NFKC");
  } else {
    value = value.normalize("NFKD").replace(/[^\u0020-\u007F]/g, "");
  }
  return value
    .trim()
    .toLowerCase()
    .replace(
      /(?:[\0-/:-@[-^`{-\xA9\xAB-\xB4\xB6-\xB9\xBB-\xBF\xD7\xF7\u02C2-\u02C5\u02D2-\u02DF\u02E5-\u02EB\u02ED\u02EF-\u02FF\u0375\u0378\u0379\u037E\u0380-\u0385\u0387\u038B\u038D\u03A2\u03F6\u0482\u0530\u0557\u0558\u055A-\u055F\u0589-\u0590\u05BE\u05C0\u05C3\u05C6\u05C8-\u05CF\u05EB-\u05EE\u05F3-\u060F\u061B-\u061F\u066A-\u066D\u06D4\u06DD\u06DE\u06E9\u06FD\u06FE\u0700-\u070F\u074B\u074C\u07B2-\u07BF\u07F6-\u07F9\u07FB\u07FC\u07FE\u07FF\u082E-\u083F\u085C-\u085F\u086B-\u089F\u08B5\u08C8-\u08D2\u08E2\u0964\u0965\u0970\u0984\u098D\u098E\u0991\u0992\u09A9\u09B1\u09B3-\u09B5\u09BA\u09BB\u09C5\u09C6\u09C9\u09CA\u09CF-\u09D6\u09D8-\u09DB\u09DE\u09E4\u09E5\u09F2-\u09FB\u09FD\u09FF\u0A00\u0A04\u0A0B-\u0A0E\u0A11\u0A12\u0A29\u0A31\u0A34\u0A37\u0A3A\u0A3B\u0A3D\u0A43-\u0A46\u0A49\u0A4A\u0A4E-\u0A50\u0A52-\u0A58\u0A5D\u0A5F-\u0A65\u0A76-\u0A80\u0A84\u0A8E\u0A92\u0AA9\u0AB1\u0AB4\u0ABA\u0ABB\u0AC6\u0ACA\u0ACE\u0ACF\u0AD1-\u0ADF\u0AE4\u0AE5\u0AF0-\u0AF8\u0B00\u0B04\u0B0D\u0B0E\u0B11\u0B12\u0B29\u0B31\u0B34\u0B3A\u0B3B\u0B45\u0B46\u0B49\u0B4A\u0B4E-\u0B54\u0B58-\u0B5B\u0B5E\u0B64\u0B65\u0B70\u0B72-\u0B81\u0B84\u0B8B-\u0B8D\u0B91\u0B96-\u0B98\u0B9B\u0B9D\u0BA0-\u0BA2\u0BA5-\u0BA7\u0BAB-\u0BAD\u0BBA-\u0BBD\u0BC3-\u0BC5\u0BC9\u0BCE\u0BCF\u0BD1-\u0BD6\u0BD8-\u0BE5\u0BF0-\u0BFF\u0C0D\u0C11\u0C29\u0C3A-\u0C3C\u0C45\u0C49\u0C4E-\u0C54\u0C57\u0C5B-\u0C5F\u0C64\u0C65\u0C70-\u0C7F\u0C84\u0C8D\u0C91\u0CA9\u0CB4\u0CBA\u0CBB\u0CC5\u0CC9\u0CCE-\u0CD4\u0CD7-\u0CDD\u0CDF\u0CE4\u0CE5\u0CF0\u0CF3-\u0CFF\u0D0D\u0D11\u0D45\u0D49\u0D4F-\u0D53\u0D58-\u0D5E\u0D64\u0D65\u0D70-\u0D79\u0D80\u0D84\u0D97-\u0D99\u0DB2\u0DBC\u0DBE\u0DBF\u0DC7-\u0DC9\u0DCB-\u0DCE\u0DD5\u0DD7\u0DE0-\u0DE5\u0DF0\u0DF1\u0DF4-\u0E00\u0E3B-\u0E3F\u0E4F\u0E5A-\u0E80\u0E83\u0E85\u0E8B\u0EA4\u0EA6\u0EBE\u0EBF\u0EC5\u0EC7\u0ECE\u0ECF\u0EDA\u0EDB\u0EE0-\u0EFF\u0F01-\u0F17\u0F1A-\u0F1F\u0F2A-\u0F34\u0F36\u0F38\u0F3A-\u0F3D\u0F48\u0F6D-\u0F70\u0F85\u0F98\u0FBD-\u0FC5\u0FC7-\u0FFF\u104A-\u104F\u109E\u109F\u10C6\u10C8-\u10CC\u10CE\u10CF\u10FB\u1249\u124E\u124F\u1257\u1259\u125E\u125F\u1289\u128E\u128F\u12B1\u12B6\u12B7\u12BF\u12C1\u12C6\u12C7\u12D7\u1311\u1316\u1317\u135B\u135C\u1360-\u137F\u1390-\u139F\u13F6\u13F7\u13FE-\u1400\u166D\u166E\u1680\u169B-\u169F\u16EB-\u16ED\u16F9-\u16FF\u170D\u1715-\u171F\u1735-\u173F\u1754-\u175F\u176D\u1771\u1774-\u177F\u17D4-\u17D6\u17D8-\u17DB\u17DE\u17DF\u17EA-\u180A\u180E\u180F\u181A-\u181F\u1879-\u187F\u18AB-\u18AF\u18F6-\u18FF\u191F\u192C-\u192F\u193C-\u1945\u196E\u196F\u1975-\u197F\u19AC-\u19AF\u19CA-\u19CF\u19DA-\u19FF\u1A1C-\u1A1F\u1A5F\u1A7D\u1A7E\u1A8A-\u1A8F\u1A9A-\u1AA6\u1AA8-\u1AAF\u1AC1-\u1AFF\u1B4C-\u1B4F\u1B5A-\u1B6A\u1B74-\u1B7F\u1BF4-\u1BFF\u1C38-\u1C3F\u1C4A-\u1C4C\u1C7E\u1C7F\u1C89-\u1C8F\u1CBB\u1CBC\u1CC0-\u1CCF\u1CD3\u1CFB-\u1CFF\u1DFA\u1F16\u1F17\u1F1E\u1F1F\u1F46\u1F47\u1F4E\u1F4F\u1F58\u1F5A\u1F5C\u1F5E\u1F7E\u1F7F\u1FB5\u1FBD\u1FBF-\u1FC1\u1FC5\u1FCD-\u1FCF\u1FD4\u1FD5\u1FDC-\u1FDF\u1FED-\u1FF1\u1FF5\u1FFD-\u200B\u200E-\u203E\u2041-\u2053\u2055-\u2070\u2072-\u207E\u2080-\u208F\u209D-\u20CF\u20F1-\u2101\u2103-\u2106\u2108\u2109\u2114\u2116-\u2118\u211E-\u2123\u2125\u2127\u2129\u212E\u213A\u213B\u2140-\u2144\u214A-\u214D\u214F-\u215F\u2189-\u24B5\u24EA-\u2BFF\u2C2F\u2C5F\u2CE5-\u2CEA\u2CF4-\u2CFF\u2D26\u2D28-\u2D2C\u2D2E\u2D2F\u2D68-\u2D6E\u2D70-\u2D7E\u2D97-\u2D9F\u2DA7\u2DAF\u2DB7\u2DBF\u2DC7\u2DCF\u2DD7\u2DDF\u2E00-\u2E2E\u2E30-\u3004\u3008-\u3020\u3030\u3036\u3037\u303D-\u3040\u3097\u3098\u309B\u309C\u30A0\u30FB\u3100-\u3104\u3130\u318F-\u319F\u31C0-\u31EF\u3200-\u33FF\u4DC0-\u4DFF\u9FFD-\u9FFF\uA48D-\uA4CF\uA4FE\uA4FF\uA60D-\uA60F\uA62C-\uA63F\uA673\uA67E\uA6F2-\uA716\uA720\uA721\uA789\uA78A\uA7C0\uA7C1\uA7CB-\uA7F4\uA828-\uA82B\uA82D-\uA83F\uA874-\uA87F\uA8C6-\uA8CF\uA8DA-\uA8DF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA954-\uA95F\uA97D-\uA97F\uA9C1-\uA9CE\uA9DA-\uA9DF\uA9FF\uAA37-\uAA3F\uAA4E\uAA4F\uAA5A-\uAA5F\uAA77-\uAA79\uAAC3-\uAADA\uAADE\uAADF\uAAF0\uAAF1\uAAF7-\uAB00\uAB07\uAB08\uAB0F\uAB10\uAB17-\uAB1F\uAB27\uAB2F\uAB5B\uAB6A-\uAB6F\uABEB\uABEE\uABEF\uABFA-\uABFF\uD7A4-\uD7AF\uD7C7-\uD7CA\uD7FC-\uD7FF\uE000-\uF8FF\uFA6E\uFA6F\uFADA-\uFAFF\uFB07-\uFB12\uFB18-\uFB1C\uFB29\uFB37\uFB3D\uFB3F\uFB42\uFB45\uFBB2-\uFBD2\uFD3E-\uFD4F\uFD90\uFD91\uFDC8-\uFDEF\uFDFC-\uFDFF\uFE10-\uFE1F\uFE30-\uFE32\uFE35-\uFE4C\uFE50-\uFE6F\uFE75\uFEFD-\uFF0F\uFF1A-\uFF20\uFF3B-\uFF3E\uFF40\uFF5B-\uFF65\uFFBF-\uFFC1\uFFC8\uFFC9\uFFD0\uFFD1\uFFD8\uFFD9\uFFDD-\uFFFF]|\uD800[\uDC0C\uDC27\uDC3B\uDC3E\uDC4E\uDC4F\uDC5E-\uDC7F\uDCFB-\uDD3F\uDD75-\uDDFC\uDDFE-\uDE7F\uDE9D-\uDE9F\uDED1-\uDEDF\uDEE1-\uDEFF\uDF20-\uDF2C\uDF4B-\uDF4F\uDF7B-\uDF7F\uDF9E\uDF9F\uDFC4-\uDFC7\uDFD0\uDFD6-\uDFFF]|\uD801[\uDC9E\uDC9F\uDCAA-\uDCAF\uDCD4-\uDCD7\uDCFC-\uDCFF\uDD28-\uDD2F\uDD64-\uDDFF\uDF37-\uDF3F\uDF56-\uDF5F\uDF68-\uDFFF]|\uD802[\uDC06\uDC07\uDC09\uDC36\uDC39-\uDC3B\uDC3D\uDC3E\uDC56-\uDC5F\uDC77-\uDC7F\uDC9F-\uDCDF\uDCF3\uDCF6-\uDCFF\uDD16-\uDD1F\uDD3A-\uDD7F\uDDB8-\uDDBD\uDDC0-\uDDFF\uDE04\uDE07-\uDE0B\uDE14\uDE18\uDE36\uDE37\uDE3B-\uDE3E\uDE40-\uDE5F\uDE7D-\uDE7F\uDE9D-\uDEBF\uDEC8\uDEE7-\uDEFF\uDF36-\uDF3F\uDF56-\uDF5F\uDF73-\uDF7F\uDF92-\uDFFF]|\uD803[\uDC49-\uDC7F\uDCB3-\uDCBF\uDCF3-\uDCFF\uDD28-\uDD2F\uDD3A-\uDE7F\uDEAA\uDEAD-\uDEAF\uDEB2-\uDEFF\uDF1D-\uDF26\uDF28-\uDF2F\uDF51-\uDFAF\uDFC5-\uDFDF\uDFF7-\uDFFF]|\uD804[\uDC47-\uDC65\uDC70-\uDC7E\uDCBB-\uDCCF\uDCE9-\uDCEF\uDCFA-\uDCFF\uDD35\uDD40-\uDD43\uDD48-\uDD4F\uDD74\uDD75\uDD77-\uDD7F\uDDC5-\uDDC8\uDDCD\uDDDB\uDDDD-\uDDFF\uDE12\uDE38-\uDE3D\uDE3F-\uDE7F\uDE87\uDE89\uDE8E\uDE9E\uDEA9-\uDEAF\uDEEB-\uDEEF\uDEFA-\uDEFF\uDF04\uDF0D\uDF0E\uDF11\uDF12\uDF29\uDF31\uDF34\uDF3A\uDF45\uDF46\uDF49\uDF4A\uDF4E\uDF4F\uDF51-\uDF56\uDF58-\uDF5C\uDF64\uDF65\uDF6D-\uDF6F\uDF75-\uDFFF]|\uD805[\uDC4B-\uDC4F\uDC5A-\uDC5D\uDC62-\uDC7F\uDCC6\uDCC8-\uDCCF\uDCDA-\uDD7F\uDDB6\uDDB7\uDDC1-\uDDD7\uDDDE-\uDDFF\uDE41-\uDE43\uDE45-\uDE4F\uDE5A-\uDE7F\uDEB9-\uDEBF\uDECA-\uDEFF\uDF1B\uDF1C\uDF2C-\uDF2F\uDF3A-\uDFFF]|\uD806[\uDC3B-\uDC9F\uDCEA-\uDCFE\uDD07\uDD08\uDD0A\uDD0B\uDD14\uDD17\uDD36\uDD39\uDD3A\uDD44-\uDD4F\uDD5A-\uDD9F\uDDA8\uDDA9\uDDD8\uDDD9\uDDE2\uDDE5-\uDDFF\uDE3F-\uDE46\uDE48-\uDE4F\uDE9A-\uDE9C\uDE9E-\uDEBF\uDEF9-\uDFFF]|\uD807[\uDC09\uDC37\uDC41-\uDC4F\uDC5A-\uDC71\uDC90\uDC91\uDCA8\uDCB7-\uDCFF\uDD07\uDD0A\uDD37-\uDD39\uDD3B\uDD3E\uDD48-\uDD4F\uDD5A-\uDD5F\uDD66\uDD69\uDD8F\uDD92\uDD99-\uDD9F\uDDAA-\uDEDF\uDEF7-\uDFAF\uDFB1-\uDFFF]|\uD808[\uDF9A-\uDFFF]|\uD809[\uDC6F-\uDC7F\uDD44-\uDFFF]|[\uD80A\uD80B\uD80E-\uD810\uD812-\uD819\uD824-\uD82B\uD82D\uD82E\uD830-\uD833\uD837\uD839\uD83D\uD83F\uD87B-\uD87D\uD87F\uD885-\uDB3F\uDB41-\uDBFF][\uDC00-\uDFFF]|\uD80D[\uDC2F-\uDFFF]|\uD811[\uDE47-\uDFFF]|\uD81A[\uDE39-\uDE3F\uDE5F\uDE6A-\uDECF\uDEEE\uDEEF\uDEF5-\uDEFF\uDF37-\uDF3F\uDF44-\uDF4F\uDF5A-\uDF62\uDF78-\uDF7C\uDF90-\uDFFF]|\uD81B[\uDC00-\uDE3F\uDE80-\uDEFF\uDF4B-\uDF4E\uDF88-\uDF8E\uDFA0-\uDFDF\uDFE2\uDFE5-\uDFEF\uDFF2-\uDFFF]|\uD821[\uDFF8-\uDFFF]|\uD823[\uDCD6-\uDCFF\uDD09-\uDFFF]|\uD82C[\uDD1F-\uDD4F\uDD53-\uDD63\uDD68-\uDD6F\uDEFC-\uDFFF]|\uD82F[\uDC6B-\uDC6F\uDC7D-\uDC7F\uDC89-\uDC8F\uDC9A-\uDC9C\uDC9F-\uDFFF]|\uD834[\uDC00-\uDD64\uDD6A-\uDD6C\uDD73-\uDD7A\uDD83\uDD84\uDD8C-\uDDA9\uDDAE-\uDE41\uDE45-\uDFFF]|\uD835[\uDC55\uDC9D\uDCA0\uDCA1\uDCA3\uDCA4\uDCA7\uDCA8\uDCAD\uDCBA\uDCBC\uDCC4\uDD06\uDD0B\uDD0C\uDD15\uDD1D\uDD3A\uDD3F\uDD45\uDD47-\uDD49\uDD51\uDEA6\uDEA7\uDEC1\uDEDB\uDEFB\uDF15\uDF35\uDF4F\uDF6F\uDF89\uDFA9\uDFC3\uDFCC\uDFCD]|[\uD836\uD83B][\uDC00-\uDDFF\uDE37-\uDE3A\uDE6D-\uDE74\uDE76-\uDE83\uDE85-\uDE9A\uDEA0\uDEB0-\uDFFF]|\uD838[\uDC07\uDC19\uDC1A\uDC22\uDC25\uDC2B-\uDCFF\uDD2D-\uDD2F\uDD3E\uDD3F\uDD4A-\uDD4D\uDD4F-\uDEBF\uDEFA-\uDFFF]|\uD83A[\uDCC5-\uDCCF\uDCD7-\uDCFF\uDD4C-\uDD4F\uDD5A-\uDFFF]|\uD83C[\uDC00-\uDD2F\uDD4A-\uDD4F\uDD6A-\uDD6F\uDD8A-\uDFFF]|\uD83E[\uDC00-\uDFEF\uDFFA-\uDFFF]|\uD869[\uDEDE-\uDEFF]|\uD86D[\uDF35-\uDF3F]|\uD86E[\uDC1E\uDC1F]|\uD873[\uDEA2-\uDEAF]|\uD87A[\uDFE1-\uDFFF]|\uD87E[\uDE1E-\uDFFF]|\uD884[\uDF4B-\uDFFF]|\uDB40[\uDC00-\uDCFF\uDDF0-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g,
      // this should be [^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]/gu, but Firefox isn't ready yet
      // transpiled by https://mothereff.in/regexpu
      "-"
    )
    .replace(/[-\s]+/gu, "-")
    .replace(/^-|-$/gu, "");
};

djangoFilters.striptags = (value) => {
  value = value.toString();
  value = value.replace(/<(?:.|\s)*?>/g, "");
  return value;
};

(function () {
  // from https://github.com/django/django/blob/7b31ba541f1dfb3a8e782b1319c25a24f9d86f8a/django/utils/timesince.py#L27
  const TIMESINCE_CHUNKS = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
  ];
  const isLeapYear = (year) => {
    if (year % 4 === 0) {
      if (year % 100 === 0) {
        if (year % 400 === 0) {
          return true;
        }
      } else {
        return true;
      }
    }
    return false;
  };
  const getLeapDays = (year1, year2) => {
    if (year1 === year2) {
      return 0;
    }
    return Array.from(Array(Math.abs(year2 - year1)).keys())
      .map((v, i) => (isLeapYear(year1 + i) ? (year2 >= year1 ? 1 : -1) : 0))
      .reduce((total, value) => total + value);
  };
  const timeSince = (d, now, reversed) => {
    d = djangoFilters._utils.parseDate(d);
    if (typeof now === "undefined") {
      now = new Date();
    } else {
      now = djangoFilters._utils.parseDate(now);
    }
    if (!(d instanceof Date) || !(now instanceof Date)) {
      return "";
    }
    if (reversed) {
      [d, now] = [now, d];
    }
    let since = Math.round((now - d) / 1000);
    let leapDays = getLeapDays(d.getFullYear(), now.getFullYear());
    if (leapDays !== 0) {
      if (isLeapYear(d.getFullYear())) {
        leapDays -= 1;
      } else if (isLeapYear(now.getFullYear())) {
        leapDays += 1;
      }
    }
    since -= leapDays * 24 * 60 * 60;
    if (since <= 0) {
      // d is in the future compared to now, stop processing.
      return djangoFilters._utils.avoidWrapping(
        `0 ${djangoFilters.pluralize(
          0,
          djangoFilters._utils.translate("timeunits", "minute").join(",")
        )}`
      );
    }
    let count, seconds, name, index;
    for (index = 0; index < TIMESINCE_CHUNKS.length; index++) {
      [seconds, name] = TIMESINCE_CHUNKS[index];
      count = Math.floor(since / seconds);
      if (count !== 0) {
        break;
      }
    }
    let result = djangoFilters._utils.avoidWrapping(
      `${count} ${djangoFilters.pluralize(
        count,
        djangoFilters._utils.translate("timeunits", name).join(",")
      )}`
    );
    if (index + 1 < TIMESINCE_CHUNKS.length) {
      const [seconds2, name2] = TIMESINCE_CHUNKS[index + 1];
      const count2 = Math.floor((since - seconds * count) / seconds2);
      if (count2 !== 0) {
        result = [
          result,
          djangoFilters._utils.translate("timeunits", "separator"),
          djangoFilters._utils.avoidWrapping(
            `${count2} ${djangoFilters.pluralize(
              count2,
              djangoFilters._utils.translate("timeunits", name2).join(",")
            )}`
          ),
        ].join("");
      }
    }
    return result;
  };
  djangoFilters.timesince = (value, compareTo) => timeSince(value, compareTo);
  djangoFilters.timeuntil = (value, compareTo) =>
    timeSince(value, compareTo, true);
})();

djangoFilters.time = (value, format) =>
  djangoFilters.date(value, format || djangoFilters.date.defaultFormats.time);

djangoFilters.title = (value) => {
  value = value.toString();
  value = value.replace(
    // eslint-disable-next-line no-misleading-character-class
    /(?:[0-9A-Z_a-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u052F\u0531-\u0556\u0559\u0560-\u0588\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05EF-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06E1-\u06E8\u06DF-\u06E4\u06ED-\u06F9\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u07FD\u0800-\u082D\u0840-\u085B\u0860-\u086A\u08A0-\u08B4\u08B6-\u08C7\u08D3-\u08E1\u08E3-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u09FC\u09FE\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0AF9-\u0AFF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B55-\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58-\u0C5A\u0C60-\u0C63\u0C66-\u0C6F\u0C80-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D00-\u0D0C\u0D0E-\u0D10\u0D12-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D54-\u0D57\u0D5F-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D81-\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E86-\u0E8A\u0E8C-\u0EA3\u0EA5\u0EA7-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F5\u13F8-\u13FD\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1878\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1AC0\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1C80-\u1C88\u1C90-\u1CBA\u1CBD-\u1CBF\u1CD0-\u1CD2\u1CD4-\u1CFA\u1D00-\u1DF9\u1DFB-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u24B6-\u24E9\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312F\u3131-\u318E\u31A0-\u31BF\u31F0-\u31FF\u3400-\u4DBF\u4E00-\u9FFC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA672\uA674-\uA67D\uA67F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA7BF\uA7C2-\uA7CA\uA7F5-\uA827\uA82C\uA840-\uA873\uA880-\uA8C5\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA8FD-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB69\uAB70-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2F\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF2D-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDCB0-\uDCD3\uDCD8-\uDCFB\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDCE0-\uDCF2\uDCF4\uDCF5\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE35\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48\uDC80-\uDCB2\uDCC0-\uDCF2\uDD00-\uDD27\uDD30-\uDD39\uDE80-\uDEA9\uDEAB\uDEAC\uDEB0\uDEB1\uDF00-\uDF1C\uDF27\uDF30-\uDF50\uDFB0-\uDFC4\uDFE0-\uDFF6]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC82-\uDCBA\uDC7F-\uDC82\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD44-\uDD47\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDC9-\uDDCC\uDDCE-\uDDDA\uDDDC\uDE00-\uDE11\uDE13-\uDE37\uDE3E\uDE80-\uDE86\uDE88\uDE8A-\uDE8D\uDE8F-\uDE9D\uDE9F-\uDEA8\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF00-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3B-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF50\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC00-\uDC4A\uDC50-\uDC59\uDC5E-\uDC61\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDDD8-\uDDDD\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB8\uDEC0-\uDEC9\uDF00-\uDF1A\uDF1D-\uDF2B\uDF30-\uDF39]|\uD806[\uDC00-\uDC3A\uDCA0-\uDCE9\uDCFF-\uDD06\uDD09\uDD0C-\uDD13\uDD15\uDD16\uDD18-\uDD35\uDD37\uDD38\uDD3B-\uDD43\uDD50-\uDD59\uDDA0-\uDDA7\uDDAA-\uDDD7\uDDDA-\uDDE1\uDDE3\uDDE4\uDE00-\uDE3E\uDE47\uDE50-\uDE99\uDE9D\uDEC0-\uDEF8]|\uD807[\uDC00-\uDC08\uDC0A-\uDC36\uDC38-\uDC40\uDC50-\uDC59\uDC72-\uDC8F\uDC92-\uDCA7\uDCA9-\uDCB6\uDD00-\uDD06\uDD08\uDD09\uDD0B-\uDD36\uDD3A\uDD3C\uDD3D\uDD3F-\uDD47\uDD50-\uDD59\uDD60-\uDD65\uDD67\uDD68\uDD6A-\uDD8E\uDD90\uDD91\uDD93-\uDD98\uDDA0-\uDDA9\uDEE0-\uDEF6\uDFB0]|\uD808[\uDC00-\uDF99]|\uD809[\uDC00-\uDC6E\uDC80-\uDD43]|[\uD80C\uD81C-\uD820\uD822\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879\uD880-\uD883][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD811[\uDC00-\uDE46]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDE40-\uDE7F\uDF00-\uDF4A\uDF4F-\uDF87\uDF8F-\uDF9F\uDFE0\uDFE1\uDFE3\uDFE4\uDFF0\uDFF1]|\uD821[\uDC00-\uDFF7]|\uD823[\uDC00-\uDCD5\uDD00-\uDD08]|\uD82C[\uDC00-\uDD1E\uDD50-\uDD52\uDD64-\uDD67\uDD70-\uDEFB]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD836[\uDE00-\uDE36\uDE3B-\uDE6C\uDE75\uDE84\uDE9B-\uDE9F\uDEA1-\uDEAF]|\uD838[\uDC00-\uDC06\uDC08-\uDC18\uDC1B-\uDC21\uDC23\uDC24\uDC26-\uDC2A\uDD00-\uDD2C\uDD30-\uDD3D\uDD40-\uDD49\uDD4E\uDEC0-\uDEF9]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6\uDD00-\uDD4B\uDD50-\uDD59]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD83C[\uDD30-\uDD49\uDD50-\uDD69\uDD70-\uDD89]|\uD83E[\uDFF0-\uDFF9]|\uD869[\uDC00-\uDEDD\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0]|\uD87E[\uDC00-\uDE1D]|\uD884[\uDC00-\uDF4A]|\uDB40[\uDD00-\uDDEF])*/gi,
    // this should be [\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]*/gu, but Firefox isn't ready yet
    // transpiled by https://mothereff.in/regexpu
    (txt) => [txt.charAt(0).toUpperCase(), txt.substr(1).toLowerCase()].join("")
  );
  // fix things like I'D
  value = value.replace(
    /([a-zA-Z])'([A-Z])/g,
    (txt, g1, g2) => `${g1}'${g2.toLowerCase()}`
  );
  return value;
};

djangoFilters.upper = (value) => value.toString().toUpperCase();

djangoFilters.urlencode = (value, safe) =>
  djangoFilters._utils.urlquote(value, safe);

// setup up the translations and add the US English variants
djangoFilters.translations = djangoFilters.translations || {};
(function () {
  const addTranslation = (languageCode, group, strings) => {
    djangoFilters.translations[languageCode] =
      djangoFilters.translations[languageCode] || {};
    djangoFilters.translations[languageCode][group] = Object.assign(
      strings,
      djangoFilters.translations[languageCode][group] || {}
    );
  };

  addTranslation("en-us", "apnumbers", {
    0: "zero",
    1: "one",
    2: "two",
    3: "three",
    4: "four",
    5: "five",
    6: "six",
    7: "seven",
    8: "eight",
    9: "nine",
  });

  addTranslation("en-us", "days:long", {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  });

  addTranslation("en-us", "days:short", {
    0: "Sun",
    1: "Mon",
    2: "Tue",
    3: "Wed",
    4: "Thu",
    5: "Fri",
    6: "Sat",
  });

  addTranslation("en-us", "filesizeformat", {
    byte: "byte",
    bytes: "bytes",
    KB: "KB",
    MB: "MB",
    GB: "GB",
    TB: "TB",
    PB: "PB",
  });

  addTranslation("en-us", "meridians", {
    am: "AM",
    pm: "PM",
    0: "midnight",
    12: "noon",
  });

  addTranslation("en-us", "meridians:ap", {
    am: "a.m.",
    pm: "p.m.",
  });

  addTranslation("en-us", "months:long", {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December",
  });

  addTranslation("en-us", "months:short", {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec",
  });

  addTranslation("en-us", "months:ap", {
    0: "Jan.",
    1: "Feb.",
    2: "March",
    3: "Apr",
    4: "May",
    5: "June",
    6: "July",
    7: "Aug.",
    8: "Sept.",
    9: "Oct.",
    10: "Nov.",
    11: "Dec.",
  });

  addTranslation("en-us", "ordinals", {
    0: "th",
    1: "st",
    2: "nd",
    3: "rd",
    4: "th",
    5: "th",
    6: "th",
    7: "th",
    8: "th",
    9: "th",
    "11-13": "th",
  });

  addTranslation("en-us", "timeunits", {
    year: ["year", "years"],
    month: ["month", "months"],
    week: ["week", "weeks"],
    day: ["day", "days"],
    hour: ["hour", "hours"],
    minute: ["minute", "minutes"],
    separator: ", ",
  });
})();

// set default language fallbacks for when there's no country code
djangoFilters.translations.en = djangoFilters.translations["en-us"];
djangoFilters.translations["en-en"] = djangoFilters.translations["en-us"];

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    djangoFilters,
  };
}
