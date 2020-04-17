const { djangoFilters } = require("../dist/django-filters");

describe("escapejs", () => {
  test("quotes", () => {
    expect(
      djangoFilters.escapejs("\"double quotes\" and 'single quotes'")
    ).toBe("\\u0022double quotes\\u0022 and \\u0027single quotes\\u0027");
  });

  test("backslashes", () => {
    expect(djangoFilters.escapejs(String.raw`\ : backslashes, too`)).toBe(
      "\\u005C : backslashes, too"
    );
  });

  test("whitespace", () => {
    expect(djangoFilters.escapejs("and lots of whitespace: \r\n\t\v\f\b")).toBe(
      "and lots of whitespace: \\u000D\\u000A\\u0009\\u000B\\u000C\\u0008"
    );
  });

  test("script", () => {
    expect(djangoFilters.escapejs(String.raw`<script>and this</script>`)).toBe(
      "\\u003Cscript\\u003Eand this\\u003C/script\\u003E"
    );
  });

  test("paragraph separator", () => {
    expect(
      djangoFilters.escapejs(
        "paragraph separator:\u2029and line separator:\u2028"
      )
    ).toBe("paragraph separator:\\u2029and line separator:\\u2028");
  });

  test("non string content", () => {
    expect(djangoFilters.escapejs(42)).toBe("42");
  });
});
