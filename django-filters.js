const djangoFilters = window.djangoFilters || {};

djangoFilters._utils = {
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
    }
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
};

djangoFilters.addslashes = (value) =>
  value
    .toString()
    .replace(/\\/g, String.raw`\\`)
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'");

djangoFilters.apnumber = (number) => {
  return (
    djangoFilters._utils.translate("apnumbers", number) || number.toString()
  );
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

djangoFilters.date = (date, format) => {
  /*
    To escape a character, use '%'; to print a literal '%', use '%%'.
    Otherwise, formatting follows https://docs.djangoproject.com/en/1.3/ref/templates/builtins/#date.
  */
  if (
    !date ||
    (date.toString && date.toString().toLowerCase() === "invalid date")
  ) {
    return date;
  }
  format = format || djangoFilters.date.defaultFormats.date;
  const jan1 = new Date(date.getFullYear(), 0, 1);

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
      date.getHours() < 12
        ? djangoFilters._utils.translate("meridians:ap", "am")
        : djangoFilters._utils.translate("meridians:ap", "pm"),
    A:
      date.getHours() < 12
        ? djangoFilters._utils.translate("meridians", "am")
        : djangoFilters._utils.translate("meridians", "pm"),
    b: djangoFilters._utils
      .translate("months:short", date.getMonth())
      .toLowerCase(),
    d: djangoFilters._utils.padStart(date.getDate(), 2, 0),
    D: djangoFilters._utils.translate("days:short", date.getDay()),
    E:
      djangoFilters._utils.translate("months:locale", date.getMonth()) ||
      djangoFilters._utils.translate("months:long", date.getMonth()),
    f: ((date) => {
      const ret = [normalize12Hours(date.getHours())];
      if (date.getMinutes() !== 0) {
        ret.push(":");
        ret.push(djangoFilters._utils.padStart(date.getMinutes(), 2, 0));
      }
      return ret.join("");
    })(date),
    F: djangoFilters._utils.translate("months:long", date.getMonth()),
    g: normalize12Hours(date.getHours()),
    G: date.getHours(),
    h: djangoFilters._utils.padStart(normalize12Hours(date.getHours()), 2, 0),
    H: djangoFilters._utils.padStart(date.getHours(), 2, 0),
    i: djangoFilters._utils.padStart(date.getMinutes(), 2, 0),
    j: date.getDate(),
    l: djangoFilters._utils.translate("days:long", date.getDay()),
    L: Boolean(new Date(date.getFullYear(), 1, 29).getDate() === 29),
    m: djangoFilters._utils.padStart(date.getMonth() + 1, 2, 0),
    M: djangoFilters._utils.translate("months:short", date.getMonth()),
    n: date.getMonth() + 1,
    N: djangoFilters._utils.translate("months:ap", date.getMonth()),
    O: ((date) => {
      const offsetHours = Math.ceil(date.getTimezoneOffset() / 60),
        offsetMinutes = date.getTimezoneOffset() % 60;
      return (
        (offsetHours <= 0 ? "+" : "-") +
        djangoFilters._utils.padStart(offsetHours, 2, 0) +
        djangoFilters._utils.padStart(offsetMinutes, 2, 0)
      );
    })(date),
    P: ((date) => {
      if (
        (date.getHours() === 0 || date.getHours() === 12) &&
        date.getMinutes() === 0
      ) {
        return djangoFilters._utils.translate("meridians", date.getHours());
      }
      const ret = [normalize12Hours(date.getHours())];
      if (date.getMinutes() !== 0) {
        ret.push(":");
        ret.push(djangoFilters._utils.padStart(date.getMinutes(), 2, 0));
      }
      ret.push(" ");
      ret.push(
        date.getHours() < 12
          ? djangoFilters._utils.translate("meridians:ap", "am")
          : djangoFilters._utils.translate("meridians:ap", "pm")
      );
      return ret.join("");
    })(date),
    s: djangoFilters._utils.padStart(date.getSeconds(), 2, 0),
    S: djangoFilters.ordinal(date.getDate()).replace(date.getDate(), ""),
    t: 32 - new Date(date.getYear(), date.getMonth(), 32).getDate(),
    T: ((date) =>
      date
        .toLocaleTimeString(navigator ? navigator.language : "en-US", {
          timeZoneName: "short",
        })
        .split(" ")[2])(date),
    u: date.getMilliseconds() * 1000,
    U: Math.floor(date.getTime() / 1000),
    w: date.getDay(),
    W: ((date) => {
      // from https://stackoverflow.com/a/6117889/2918278
      const d = new Date(
        Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
      );
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
    })(date),
    y: date.getFullYear().toString().substr(2),
    Y: date.getFullYear(),
    z: Math.ceil((date - jan1) / 86400000),
    Z: ((date) => {
      const offsetSeconds = date.getTimezoneOffset() * 60 * -1;
      return (
        (offsetSeconds < 0 ? "-" : "") +
        djangoFilters._utils.padEnd(Math.abs(offsetSeconds), 5, 0)
      );
    })(date),
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

  format = format.split("");
  format.reverse();
  const ret = [];
  for (let i = format.length - 1; i >= 0; i--) {
    const f = format[i];
    ret.push(f in formats ? formats[f] : f);
  }
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
    return `0\xa0${djangoFilters._utils.translate("filesizeformat", "bytes")}`;
  }

  const filesize_number_format = (number) => {
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
    value = `${filesize_number_format(
      bytes / KB
    )} ${djangoFilters._utils.translate("filesizeformat", "KB")}`;
  } else if (bytes < GB) {
    value = `${filesize_number_format(
      bytes / MB
    )} ${djangoFilters._utils.translate("filesizeformat", "MB")}`;
  } else if (bytes < TB) {
    value = `${filesize_number_format(
      bytes / GB
    )} ${djangoFilters._utils.translate("filesizeformat", "GB")}`;
  } else if (bytes < PB) {
    value = `${filesize_number_format(
      bytes / TB
    )} ${djangoFilters._utils.translate("filesizeformat", "TB")}`;
  } else {
    value = `${filesize_number_format(
      bytes / PB
    )} ${djangoFilters._utils.translate("filesizeformat", "PB")}`;
  }

  if (negative) {
    value = `-${value}`;
  }

  return value.replace(/\s/g, "\xa0");
};

