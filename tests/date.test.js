import { date } from "../dist/date.js";
import { time } from "../dist/time.js";
import { makeConstructor } from "timezoned-date";

const dates = [
  new Date(2000, 0, 1, 0, 0, 0),
  new Date(2008, 1, 29, 12, 30, 5, 777),
  new Date(2011, 5, 6, 18, 48, 23, 999),
  new Date(2011, 5, 6, 12, 0, 0),
  new Date(1977, 11, 3, 9, 30),
];

const formats = {
  a: "'a.m.' or 'p.m.'",
  A: "AM or PM",
  b: "Month, textual, 3 letters, lowercase",
  c: "ISO 8601 Format",
  d: "Day of the month, 2 digits with leading zeros",
  D: "Day of the week, textual, 3 letters",
  E: "Month, locale specific alternative representation usually used for long date representation",
  f: "Time, in 12-hour hours and minutes, with minutes left off if they're zero",
  F: "Month, textual, long",
  g: "Hour, 12-hour format without leading zeros",
  G: "Hour, 24-hour format without leading zeros",
  h: "Hour, 12-hour format",
  H: "Hour, 24-hour format",
  i: "Minutes",
  j: "Day of the month without leading zeros",
  l: "Day of the week, textual, long",
  L: "Boolean for whether it's a leap year",
  m: "Month, 2 digits with leading zeros",
  M: "Month, textual, 3 letters",
  n: "Month without leading zeros",
  N: "Month abbreviation in Associated Press style",
  O: "Difference to Greenwich time in hours",
  P: "Time, in 12-hour hours, minutes and 'a.m.'/'p.m.', with minutes left off if they're zero and the special-case strings 'midnight' and 'noon' if appropriate",
  r: "RFC 2822 formatted date",
  s: "Seconds, 2 digits with leading zeros",
  S: "English ordinal suffix for day of the month, 2 characters",
  t: "Number of days in the given month",
  T: "Time zone of the user's machine",
  u: "Microseconds",
  U: "Seconds since the Unix Epoch (January 1 1970 00:00:00 UTC)",
  w: "Day of the week, digits without leading zeros",
  W: "ISO-8601 week number of year, with weeks starting on Monday",
  y: "Year, 2 digits",
  Y: "Year, 4 digits",
  z: "Day of the year",
  Z: "Time zone offset in seconds. The offset for timezones west of UTC is always negative, and for those east of UTC is always positive.",
};

