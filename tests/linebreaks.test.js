const { djangoFilters } = require("../django-filters");

describe("linebreaks", () => {
  test("single line", () => {
    expect(djangoFilters.linebreaks("line 1")).toBe("<p>line 1</p>");
  });

  test("single newline", () => {
    expect(djangoFilters.linebreaks("line 1\nline 2")).toBe(
      "<p>line 1<br>line 2</p>"
    );
  });

  test("single carriage return", () => {
    expect(djangoFilters.linebreaks("line 1\rline 2")).toBe(
      "<p>line 1<br>line 2</p>"
    );
  });

  test("carriage and newline", () => {
    expect(djangoFilters.linebreaks("line 1\r\nline 2")).toBe(
      "<p>line 1<br>line 2</p>"
    );
  });

  test("non string input", () => {
    expect(djangoFilters.linebreaks(42)).toBe("<p>42</p>");
  });

  test("autoescape on", () => {
    expect(djangoFilters.linebreaks("foo\n<a>bar</a>\nbuz")).toBe(
      "<p>foo<br>&lt;a&gt;bar&lt;/a&gt;<br>buz</p>"
    );
  });

  test("autoescape off", () => {
    expect(djangoFilters.linebreaks("foo\n<a>bar</a>\nbuz", false)).toBe(
      "<p>foo<br><a>bar</a><br>buz</p>"
    );
  });
});
