export const djangoFilters = window.djangoFilters || {};
window.djangoFilters = djangoFilters;

djangoFilters.utils = {
  trim: (text) => (text === null ? "" : String.prototype.trim.call(text)),

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

  parseDate: (string) => {
    if (string instanceof Date) {
      return string;
    }
    let date = new Date(string.replace(/-/g, "/").replace(/T/g, " "));
    if (date.toString().toLowerCase() === "invalid date") {
      console && console.warn
        ? console.warn(`${string} was not parsed as a Date`)
        : null;
      return string;
    }
    return date;
  },
};

const utils = djangoFilters.utils;

djangoFilters.intcomma = (number) =>
  number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

djangoFilters.apnumber = (number) => {
  let origNumber = number;
  number = parseInt(String(number).replace(/[^\d]+/g, ""), 10);
  if (isNaN(number)) {
    return origNumber;
  }
  return djangoFilters.apnumber.numbers.current[number] || String(number);
};

djangoFilters.apnumber.numbers = {
  "en-us": [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ],
};
djangoFilters.apnumber.numbers.en = djangoFilters.apnumber.numbers["en-us"];
if (navigator.language && djangoFilters.apnumber.numbers[navigator.language]) {
  djangoFilters.apnumber.numbers.current =
    djangoFilters.apnumber.numbers[navigator.language];
} else {
  djangoFilters.apnumber.numbers.current =
    djangoFilters.apnumber.numbers["en-us"];
}

djangoFilters.apnumber_reverse = (number) => {
  let origNumber = number;
  number = utils.trim(number);
  for (let i = djangoFilters.apnumber.numbers.current.length - 1; i >= 0; i--) {
    if (number === djangoFilters.apnumber.numbers.current[i]) {
      return i;
    }
  }
  number = parseInt(String(number).replace(/[^\d]+/g, ""), 10);
  if (isNaN(number)) {
    number = origNumber;
  }
  return number;
};

djangoFilters.slugify = (str) => {
  return utils
    .trim(str)
    .replace(/[^a-zA-Z0-9-._~]/g, "-")
    .toLowerCase()
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .replace(/-+/g, "-");
};

