const { djangoFilters } = require("../django-filters");

describe("title", () => {
  test("all caps", () => {
    expect(djangoFilters.title("JOE'S CRAB SHACK")).toBe("Joe's Crab Shack");
  });

  test("all caps with ordinal", () => {
    expect(djangoFilters.title("555 WEST 53RD STREET")).toBe(
      "555 West 53rd Street"
    );
  });

  test("unicode", () => {
    expect(djangoFilters.title("discoth\xe8que")).toBe("Discoth\xe8que");
  });

  test("non string input", () => {
    expect(djangoFilters.title(42)).toBe("42");
  });
});
