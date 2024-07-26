import { default as djangoFilters } from "../dist/index.js";

describe("pluralize: integers", () => {
  test("1", () => {
    expect(djangoFilters.pluralize(1)).toBe("");
  });

  test("0", () => {
    expect(djangoFilters.pluralize(0)).toBe("s");
  });

  test("2", () => {
    expect(djangoFilters.pluralize(2)).toBe("s");
  });
});

describe("pluralize: floats", () => {
  test("1.0", () => {
    expect(djangoFilters.pluralize(1.0)).toBe("");
  });

  test("0.5", () => {
    expect(djangoFilters.pluralize(0.5)).toBe("s");
  });

  test("1.00000001", () => {
    expect(djangoFilters.pluralize(1.00000001)).toBe("s");
  });

  test("1.5", () => {
    expect(djangoFilters.pluralize(1.5)).toBe("s");
  });
});

describe("pluralize: arrays", () => {
  test("[1]", () => {
    expect(djangoFilters.pluralize([1])).toBe("");
  });

  test("[]", () => {
    expect(djangoFilters.pluralize([])).toBe("s");
  });

  test("[1, 2, 3]", () => {
    expect(djangoFilters.pluralize([1, 2, 3])).toBe("s");
  });
});

describe("pluralize: suffixes", () => {
  test("1, es", () => {
    expect(djangoFilters.pluralize(1, "es")).toBe("");
  });

  test("0, es", () => {
    expect(djangoFilters.pluralize(0, "es")).toBe("es");
  });

  test("2, es", () => {
    expect(djangoFilters.pluralize(2, "es")).toBe("es");
  });

  test("1, 'y,ies'", () => {
    expect(djangoFilters.pluralize(1, "y,ies")).toBe("y");
  });

  test("0, 'y,ies'", () => {
    expect(djangoFilters.pluralize(0, "y,ies")).toBe("ies");
  });

  test("2, 'y,ies'", () => {
    expect(djangoFilters.pluralize(2, "y,ies")).toBe("ies");
  });

  test("0, 'y,ies,error'", () => {
    expect(djangoFilters.pluralize(0, "y,ies,error")).toBe("");
  });
});

describe("pluralize: no discernable value", () => {
  test("'', 'y,es'", () => {
    expect(djangoFilters.pluralize("", "y,es")).toBe("");
  });

  test("'', 'es'", () => {
    expect(djangoFilters.pluralize("", "es")).toBe("");
  });
});
