const { djangoFilters } = require("../django-filters");

describe("cut", () => {
  test("character", () => {
    expect(djangoFilters.cut("a string to be mangled", "a")).toBe(
      " string to be mngled"
    );
  });

  test("characters", () => {
    expect(djangoFilters.cut("a string to be mangled", "ng")).toBe(
      "a stri to be maled"
    );
  });

  test("non matching string", () => {
    expect(djangoFilters.cut("a string to be mangled", "strings")).toBe(
      "a string to be mangled"
    );
  });

  test("non string input", () => {
    expect(djangoFilters.cut(42, "2")).toBe("4");
  });
});
