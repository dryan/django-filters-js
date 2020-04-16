const { djangoFilters } = require("../django-filters");

const timedelta = (opts) => {
  const MILLISECOND = 1;
  const SECOND = MILLISECOND * 1000;
  const MINUTE = SECOND * 60;
  const HOUR = MINUTE * 60;
  const DAY = HOUR * 24;
  const WEEK = DAY * 7;

  let { days, seconds, milliseconds, minutes, hours, weeks } = opts;
  days = typeof days === "undefined" ? 0 : days;
  seconds = typeof seconds === "undefined" ? 0 : seconds;
  milliseconds = typeof milliseconds === "undefined" ? 0 : milliseconds;
  minutes = typeof minutes === "undefined" ? 0 : minutes;
  hours = typeof hours === "undefined" ? 0 : hours;
  weeks = typeof weeks === "undefined" ? 0 : weeks;

  return [
    milliseconds * MILLISECOND,
    seconds * SECOND,
    minutes * MINUTE,
    hours * HOUR,
    days * DAY,
    weeks * WEEK,
  ].reduce((total, ms) => total + ms);
};

if (module && module.exports) {
  module.exports = {
    timedelta,
  };
}

describe("timesince", () => {
  test("since now", () => {
    expect(
      djangoFilters.timesince(
        new Date(new Date().getTime() - timedelta({ days: 1 }))
      )
    ).toBe("1\xa0day");
  });

  test("1 day and 1 minute ago", () => {
    expect(
      djangoFilters.timesince(
        new Date().getTime() - timedelta({ days: 1, minutes: 1 })
      )
    ).toBe("1\xa0day");
  });

  test("1 hour, 25 minutes, and 10 seconds ago", () => {
    expect(
      djangoFilters.timesince(
        new Date().getTime() - timedelta({ hours: 1, minutes: 25, seconds: 10 })
      )
    ).toBe("1\xa0hour, 25\xa0minutes");
  });

  test("with leap years involved #1", () => {
    expect(
      djangoFilters.timesince(new Date(2000, 1, 1), new Date(2016, 1, 1))
    ).toBe("16\xa0years");
  });

  test("with leap years involved #2", () => {
    expect(
      djangoFilters.timesince(new Date(2001, 1, 1), new Date(2016, 10, 1))
    ).toBe("15\xa0years, 9\xa0months");
  });

  test("compareTo is in the future", () => {
    expect(
      djangoFilters.timesince(new Date(2000, 1, 1), new Date(1999, 11, 31))
    ).toBe("0\xa0minutes");
  });

  test("no argument", () => {
    expect(djangoFilters.timesince(null)).toBe("");
  });

  test("explicit date", () => {
    expect(
      djangoFilters.timesince(new Date(2005, 11, 29), new Date(2005, 11, 30))
    ).toBe("1\xa0day");
  });
});
