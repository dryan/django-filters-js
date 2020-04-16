const { djangoFilters } = require("../django-filters");

describe("rjust", () => {
  test("test, 10", () => {
    expect(djangoFilters.rjust("test", 10)).toBe("      test");
  });

  test("test, 3", () => {
    expect(djangoFilters.rjust("test", 3)).toBe("test");
  });

  test("test, no width argument", () => {
    expect(djangoFilters.rjust("test")).toBe("test");
  });

  test("non string input", () => {
    expect(djangoFilters.rjust(42, 3)).toBe(" 42");
  });
});
