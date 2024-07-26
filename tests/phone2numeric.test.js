import { default as djangoFilters } from "../dist/index.js";

describe("phone2numeric", () => {
  test("1-800-call-me", () => {
    expect(djangoFilters.phone2numeric("1-800-call-me")).toBe("1-800-2255-63");
  });

  test("long string of text", () => {
    expect(
      djangoFilters.phone2numeric(
        "How razorback-jumping frogs can level six piqued gymnasts!"
      )
    ).toBe("469 729672225-5867464 37647 226 53835 749 747833 49662787!");
  });

  test("0800 flowers", () => {
    expect(djangoFilters.phone2numeric("0800 flowers")).toBe("0800 3569377");
  });

  test("non string input", () => {
    expect(djangoFilters.phone2numeric(42)).toBe("42");
  });
});
