const { djangoFilters } = require("../dist/django-filters");

describe("iriencode", () => {
  test("unicode", () => {
    expect(djangoFilters.iriencode("S\xf8r-Tr\xf8ndelag")).toBe(
      "S%C3%B8r-Tr%C3%B8ndelag"
    );
  });

  test("urlencoded", () => {
    expect(
      djangoFilters.iriencode(djangoFilters.urlencode("fran\xe7ois & jill"))
    ).toBe("fran%C3%A7ois%20%26%20jill");
  });
});