djangoFilters.intcomma = (number) => {
  number = number.toString().split(".");
  const int = number[0];
  const parts = [int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")];
  if (number.length > 1) {
    parts.push(number.slice(1).join("."));
  }
  return parts.join(".");
};

djangoFilters.ordinal = (number) => {
  const num = parseInt(
    number.toString().replace(/[^\d]+/g, ""),
    10
  ).toPrecision();
  if (isNaN(num) || num >= Number.MAX_SAFE_INTEGER) {
    return number;
  }

  if ([11, 12, 13].indexOf(num % 100) > -1) {
    return [number, djangoFilters._utils.translate("ordinals", "11-13")].join(
      ""
    );
  }
  return [number, djangoFilters._utils.translate("ordinals", num % 10)].join(
    ""
  );
};

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

djangoFilters.time = (date, format) =>
  djangoFilters.date(date, format || djangoFilters.date.defaultFormats.time);

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
})();

// set default language fallbacks for when there's no country code
djangoFilters.translations.en = djangoFilters.translations["en-us"];
djangoFilters.translations["en-en"] = djangoFilters.translations["en-us"];

/*
  Now make these into a chainable object
*/

class DjangoFilterString extends String {
  constructor(value) {
    super(value);
    this.value = value;
  }

  // built-in JS methods

  toString() {
    return this.value;
  }

  valueOf() {
    return this.value;
  }

  // default Django filters

  addslashes() {
    this.value = djangoFilters.addslashes(this.value);
    return this;
  }

  capfirst() {
    this.value = djangoFilters.capfirst(this.value);
    return this;
  }

  center(length) {
    this.value = djangoFilters.center(this.value, length);
    return this;
  }

  cut(toCut) {
    this.value = djangoFilters.cut(this.value, toCut);
    return this;
  }

  date(format) {
    const date = djangoFilters._utils.parseDate(this.value);
    if (date.toString() !== this.value) {
      this.value = djangoFilters.date(date, format);
    }
    return this;
  }

  escape() {
    this.value = djangoFilters.escape(this.value);
    return this;
  }

  escapejs() {
    this.value = djangoFilters.escapejs(this.value);
    return this;
  }

  filesizeformat() {
    this.value = djangoFilters.filesizeformat(this.value);
    return this;
  }

  slugify() {
    this.value = djangoFilters.slugify(this.value);
    return this;
  }

  time(format) {
    const date = djangoFilters._utils.parseDate(this.value);
    if (date.toString() !== this.value) {
      this.value = djangoFilters.time(date, format);
    }
    return this;
  }

  // django.contrib.humanize filters

  apnumber() {
    this.value = djangoFilters.apnumber(this.value);
    return this;
  }

  intcomma() {
    this.value = djangoFilters.intcomma(this.value);
    return this;
  }

  ordinal() {
    this.value = djangoFilters.ordinal(this.value);
    return this;
  }
}

const djangoFilter = (text) => {
  return new DjangoFilterString(text);
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    djangoFilters,
    djangoFilter,
  };
}
