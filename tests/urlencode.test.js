const { djangoFilters } = require("../dist/django-filters");

describe("urlencode", () => {
  test("basic path", () => {
    expect(djangoFilters.urlencode('/test&"/me?/')).toBe("/test%26%22/me%3F/");
  });

  test("basic path with no safe values", () => {
    expect(djangoFilters.urlencode('/test&"/me?/', "")).toBe(
      "%2Ftest%26%22%2Fme%3F%2F"
    );
  });

  test("unicode", () => {
    expect(djangoFilters.urlencode("fran\xe7ois & jill")).toBe(
      "fran%C3%A7ois%20%26%20jill"
    );
  });

  test("non string input", () => {
    expect(djangoFilters.urlencode(42)).toBe("42");
  });
});
