import { floatformat } from "../dist/floatformat.js";

describe("floatformat", () => {
  test("7.7, no roundTo", () => {
    expect(floatformat(7.7)).toBe("7.7");
  });

  test("7.0, no roundTo", () => {
    expect(floatformat(7.0)).toBe("7");
  });

  test("0.7, no roundTo", () => {
    expect(floatformat(0.7)).toBe("0.7");
  });

  test("-0.7, no roundTo", () => {
    expect(floatformat(-0.7)).toBe("-0.7");
  });

  test("0.07, no roundTo", () => {
    expect(floatformat(0.07)).toBe("0.1");
  });

  test("-0.07, no roundTo", () => {
    expect(floatformat(-0.07)).toBe("-0.1");
  });

  test("0.007, no roundTo", () => {
    expect(floatformat(0.007)).toBe("0");
  });

  test("0.0, no roundTo", () => {
    expect(floatformat(0.0)).toBe("0");
  });

  test("7.7, 0", () => {
    expect(floatformat(7.7, 0)).toBe("8");
  });

  test("7.7, 3", () => {
    expect(floatformat(7.7, 3)).toBe("7.700");
  });

  test("6.0, 3", () => {
    expect(floatformat(6.0, 3)).toBe("6.000");
  });

  test("6.2, 3", () => {
    expect(floatformat(6.2, 3)).toBe("6.200");
  });

  test("6.2, -3", () => {
    expect(floatformat(6.2, -3)).toBe("6.200");
  });

  test("13.1031, -3", () => {
    expect(floatformat(13.1031, -3)).toBe("13.103");
  });

  test("11.1197, -2", () => {
    expect(floatformat(11.1197, -2)).toBe("11.12");
  });

  test("11.0, -2", () => {
    expect(floatformat(11.0, -2)).toBe("11");
  });

  test("11.000001, -2", () => {
    expect(floatformat(11.000001, -2)).toBe("11");
  });

  test("8.2798, 3", () => {
    expect(floatformat(8.2798, 3)).toBe("8.280");
  });

  test("5555.555, 2", () => {
    expect(floatformat(5555.555, 2)).toBe("5555.56");
  });

  test("-5555.555, 2", () => {
    expect(floatformat(-5555.555, 2)).toBe("-5555.56");
  });

  test("1.3, 2", () => {
    expect(floatformat(1.3, 2)).toBe("1.30");
  });

  test("0.12345, 2", () => {
    expect(floatformat(0.12345, 2)).toBe("0.12");
  });

  test("555.555, 2", () => {
    expect(floatformat("555.555", 2)).toBe("555.56");
  });

  test("09.000, no roundTo", () => {
    expect(floatformat("09.000")).toBe("9");
  });

  test("foo, no roundTo", () => {
    expect(floatformat("foo")).toBe("");
  });

  test("13.1031, bar", () => {
    expect(floatformat(13.1031, "bar")).toBe("13.1031");
  });

  test("18.125, 2", () => {
    expect(floatformat(18.125, 2)).toBe("18.13");
  });

  test("foo, bar", () => {
    expect(floatformat("foo", "bar")).toBe("");
  });

  test("¿Cómo?", () => {
    expect(floatformat("¿Cómo esta usted?")).toBe("");
  });

  test("null", () => {
    expect(floatformat(null)).toBe("");
  });

  // we can't support these tests in JavaScript because toFixed has a limit of 20 places
  // test("", () => {
  //   expect(floatformat(-1.323297138040798e35, 2)).toBe(
  //     "-132329713804079800000000000000000000.00"
  //   );
  // });
  //
  // test("", () => {
  //   expect(floatformat(-1.323297138040798e35, -2)).toBe(
  //     "-132329713804079800000000000000000000"
  //   );
  // });

  test("1.5e-15, 20", () => {
    expect(floatformat(1.5e-15, 20)).toBe("0.00000000000000150000");
  });

  test("1.5e-15, -20", () => {
    expect(floatformat(1.5e-15, -20)).toBe("0.00000000000000150000");
  });

  test("1.00000000000000015, 16", () => {
    expect(floatformat(1.00000000000000015, 16)).toBe("1.0000000000000002");
  });

  test("0, 6", () => {
    expect(floatformat(0, 6)).toBe("0.000000");
  });

  test("0, 7", () => {
    expect(floatformat(0, 7)).toBe("0.0000000");
  });

  test("0, 10", () => {
    expect(floatformat(0, 10)).toBe("0.0000000000");
  });

  test("0.000000000000000000015, 20", () => {
    expect(floatformat(0.000000000000000000015, 20)).toBe(
      "0.00000000000000000002"
    );
  });

  test("-0.01, -1", () => {
    expect(floatformat(-0.01, -1)).toBe("0");
  });

  test("-0.001, 2", () => {
    expect(floatformat(-0.001, 2)).toBe("0.00");
  });

  test("-0.499, 0", () => {
    expect(floatformat(-0.499, 0)).toBe("0");
  });

  test("positive infinity", () => {
    expect(floatformat(Number.POSITIVE_INFINITY)).toBe("inf");
  });

  test("negative infinity", () => {
    expect(floatformat(Number.NEGATIVE_INFINITY)).toBe("-inf");
  });

  // we can't do this one because JS treats this like any other NaN
  // test("positive infinity / positive infinity", () => {
  //   expect(
  //     floatformat(
  //       Number.POSITIVE_INFINITY / Number.POSITIVE_INFINITY
  //     )
  //   ).toBe("nan");
  // });

  test("1.2345, 2", () => {
    expect(floatformat(1.2345, 2)).toBe("1.23");
  });

  test("15.2042, -3", () => {
    expect(floatformat(15.2042, -3)).toBe("15.204");
  });

  test("1.2345, 2", () => {
    expect(floatformat(1.2345, "2")).toBe("1.23");
  });

  test("15.2042, -3", () => {
    expect(floatformat(15.2042, "-3")).toBe("15.204");
  });

  test("1.2345, 2", () => {
    expect(floatformat("1.2345", 2)).toBe("1.23");
  });

  test("15.2042, -3", () => {
    expect(floatformat("15.2042", -3)).toBe("15.204");
  });
});
