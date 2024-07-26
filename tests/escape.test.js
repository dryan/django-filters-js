import { default as djangoFilters } from "../dist/index.js";

describe("escape", () => {
  test("x&y", () => {
    expect(djangoFilters.escape("x&y")).toBe("x&amp;y");
  });

  test("x&amp;y", () => {
    expect(djangoFilters.escape("x&amp;y")).toBe("x&amp;y");
  });

  test("<some html & special characters > here", () => {
    expect(djangoFilters.escape("<some html & special characters > here")).toBe(
      "&lt;some html &amp; special characters &gt; here"
    );
  });

  test("non string content", () => {
    expect(djangoFilters.escape(42)).toBe("42");
  });
});
