const { djangoFilters } = require("../dist/django-filters");

describe("addslashes", () => {
  test("quotes", () => {
    expect(
      djangoFilters.addslashes(`"double quotes" and 'single quotes'`)
    ).toBe("\\\"double quotes\\\" and \\'single quotes\\'");
  });

  test("backslashes", () => {
    expect(djangoFilters.addslashes(String.raw`\ : backslashes, too`)).toBe(
      String.raw`\\ : backslashes, too`
    );
  });

  test("non string input", () => {
    expect(djangoFilters.addslashes(42)).toBe("42");
  });
});
