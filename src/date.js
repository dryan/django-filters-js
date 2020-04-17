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
