const { djangoFilters } = require("../django-filters");

describe("upper", () => {
  test("mixed case input", () => {
    expect(djangoFilters.upper("Mixed case input")).toBe("MIXED CASE INPUT");
  });

  test("unicode", () => {
    expect(djangoFilters.upper("\xeb")).toBe("\xcb");
  });

  test("non string input", () => {
    expect(djangoFilters.upper(42)).toBe("42");
  });
});
