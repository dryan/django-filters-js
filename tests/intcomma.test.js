const { djangoFilters } = require("../dist/django-filters");

describe("intcomma", () => {
  test("10 million", () => {
    expect(djangoFilters.intcomma(10000000)).toBe("10,000,000");
  });

  test("1 million", () => {
    expect(djangoFilters.intcomma(1000000)).toBe("1,000,000");
  });

  test("1 thousand", () => {
    expect(djangoFilters.intcomma(1000)).toBe("1,000");
  });

  test("100", () => {
    expect(djangoFilters.intcomma(100)).toBe("100");
  });

  test("1.5", () => {
    expect(djangoFilters.intcomma(1.5)).toBe("1.5");
  });

  test("100.5", () => {
    expect(djangoFilters.intcomma(100.5)).toBe("100.5");
  });

  test("1000.5", () => {
    expect(djangoFilters.intcomma(1000.5)).toBe("1,000.5");
  });

  test("1000.51234", () => {
    expect(djangoFilters.intcomma(1000.51234)).toBe("1,000.51234");
  });

  test("1000000.5", () => {
    expect(djangoFilters.intcomma(1000000.5)).toBe("1,000,000.5");
  });

  test("$1000", () => {
    expect(djangoFilters.intcomma("$1000")).toBe("$1,000");
  });

  test("€1000", () => {
    expect(djangoFilters.intcomma("€1000")).toBe("€1,000");
  });

  test("monkeybat", () => {
    expect(djangoFilters.intcomma("monkeybat")).toBe("monkeybat");
  });
});
