import { default as djangoFilters } from "../dist/index.js";

// these tests come from Django's test suite

describe("slugify", () => {
  test("Hello, World!", () => {
    expect(djangoFilters.slugify("Hello, World!", false)).toBe("hello-world");
    expect(djangoFilters.slugify("Hello, World!")).toBe("hello-world");
    expect(djangoFilters.slugify("Hello, World!", true)).toBe("hello-world");
  });

  test("spam & eggs", () => {
    expect(djangoFilters.slugify("spam & eggs", false)).toBe("spam-eggs");
    expect(djangoFilters.slugify("spam & eggs")).toBe("spam-eggs");
    expect(djangoFilters.slugify("spam & eggs", true)).toBe("spam-eggs");
  });

  test("spam & ıçüş", () => {
    expect(djangoFilters.slugify("spam & ıçüş", false)).toBe("spam-cus");
    expect(djangoFilters.slugify("spam & ıçüş")).toBe("spam-cus");
    expect(djangoFilters.slugify("spam & ıçüş", true)).toBe("spam-ıçüş");
  });

  test("foo ıç bar", () => {
    expect(djangoFilters.slugify("foo ıç bar", false)).toBe("foo-c-bar");
    expect(djangoFilters.slugify("foo ıç bar")).toBe("foo-c-bar");
    expect(djangoFilters.slugify("foo ıç bar", true)).toBe("foo-ıç-bar");
  });

  test("    foo ıç bar", () => {
    expect(djangoFilters.slugify("    foo ıç bar", false)).toBe("foo-c-bar");
    expect(djangoFilters.slugify("    foo ıç bar")).toBe("foo-c-bar");
    expect(djangoFilters.slugify("    foo ıç bar", true)).toBe("foo-ıç-bar");
  });

  test("你好", () => {
    expect(djangoFilters.slugify("你好", false)).toBe("");
    expect(djangoFilters.slugify("你好")).toBe("");
    expect(djangoFilters.slugify("你好", true)).toBe("你好");
  });

  test("İstanbul", () => {
    expect(djangoFilters.slugify("İstanbul", false)).toBe("istanbul");
    expect(djangoFilters.slugify("İstanbul")).toBe("istanbul");
    expect(djangoFilters.slugify("İstanbul", true)).toBe("i̇stanbul");
  });
});