djangoFilters.ordinal = (number) => {
  let num = parseInt(String(number).replace(/[^\d]+/g, ""), 10);
  if (isNaN(num)) {
    return number;
  }

  if ([11, 12, 13].indexOf(num % 100) > -1) {
    return [number, djangoFilters.ordinal.suffixes.current["11-13"]].join("");
  }
  return [number, djangoFilters.ordinal.suffixes.current[num % 10]].join("");
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
  let jan1 = new Date(date.getFullYear(), 0, 1);

  let normalize12Hours = (hours) => {
    if (hours > 12) {
      hours = hours - 12;
    } else if (hours === 0) {
      hours = 12;
    }
    return hours;
  };

  let formats = {
    a:
      date.getHours() < 12
        ? djangoFilters.date.meridians.current.ap.am
        : djangoFilters.date.meridians.current.ap.pm,
    A:
      date.getHours() < 12
        ? djangoFilters.date.meridians.current.normal.am
        : djangoFilters.date.meridians.current.normal.pm,
    b: djangoFilters.date.months.current.s[date.getMonth()].toLowerCase(),
    d: utils.padStart(date.getDate(), 2, 0),
    D: djangoFilters.date.days.current.s[date.getDay()],
    E: djangoFilters.date.months.current.locale
      ? djangoFilters.date.months.current.locale[date.getMonth()]
      : djangoFilters.date.months.current.l[date.getMonth()],
    f: ((date) => {
      let ret = [normalize12Hours(date.getHours())];
      if (date.getMinutes() !== 0) {
        ret.push(":");
        ret.push(utils.padStart(date.getMinutes(), 2, 0));
      }
      return ret.join("");
    })(date),
    F: djangoFilters.date.months.current.l[date.getMonth()],
    g: normalize12Hours(date.getHours()),
    G: date.getHours(),
    h: utils.padStart(normalize12Hours(date.getHours()), 2, 0),
    H: utils.padStart(date.getHours(), 2, 0),
    i: utils.padStart(date.getMinutes(), 2, 0),
    j: date.getDate(),
    l: djangoFilters.date.days.current.l[date.getDay()],
    L: Boolean(new Date(date.getFullYear(), 1, 29).getDate() === 29),
    m: utils.padStart(date.getMonth() + 1, 2, 0),
    M: djangoFilters.date.months.current.s[date.getMonth()],
    n: date.getMonth() + 1,
    N: djangoFilters.date.months.current.ap[date.getMonth()],
    O: ((date) => {
      let offsetHours = Math.ceil(date.getTimezoneOffset() / 60),
        offsetMinutes = date.getTimezoneOffset() % 60;
      return (
        (offsetHours <= 0 ? "+" : "-") +
        utils.padStart(offsetHours, 2, 0) +
        utils.padStart(offsetMinutes, 2, 0)
      );
    })(date),
    P: ((date) => {
      if (
        (date.getHours() === 0 || date.getHours() === 12) &&
        date.getMinutes() === 0
      ) {
        return djangoFilters.date.meridians.current.normal[date.getHours()];
      }
      let ret = [normalize12Hours(date.getHours())];
      if (date.getMinutes() !== 0) {
        ret.push(":");
        ret.push(utils.padStart(date.getMinutes(), 2, 0));
      }
      ret.push(" ");
      ret.push(
        date.getHours() < 12
          ? djangoFilters.date.meridians.current.ap.am
          : djangoFilters.date.meridians.current.ap.pm
      );
      return ret.join("");
    })(date),
    s: utils.padStart(date.getSeconds(), 2, 0),
    S: djangoFilters.ordinal(date.getDate()).replace(date.getDate(), ""),
    t: 32 - new Date(date.getYear(), date.getMonth(), 32).getDate(),
    T: ((date) =>
      date
        .toLocaleTimeString(navigator.language, { timeZoneName: "short" })
        .split(" ")[2])(date),
    u: date.getMilliseconds() * 1000,
    U: Math.floor(date.getTime() / 1000),
    w: date.getDay(),
    W: ((date) => {
      // based on http://www.meanfreepath.com/support/getting_iso_week.html
      let newYearDoW = jan1.getDay();
      newYearDoW = newYearDoW >= 0 ? newYearDoW : newYearDoW + 7;
      let dayNum =
          Math.floor(
            (date.getTime() -
              jan1.getTime() -
              (date.getTimezoneOffset() - jan1.getTimezoneOffset()) * 60000) /
              86400000
          ) + 1,
        weekNum;
      if (newYearDoW < 4) {
        weekNum = Math.floor((dayNum + newYearDoW - 1) / 7) + 1;
        if (weekNum > 52) {
          newYearDoW = new Date(date.getFullYear() + 1, 0, 1).getDay();
          newYearDoW = newYearDoW >= 0 ? newYearDoW : newYearDoW + 7;
          weekNum = newYearDoW < 4 ? 1 : 53;
        }
      } else {
        weekNum = Math.floor((dayNum + newYearDoW - 1) / 7);
      }
      return weekNum > 0 ? weekNum : 1;
    })(date),
    y: date.getFullYear().toString().substr(2),
    Y: date.getFullYear(),
    z: Math.ceil((date - jan1) / 86400000),
    Z: ((date) => {
      let offsetSeconds = date.getTimezoneOffset() * 60 * -1;
      return (
        (offsetSeconds < 0 ? "-" : "") +
        utils.padEnd(Math.abs(offsetSeconds), 5, 0)
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
    utils.padStart(formats.u, 6, 0),
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
  let ret = [],
    lastChar;
  for (let i = format.length - 1; i >= 0; i--) {
    let f = format[i];
    if (lastChar === "%" || f === "%") {
      if (lastChar === "%") {
        ret.push(f);
      }
      lastChar = f;
      continue;
    }
    ret.push(f in formats ? formats[f] : f);
  }
  if (ret.length === 1 && typeof ret[0] === "boolean") {
    return ret[0];
  }
  return ret.join("");
};

djangoFilters.time = (date, format) => {
  return djangoFilters.date(
    date,
    format || djangoFilters.date.defaultFormats.time
  );
};

djangoFilters.cut = (str, toCut) => {
  let regex = new RegExp(toCut, "g");
  return String(str).replace(regex, "");
};

djangoFilters.date.defaultFormats = {
  date: "N j, Y",
  time: "P",
};

djangoFilters.ordinal.suffixes = {
  "en-us": {
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
  },
};

djangoFilters.date.months = {
  "en-us": {
    // long
    l: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    // short
    s: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    // A.P. style
    ap: [
      "Jan.",
      "Feb.",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug.",
      "Sept.",
      "Oct.",
      "Nov.",
      "Dec.",
    ],
  },
};

djangoFilters.date.days = {
  "en-us": {
    // long
    l: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ],
    // short
    s: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
  },
};

djangoFilters.date.meridians = {
  "en-us": {
    ap: {
      am: "a.m.",
      pm: "p.m.",
    },
    normal: {
      am: "AM",
      pm: "PM",
      0: "midnight",
      12: "noon",
    },
  },
};

let translatable = ["months", "meridians", "days", "suffixes"];
for (let i = translatable.length - 1; i >= 0; i--) {
  let group;
  if (translatable[i] === "suffixes") {
    group = djangoFilters.ordinal[translatable[i]];
  } else {
    group = djangoFilters.date[translatable[i]];
  }
  if (group) {
    if (group["en-us"]) {
      group.en = group["en-us"];
    }
    if (navigator.language && group[navigator.language]) {
      group.current = group[navigator.language];
    } else {
      group.current = group["en-us"];
    }
  }
}

/*
    Now make these into a chainable object
  */

class DjangoFilterString extends String {
  constructor(value) {
    super(value);
    this.value = value;
  }

  toString() {
    return this.value;
  }

  valueOf() {
    return this.value;
  }

  apnumber() {
    this.value = djangoFilters.apnumber(this.value);
    return this;
  }

  apnumber_reverse() {
    this.value = djangoFilters.apnumber_reverse(this.value);
    return this;
  }

  cut(toCut) {
    this.value = djangoFilters.cut(this.value, toCut);
    return this;
  }

  date(format) {
    let date = djangoFilters.utils.parseDate(this.value);
    if (date.toString() !== this.value) {
      this.value = djangoFilters.date(date, format);
    }
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

  slugify() {
    this.value = djangoFilters.slugify(this.value);
    return this;
  }

  time(format) {
    let date = djangoFilters.utils.parseDate(this.value);
    if (date.toString() !== this.value) {
      this.value = djangoFilters.time(date, format);
    }
    return this;
  }

  trim() {
    this.value = djangoFilters.utils.trim(this.value);
    return this;
  }
}

export const djangoFilter = (text) => {
  return new DjangoFilterString(text);
};
window.djangoFilter = djangoFilter;
