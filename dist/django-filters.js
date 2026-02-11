(() => {
  // src/addslashes.ts
  var addslashes = (value) =>
    value
      .toString()
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/'/g, "\\'");
  var addSlashes = addslashes;

  // src/translations.ts
  var translations = {};
  (function () {
    const addTranslation = (languageCode, group, strings) => {
      translations[languageCode] = translations[languageCode] || {};
      translations[languageCode][group] = Object.assign(
        strings,
        translations[languageCode][group] || {}
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
  translations.en = translations["en-us"];
  translations["en-en"] = translations["en-us"];

  // src/_utils.ts
  var avoidWrapping = (value) => value.replace(/ /g, "\xA0");
  var padStart = (obj, len, pad) => {
    obj = obj.toString();
    pad = pad.toString();
    return obj.padStart(len, pad);
  };
  var padEnd = (obj, len, pad) => {
    obj = obj.toString();
    pad = pad.toString();
    return obj.padEnd(len, pad);
  };
  var parseDate = (value) => {
    if (value instanceof Date) {
      return value;
    } else if (typeof value === "number") {
      return new Date(value);
    }
    value = String(value);
    const date2 = new Date(value.replace(/-/g, "/").replace(/T/g, " "));
    if (date2.toString().toLowerCase() === "invalid date") {
      if (console && console.warn) {
        console.warn(`${value} was not parsed as a Date`);
      }
      return null;
    }
    return date2;
  };
  var getLanguageCode = () => {
    return (navigator && navigator.language ? navigator.language : "en-US")
      .toLowerCase()
      .replace("_", "-");
  };
  function translate(group, id, languageCode) {
    languageCode = languageCode || getLanguageCode().toLowerCase();
    let lang;
    if (translations[languageCode]) {
      lang = translations[languageCode];
    } else if (translations[languageCode.split("-")[0]]) {
      lang = translations[languageCode.split("-")[0]];
    } else {
      lang = translations["en-us"];
    }
    if (lang && lang[group]) {
      return lang[group][id];
    }
    return void 0;
  }
  translate.translations = translations;
  var urlquote = (value, safe = "/") => {
    value = value.toString();
    safe = safe
      .split("")
      .map((chr) => `\\${chr}`)
      .join("|");
    const notSafe = new RegExp(`[^${safe}]`, "g");
    return value.replace(notSafe, encodeURIComponent);
  };

  // src/apnumber.ts
  var apnumber = (value) => {
    return translate("apnumbers", value) || value.toString();
  };
  var apNumber = apnumber;

  // src/capfirst.ts
  var capfirst = (value) => {
    value = value.toString();
    return value.charAt(0).toUpperCase() + value.slice(1, value.length);
  };
  var capFirst = capfirst;

  // src/center.ts
  var center = (value, length = 0) => {
    value = value.toString();
    const right = Math.max(0, Math.ceil((length - value.length) / 2));
    value = value.padEnd(right + value.length, " ");
    value = value.padStart(length, " ");
    return value;
  };

  // src/cut.ts
  var cut = (value, toCut) => {
    const regex = new RegExp(toCut, "g");
    return value.toString().replace(regex, "");
  };

  // src/ordinal.ts
  var ordinal = (value) => {
    const num = parseInt(value.toString().replace(/[^\d]+/g, ""), 10);
    if (isNaN(num) || num >= Number.MAX_SAFE_INTEGER) {
      return null;
    }
    if ([11, 12, 13].indexOf(num % 100) > -1) {
      return [value, translate("ordinals", "11-13")].join("");
    }
    return [value, translate("ordinals", num % 10)].join("");
  };

  // src/date.ts
  function date(value, format = date.defaultFormats.date) {
    if (
      !value ||
      (value.toString && value.toString().toLowerCase() === "invalid date")
    ) {
      return null;
    }
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
          ? translate("meridians:ap", "am")
          : translate("meridians:ap", "pm"),
      A:
        value.getHours() < 12
          ? translate("meridians", "am")
          : translate("meridians", "pm"),
      b: translate("months:short", value.getMonth()).toLowerCase(),
      d: padStart(value.getDate().toString(), 2, 0),
      D: translate("days:short", value.getDay()),
      E: translate("months:long", value.getMonth()),
      f: ((v) => {
        const ret2 = [normalize12Hours(v.getHours())];
        if (v.getMinutes() !== 0) {
          ret2.push(":");
          ret2.push(padStart(v.getMinutes().toString(), 2, 0));
        }
        return ret2.map((p) => p.toString()).join("");
      })(value),
      F: translate("months:long", value.getMonth()),
      g: normalize12Hours(value.getHours()).toString(),
      G: value.getHours().toString(),
      h: padStart(normalize12Hours(value.getHours()).toString(), 2, 0),
      H: padStart(value.getHours().toString(), 2, 0),
      i: padStart(value.getMinutes().toString(), 2, 0),
      j: value.getDate().toString(),
      l: translate("days:long", value.getDay()),
      L: Boolean(new Date(value.getFullYear(), 1, 29).getDate() === 29),
      m: padStart((value.getMonth() + 1).toString(), 2, 0),
      M: translate("months:short", value.getMonth()),
      n: (value.getMonth() + 1).toString(),
      N: translate("months:ap", value.getMonth()),
      O: ((v) => {
        const offsetHours = Math.ceil(v.getTimezoneOffset() / 60),
          offsetMinutes = Math.abs(v.getTimezoneOffset() % 60);
        return (
          (offsetHours <= 0 ? "+" : "-") +
          padStart(Math.abs(offsetHours).toString(), 2, 0) +
          padStart(offsetMinutes.toString(), 2, 0)
        );
      })(value),
      P: ((v) => {
        if (
          (v.getHours() === 0 || v.getHours() === 12) &&
          v.getMinutes() === 0
        ) {
          return translate("meridians", v.getHours());
        }
        const ret2 = [normalize12Hours(v.getHours())];
        if (v.getMinutes() !== 0) {
          ret2.push(":");
          ret2.push(padStart(v.getMinutes().toString(), 2, 0));
        }
        ret2.push(" ");
        ret2.push(
          v.getHours() < 12
            ? translate("meridians:ap", "am")
            : translate("meridians:ap", "pm")
        );
        return ret2.map((p) => p.toString()).join("");
      })(value),
      s: padStart(value.getSeconds().toString(), 2, 0),
      S: ordinal(value.getDate()).replace(value.getDate().toString(), ""),
      t: (
        32 - new Date(value.getFullYear(), value.getMonth(), 32).getDate()
      ).toString(),
      T: ((v) =>
        v
          .toLocaleTimeString(navigator?.language ?? "en-US", {
            timeZoneName: "short",
          })
          .split(" ")[2])(value),
      u: (value.getMilliseconds() * 1e3).toString(),
      U: Math.floor(value.getTime() / 1e3).toString(),
      w: value.getDay().toString(),
      W: ((v) => {
        const d = new Date(
          Date.UTC(v.getFullYear(), v.getMonth(), v.getDate())
        );
        const dayNum = d.getUTCDay() || 7;
        d.setUTCDate(d.getUTCDate() + 4 - dayNum);
        const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
        return Math.ceil(
          ((d.getTime() - yearStart.getTime()) / 864e5 + 1) / 7
        ).toString();
      })(value),
      y: value.getFullYear().toString().slice(2, 4),
      Y: value.getFullYear().toString(),
      z: Math.ceil((value.getTime() - jan1.getTime()) / 864e5).toString(),
      Z: ((v) => {
        const offsetSeconds = v.getTimezoneOffset() * 60 * -1;
        return (
          (offsetSeconds < 0 ? "-" : "") +
          padEnd(Math.abs(offsetSeconds).toString(), 5, 0)
        );
      })(value),
    };
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
      padStart(formats.u, 6, 0),
    ].join("");
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
  }
  date.defaultFormats = {
    date: "N j, Y",
    time: "P",
  };

  // src/escape.ts
  var escape = (value) => {
    value = value.toString();
    value = value
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/'/g, "&#x27;")
      .replace(/"/g, "&quot;")
      .replace(/&(?!\w+;|#[0-9]+;|#x[0-9A-F]+;)/g, "&amp;");
    return value;
  };

  // src/escapejs.ts
  var translations2 = {
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
    "\0": "\\u0000",
    "": "\\u0001",
    "": "\\u0002",
    "": "\\u0003",
    "": "\\u0004",
    "": "\\u0005",
    "": "\\u0006",
    "\x07": "\\u0007",
    "\b": "\\u0008",
    "	": "\\u0009",
    "\n": "\\u000A",
    "\v": "\\u000B",
    "\f": "\\u000C",
    "\r": "\\u000D",
    "": "\\u000E",
    "": "\\u000F",
    "": "\\u0010",
    "": "\\u0011",
    "": "\\u0012",
    "": "\\u0013",
    "": "\\u0014",
    "": "\\u0015",
    "": "\\u0016",
    "": "\\u0017",
    "": "\\u0018",
    "": "\\u0019",
    "": "\\u001A",
    "\x1B": "\\u001B",
    "": "\\u001C",
    "": "\\u001D",
    "": "\\u001E",
    "": "\\u001F",
  };
  var escapejs = (value) => {
    value = value.toString();
    Object.entries(translations2).forEach((entry) => {
      const find = new RegExp(entry[0], "g");
      const replace = entry[1];
      value = value.replace(find, replace);
    });
    return value;
  };
  var escapeJs = escapejs;

  // src/filesizeformat.ts
  var filesizeNumberFormat = (number, useL10n) => {
    if (useL10n) {
      const formatter = new Intl.NumberFormat(getLanguageCode(), {
        minimumFractionDigits: 1,
      });
      return formatter.format(parseFloat(number.toFixed(1)));
    }
    return number.toFixed(1);
  };
  var KB = 1024;
  var MB = 1048576;
  var GB = 1073741824;
  var TB = 1099511627776;
  var PB = 1125899906842624;
  var filesizeformat = (bytes, useL10n = true) => {
    bytes = parseInt(bytes.toString(), 10);
    if (isNaN(bytes)) {
      return avoidWrapping(`0 ${translate("filesizeformat", "bytes")}`);
    }
    let value = "";
    const negative = bytes < 0;
    if (negative) {
      bytes = -bytes;
    }
    if (bytes < KB) {
      value = `${bytes} ${translate(
        "filesizeformat",
        bytes === 1 ? "byte" : "bytes"
      )}`;
    } else if (bytes < MB) {
      value = `${filesizeNumberFormat(
        bytes / KB,
        useL10n
      )} ${translate("filesizeformat", "KB")}`;
    } else if (bytes < GB) {
      value = `${filesizeNumberFormat(
        bytes / MB,
        useL10n
      )} ${translate("filesizeformat", "MB")}`;
    } else if (bytes < TB) {
      value = `${filesizeNumberFormat(
        bytes / GB,
        useL10n
      )} ${translate("filesizeformat", "GB")}`;
    } else if (bytes < PB) {
      value = `${filesizeNumberFormat(
        bytes / TB,
        useL10n
      )} ${translate("filesizeformat", "TB")}`;
    } else {
      value = `${filesizeNumberFormat(
        bytes / PB,
        useL10n
      )} ${translate("filesizeformat", "PB")}`;
    }
    if (negative) {
      value = `-${value}`;
    }
    return avoidWrapping(value);
  };
  var fileSizeFormat = filesizeformat;

  // src/force_escape.ts
  var force_escape = (value) => {
    return escape(value);
  };
  var forceEscape = force_escape;

  // src/floatformat.ts
  var floatformat = (value, precision = -1) => {
    const grouping = precision.toString().endsWith("g");
    precision = parseInt(precision.toString().replace("g", ""), 10);
    if (value === Number.POSITIVE_INFINITY) {
      return "inf";
    } else if (value === Number.NEGATIVE_INFINITY) {
      return "-inf";
    } else if (value === null || isNaN(value)) {
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
    const formatter = new Intl.NumberFormat(
      getLanguageCode(),
      formatterOptions
    );
    let output = formatter.format(value);
    if (parseFloat(output) === 0) {
      if (output.startsWith("-")) {
        output = output.replace(/^-/, "");
      }
    }
    return output;
  };
  var floatFormat = floatformat;

  // src/intcomma.ts
  var intcomma = (value) => {
    const valueAsArray = value.toString().split(".");
    const int = valueAsArray[0];
    const parts = [int.replace(/\B(?=(\d{3})+(?!\d))/g, ",")];
    if (valueAsArray.length > 1) {
      parts.push(valueAsArray.slice(1).join("."));
    }
    return parts.join(".");
  };

  // src/iriencode.ts
  var iriencode = (value) => {
    value = value.toString();
    return urlquote(value, "/#%[]=:;$&()+,!?*@'~");
  };
  var iriEncode = iriencode;

  // src/linebreaks.ts
  var linebreaks = (value, autoescape = true) => {
    value = value.toString();
    value = value.replace(/\r\n|\r/g, "\n");
    let valueAsArray = value.split(/\n{2,}/g);
    if (autoescape) {
      valueAsArray = valueAsArray.map(
        (para) => `<p>${escape(para).replace(/\n/g, "<br>")}</p>`
      );
    } else {
      valueAsArray = valueAsArray.map(
        (para) => `<p>${para.replace(/\n/g, "<br>")}</p>`
      );
    }
    value = valueAsArray.join("\n\n");
    return value;
  };

  // src/linebreaksbr.ts
  var linebreaksbr = (value, autoescape = true) => {
    value = value.toString();
    value = value.replace(/\r\n|\r/g, "\n");
    if (autoescape) {
      value = escape(value);
    }
    value = value.replace(/\n/g, "<br>");
    return value;
  };
  var linebreaksBr = linebreaksbr;

  // src/linenumbers.ts
  var linenumbers = (value, autoescape = true) => {
    value = value.toString();
    let lines = value.split("\n");
    const width = lines.length.toString().length;
    lines = lines.map((line, index) => {
      const lineNumber = padStart((index + 1).toString(), width, "0");
      if (autoescape) {
        line = escape(line);
      }
      return `${lineNumber}. ${line}`;
    });
    return lines.join("\n");
  };
  var lineNumbers = linenumbers;

  // src/ljust.ts
  var ljust = (value, width = 0) => padEnd(value, width, " ");

  // src/phone2numeric.ts
  var phone2numeric = (value) => {
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
  var phone2Numeric = phone2numeric;

  // src/pluralize.ts
  var pluralize = (value, suffixes = ",s") => {
    if (suffixes.indexOf(",") === -1) {
      suffixes = `,${suffixes}`;
    }
    if (suffixes.split(",").length > 2) {
      return "";
    }
    const [singularSuffix, pluralSuffix] = suffixes.split(",");
    if (typeof value === "number" || typeof value === "string") {
      value = parseFloat(value.toString());
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

  // src/rjust.ts
  var rjust = (value, width = 0) => padStart(value, width || 0, " ");

  // src/slugify.ts
  var slugify = (value, allowUnicode = false) => {
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
        /[^\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]/gu,
        "-"
      )
      .replace(/[-\s]+/gu, "-")
      .replace(/^-|-$/gu, "");
  };

  // src/striptags.ts
  var striptags = (value) => {
    value = value.toString();
    let result = "";
    let insideTag = false;
    for (let i = 0; i < value.length; i++) {
      const char = value[i];
      if (char === "<") {
        insideTag = true;
      } else if (char === ">" && insideTag) {
        insideTag = false;
      } else if (!insideTag) {
        result += char;
      }
    }
    return result;
  };
  var stripTags = striptags;

  // src/time.ts
  function time(value, format = date.defaultFormats.time) {
    return date(value, format);
  }

  // src/timesince.ts
  var _TIMESINCE_CHUNKS = [
    [60 * 60 * 24 * 365, "year"],
    [60 * 60 * 24 * 30, "month"],
    [60 * 60 * 24 * 7, "week"],
    [60 * 60 * 24, "day"],
    [60 * 60, "hour"],
    [60, "minute"],
  ];
  var _isLeapYear = (year) => {
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
  var _getLeapDays = (year1, year2) => {
    if (year1 === year2) {
      return 0;
    }
    return Array.from(Array(Math.abs(year2 - year1)).keys())
      .map((_, i) => (_isLeapYear(year1 + i) ? (year2 >= year1 ? 1 : -1) : 0))
      .reduce((total, value) => total + value);
  };
  var _timeSince = (d, now = void 0, reversed = false) => {
    d = parseDate(d);
    if (typeof now === "undefined") {
      now = /* @__PURE__ */ new Date();
    } else {
      now = parseDate(now);
    }
    if (!(d instanceof Date) || !(now instanceof Date)) {
      return "";
    }
    if (reversed) {
      [d, now] = [now, d];
    }
    let since = Math.round((now.getTime() - d.getTime()) / 1e3);
    let leapDays = _getLeapDays(d.getFullYear(), now.getFullYear());
    if (leapDays !== 0) {
      if (_isLeapYear(d.getFullYear())) {
        leapDays -= 1;
      } else if (_isLeapYear(now.getFullYear())) {
        leapDays += 1;
      }
    }
    since -= leapDays * 24 * 60 * 60;
    if (since <= 0) {
      return avoidWrapping(
        `0 ${pluralize(0, translate("timeunits", "minute")?.join(","))}`
      );
    }
    let count, seconds, name, index;
    for (index = 0; index < _TIMESINCE_CHUNKS.length; index++) {
      [seconds, name] = _TIMESINCE_CHUNKS[index];
      count = Math.floor(since / seconds);
      if (count !== 0) {
        break;
      }
    }
    let result = avoidWrapping(
      `${count} ${pluralize(count, translate("timeunits", name)?.join(","))}`
    );
    if (index + 1 < _TIMESINCE_CHUNKS.length) {
      const [seconds2, name2] = _TIMESINCE_CHUNKS[index + 1];
      const count2 = Math.floor((since - seconds * count) / seconds2);
      if (count2 !== 0) {
        result = [
          result,
          translate("timeunits", "separator"),
          avoidWrapping(
            `${count2} ${pluralize(
              count2,
              translate("timeunits", name2)?.join(",")
            )}`
          ),
        ].join("");
      }
    }
    return result;
  };
  var timesince = (value, compareTo = void 0) => _timeSince(value, compareTo);
  var timeuntil = (value, compareTo = void 0) =>
    _timeSince(value, compareTo, true);
  var timeSince = timesince;
  var timeUntil = timeuntil;

  // src/title.ts
  var title = (value) => {
    value = value.toString();
    value = value.replace(
      /[\p{Alphabetic}\p{Mark}\p{Decimal_Number}\p{Connector_Punctuation}\p{Join_Control}]*/gu,
      (txt) =>
        [
          txt.charAt(0).toUpperCase(),
          txt.slice(1, txt.length).toLowerCase(),
        ].join("")
    );
    value = value.replace(
      /([a-zA-Z])'([A-Z])/g,
      (_, g1, g2) => `${g1}'${g2.toLowerCase()}`
    );
    return value;
  };

  // src/upper.ts
  var upper = (value) => value.toString().toUpperCase();

  // src/urlencode.ts
  var urlencode = urlquote;
  var urlEncode = urlencode;

  // src/index.ts
  var index_default = {
    addslashes,
    addSlashes,
    apnumber,
    apNumber,
    capfirst,
    capFirst,
    center,
    cut,
    date,
    escape,
    escapejs,
    escapeJs,
    filesizeformat,
    fileSizeFormat,
    force_escape,
    forceEscape,
    floatformat,
    floatFormat,
    intcomma,
    iriencode,
    iriEncode,
    linebreaks,
    linebreaksbr,
    linebreaksBr,
    linenumbers,
    lineNumbers,
    ljust,
    ordinal,
    phone2numeric,
    phone2Numeric,
    pluralize,
    rjust,
    slugify,
    striptags,
    stripTags,
    time,
    timesince,
    timeSince,
    timeuntil,
    timeUntil,
    title,
    upper,
    urlencode,
    urlEncode,
  };

  // src/django-filters.ts
  window.djangoFilters = index_default;
})();
