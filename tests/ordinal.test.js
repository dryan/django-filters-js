import { ordinal } from "../dist/ordinal.js";

describe("ordinal", () => {
  test("1", () => {
    expect(ordinal(1)).toBe("1st");
  });

  test("2", () => {
    expect(ordinal(2)).toBe("2nd");
  });

  test("3", () => {
    expect(ordinal(3)).toBe("3rd");
  });

  test("11", () => {
    expect(ordinal(11)).toBe("11th");
  });

  test("12", () => {
    expect(ordinal(12)).toBe("12th");
  });

  test("13", () => {
    expect(ordinal(13)).toBe("13th");
  });

  test("14", () => {
    expect(ordinal(14)).toBe("14th");
  });

  test("21", () => {
    expect(ordinal(21)).toBe("21st");
  });

  test("22", () => {
    expect(ordinal(22)).toBe("22nd");
  });

  test("23", () => {
    expect(ordinal(23)).toBe("23rd");
  });

  test("24", () => {
    expect(ordinal(24)).toBe("24th");
  });

  test("42 passed as a string", () => {
    expect(ordinal("42")).toBe("42nd");
  });

  test("integer too large", () => {
    expect(ordinal(Number.MAX_SAFE_INTEGER + 1)).toBe(null);
  });

  test("non number", () => {
    expect(ordinal("monkeybat")).toBe(null);
  });
});
