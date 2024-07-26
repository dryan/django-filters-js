import { default as djangoFilters } from "../dist/index.js";

describe("capfirst", () => {
  test("capfirst", () => {
    expect(djangoFilters.capfirst("hello world")).toBe("Hello world");
  });
});
