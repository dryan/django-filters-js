const { djangoFilters } = require("../dist/django-filters");

describe("force_escape", () => {
  test("x&y", () => {
    expect(djangoFilters.force_escape("x&y")).toBe("x&amp;y");
  });

  test("x&amp;y", () => {
    expect(djangoFilters.force_escape("x&amp;y")).toBe("x&amp;y");
  });

  test("<some html & special characters > here", () => {
    expect(
      djangoFilters.force_escape("<some html & special characters > here")
    ).toBe("&lt;some html &amp; special characters &gt; here");
  });

  test("non string content", () => {
    expect(djangoFilters.force_escape(42)).toBe("42");
  });
});
