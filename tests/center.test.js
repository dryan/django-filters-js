import { default as djangoFilters } from "../dist/index.js";

describe("center", () => {
  test("string, even padding", () => {
    expect(djangoFilters.center("test", 6)).toBe(" test ");
  });

  test("string, odd padding", () => {
    expect(djangoFilters.center("test", 7)).toBe(" test  ");
  });

  test("non string input", () => {
    expect(djangoFilters.center(42, 6)).toBe("  42  ");
  });

  test("no length", () => {
    expect(djangoFilters.center("test")).toBe("test");
  });
});
