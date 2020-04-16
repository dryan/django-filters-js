const { djangoFilters } = require("../django-filters");

describe("linebreaksbr", () => {
  test("single newline", () => {
    expect(djangoFilters.linebreaksbr("line 1\nline 2")).toBe(
      "line 1<br>line 2"
    );
  });

  test("single carriage return", () => {
    expect(djangoFilters.linebreaksbr("line 1\rline 2")).toBe(
      "line 1<br>line 2"
    );
  });

  test("carriage and newline", () => {
    expect(djangoFilters.linebreaksbr("line 1\r\nline 2")).toBe(
      "line 1<br>line 2"
    );
  });

  test("non string input", () => {
    expect(djangoFilters.linebreaksbr(42)).toBe("42");
  });

  test("autoescape on", () => {
    expect(djangoFilters.linebreaksbr("foo\n<a>bar</a>\nbuz")).toBe(
      "foo<br>&lt;a&gt;bar&lt;/a&gt;<br>buz"
    );
  });

  test("autoescape off", () => {
    expect(djangoFilters.linebreaksbr("foo\n<a>bar</a>\nbuz", false)).toBe(
      "foo<br><a>bar</a><br>buz"
    );
  });
});
