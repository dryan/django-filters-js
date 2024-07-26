import { default as djangoFilters } from "../dist/index.js";

describe("ljust", () => {
  test("test, 10", () => {
    expect(djangoFilters.ljust("test", 10)).toBe("test      ");
  });

  test("test, 3", () => {
    expect(djangoFilters.ljust("test", 3)).toBe("test");
  });

  test("test, no width argument", () => {
    expect(djangoFilters.ljust("test")).toBe("test");
  });

  test("non string input", () => {
    expect(djangoFilters.ljust(42, 3)).toBe("42 ");
  });
});
