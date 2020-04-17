const { djangoFilters } = require("../dist/django-filters");

describe("striptags", () => {
  test("striptags 1", () => {
    expect(djangoFilters.striptags("<a>x</a> <p><b>y</b></p>")).toBe("x y");
  });

  test("striptags 2", () => {
    expect(
      djangoFilters.striptags(
        'some <b>html</b> with <script>alert("You smell")</script> disallowed <img /> tags'
      )
    ).toBe('some html with alert("You smell") disallowed  tags');
  });

  test("non string input", () => {
    expect(djangoFilters.striptags(42)).toBe("42");
  });
});
