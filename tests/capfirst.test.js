const { djangoFilters } = require("../django-filters");

describe("capfirst", () => {
  test("capfirst", () => {
    expect(djangoFilters.capfirst("hello world")).toBe("Hello world");
  });
});
