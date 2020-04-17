const { djangoFilters } = require("../dist/django-filters");

describe("ordinal", () => {
  test("1", () => {
    expect(djangoFilters.ordinal(1)).toBe("1st");
  });

  test("2", () => {
    expect(djangoFilters.ordinal(2)).toBe("2nd");
  });

  test("3", () => {
    expect(djangoFilters.ordinal(3)).toBe("3rd");
  });

  test("11", () => {
    expect(djangoFilters.ordinal(11)).toBe("11th");
  });

  test("12", () => {
    expect(djangoFilters.ordinal(12)).toBe("12th");
  });

  test("13", () => {
    expect(djangoFilters.ordinal(13)).toBe("13th");
  });

  test("14", () => {
    expect(djangoFilters.ordinal(14)).toBe("14th");
  });

  test("21", () => {
    expect(djangoFilters.ordinal(21)).toBe("21st");
  });

  test("22", () => {
    expect(djangoFilters.ordinal(22)).toBe("22nd");
  });

  test("23", () => {
    expect(djangoFilters.ordinal(23)).toBe("23rd");
  });

  test("24", () => {
    expect(djangoFilters.ordinal(24)).toBe("24th");
  });

  test("42 passed as a string", () => {
    expect(djangoFilters.ordinal("42")).toBe("42nd");
  });

  test("integer too large", () => {
    expect(djangoFilters.ordinal(Number.MAX_SAFE_INTEGER + 1)).toBe(
      Number.MAX_SAFE_INTEGER + 1
    );
  });

  test("monkeybat", () => {
    expect(djangoFilters.ordinal("monkeybat")).toBe("monkeybat");
  });
});
