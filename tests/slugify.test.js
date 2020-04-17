const { djangoFilters } = require("../dist/django-filters");

// these tests come from Django's test suite

describe("slugify", () => {
  test("Hello, World!", () => {
    expect(djangoFilters.slugify("Hello, World!", (allowUnicode = false))).toBe(
      "hello-world"
    );
    expect(djangoFilters.slugify("Hello, World!", (allowUnicode = true))).toBe(
      "hello-world"
    );
  });

  test("spam & eggs", () => {
    expect(djangoFilters.slugify("spam & eggs", (allowUnicode = false))).toBe(
      "spam-eggs"
    );
    expect(djangoFilters.slugify("spam & eggs", (allowUnicode = true))).toBe(
      "spam-eggs"
    );
  });

  test("spam & ıçüş", () => {
    expect(djangoFilters.slugify("spam & ıçüş", (allowUnicode = false))).toBe(
      "spam-cus"
    );
    expect(djangoFilters.slugify("spam & ıçüş", (allowUnicode = true))).toBe(
      "spam-ıçüş"
    );
  });

  test("foo ıç bar", () => {
    expect(djangoFilters.slugify("foo ıç bar", (allowUnicode = false))).toBe(
      "foo-c-bar"
    );
    expect(djangoFilters.slugify("foo ıç bar", (allowUnicode = true))).toBe(
      "foo-ıç-bar"
    );
  });

  test("    foo ıç bar", () => {
    expect(
      djangoFilters.slugify("    foo ıç bar", (allowUnicode = false))
    ).toBe("foo-c-bar");
    expect(djangoFilters.slugify("    foo ıç bar", (allowUnicode = true))).toBe(
      "foo-ıç-bar"
    );
  });

  test("你好", () => {
    expect(djangoFilters.slugify("你好", (allowUnicode = false))).toBe("");
    expect(djangoFilters.slugify("你好", (allowUnicode = true))).toBe("你好");
  });

  test("İstanbul", () => {
    expect(djangoFilters.slugify("İstanbul", (allowUnicode = false))).toBe(
      "istanbul"
    );
    expect(djangoFilters.slugify("İstanbul", (allowUnicode = true))).toBe(
      "i̇stanbul"
    );
  });
});
