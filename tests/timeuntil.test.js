const { djangoFilters } = require("../django-filters");

const { timedelta } = require("./timesince.test");

describe("timeuntil", () => {
  test("since now", () => {
    expect(
      djangoFilters.timeuntil(
        new Date(new Date().getTime() + timedelta({ days: 1, seconds: 1 }))
      )
    ).toBe("1\xa0day");
  });

  test("no argument", () => {
    expect(djangoFilters.timeuntil(null)).toBe("");
  });

  test("explicit date", () => {
    expect(
      djangoFilters.timeuntil(new Date(2005, 11, 30), new Date(2005, 11, 29))
    ).toBe("1\xa0day");
  });
});