const answers = [
  {
    a: "a.m.",
    A: "AM",
    b: "jan",
    c: "2000-01-01T00:00:00.000000",
    d: "01",
    D: "Sat",
    E: "January",
    f: "12",
    F: "January",
    g: "12",
    G: "0",
    h: "12",
    H: "00",
    i: "00",
    j: "1",
    l: "Saturday",
    L: true,
    m: "01",
    M: "Jan",
    n: "1",
    N: "Jan.",
    O: "-0500",
    P: "midnight",
    r: "Sat, 1 Jan 2000 00:00:00 -0500",
    s: "00",
    S: "st",
    t: "31",
    T: "EST",
    u: "0",
    U: "946702800",
    w: "6",
    W: "52",
    y: "00",
    Y: "2000",
    z: "0",
    Z: "-18000",
  },
  {
    a: "p.m.",
    A: "PM",
    b: "feb",
    c: "2008-02-29T12:30:05.777000",
    d: "29",
    D: "Fri",
    E: "February",
    f: "12:30",
    F: "February",
    g: "12",
    G: "12",
    h: "12",
    H: "12",
    i: "30",
    j: "29",
    l: "Friday",
    L: true,
    m: "02",
    M: "Feb",
    n: "2",
    N: "Feb.",
    O: "-0500",
    P: "12:30 p.m.",
    r: "Fri, 29 Feb 2008 12:30:05 -0500",
    s: "05",
    S: "th",
    t: "29",
    T: "EST",
    u: "777000",
    U: "1204306205",
    w: "5",
    W: "9",
    y: "08",
    Y: "2008",
    z: "60",
    Z: "-18000",
  },
  {
    a: "p.m.",
    A: "PM",
    b: "jun",
    c: "2011-06-06T18:48:23.999000",
    d: "06",
    D: "Mon",
    E: "June",
    f: "6:48",
    F: "June",
    g: "6",
    G: "18",
    h: "06",
    H: "18",
    i: "48",
    j: "6",
    l: "Monday",
    L: false,
    m: "06",
    M: "Jun",
    n: "6",
    N: "June",
    O: "-0400",
    P: "6:48 p.m.",
    r: "Mon, 6 Jun 2011 18:48:23 -0400",
    s: "23",
    S: "th",
    t: "30",
    T: "EDT",
    u: "999000",
    U: "1307400503",
    w: "1",
    W: "23",
    y: "11",
    Y: "2011",
    z: "157",
    Z: "-14400",
  },
  {
    a: "p.m.",
    A: "PM",
    b: "jun",
    c: "2011-06-06T12:00:00.000000",
    d: "06",
    D: "Mon",
    E: "June",
    f: "12",
    F: "June",
    g: "12",
    G: "12",
    h: "12",
    H: "12",
    i: "00",
    j: "6",
    l: "Monday",
    L: false,
    m: "06",
    M: "Jun",
    n: "6",
    N: "June",
    O: "-0400",
    P: "noon",
    r: "Mon, 6 Jun 2011 12:00:00 -0400",
    s: "00",
    S: "th",
    t: "30",
    T: "EDT",
    u: "0",
    U: "1307376000",
    w: "1",
    W: "23",
    y: "11",
    Y: "2011",
    z: "157",
    Z: "-14400",
  },
  {
    a: "a.m.",
    A: "AM",
    b: "dec",
    c: "1977-12-03T09:30:00.000000",
    d: "03",
    D: "Sat",
    E: "December",
    f: "9:30",
    F: "December",
    g: "9",
    G: "9",
    h: "09",
    H: "09",
    i: "30",
    j: "3",
    l: "Saturday",
    L: false,
    m: "12",
    M: "Dec",
    n: "12",
    N: "Dec.",
    O: "-0500",
    P: "9:30 a.m.",
    r: "Sat, 3 Dec 1977 09:30:00 -0500",
    s: "00",
    S: "rd",
    t: "31",
    T: "EST",
    u: "0",
    U: "250007400",
    w: "6",
    W: "48",
    y: "77",
    Y: "1977",
    z: "337",
    Z: "-18000",
  },
];

describe("date", () => {
  dates.forEach((d, index) => {
    let answer = answers[index];
    Object.keys(formats).forEach((formatChar) => {
      let formatDescription = formats[formatChar];
      test(`${d} - ${formatDescription}`, () => {
        expect(date(d, formatChar)).toBe(answer[formatChar]);
      });
    });
  });

  test("T format with no navigator.language", () => {
    Object.defineProperty(global, "navigator", {
      value: {
        language: undefined,
      },
    });
    expect(date(new Date(2000, 0, 1, 0, 0, 0), "T")).toBe("EST");
  });

  test("default date format", () => {
    expect(date(dates[0])).toBe("Jan. 1, 2000");
  });

  test("default time format", () => {
    expect(time(dates[0])).toBe("midnight");
  });

  test("date with positive timezone offset", () => {
    let tzDate = makeConstructor(240);
    expect(date(new tzDate(2000, 0, 1, 0, 0, 0), "O")).toBe("+0400");
  });

  test("date with negative timezone offset", () => {
    let tzDate = makeConstructor(-240);
    expect(date(new tzDate(2000, 0, 1, 0, 0, 0), "O")).toBe("-0400");
  });

  test("date with UTC offset", () => {
    let tzDate = makeConstructor(0);
    expect(date(new tzDate(2000, 0, 1, 0, 0, 0), "O")).toBe("+0000");
  });

  test("week number 52", () => {
    expect(date(new Date(2017, 11, 31), "W")).toBe("52");
  });

  test("week number 53", () => {
    expect(date(new Date(2020, 11, 31), "W")).toBe("53");
  });

  test("invalid date", () => {
    const invalidDate = new Date("monkeybat");
    expect(date(invalidDate, "c")).toBe(null);
  });

  test("escaped characters", () => {
    expect(date(new Date(2020, 1, 1, 1, 23), "H\\h i\\m")).toBe("01h 23m");
  });

  test("escaped characters raw string", () => {
    expect(date(new Date(2020, 1, 1, 1, 23), String.raw`H\h i\m`)).toBe(
      "01h 23m"
    );
  });

  test("double escaped characters", () => {
    expect(date(new Date(2020, 1, 1, 1, 23), "H\\\\h i\\\\m")).toBe(
      "01\\01 23\\02"
    );
  });
});
