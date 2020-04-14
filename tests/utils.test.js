const { djangoFilters } = require("../django-filters");

describe("_utils.padStart", () => {
  const randomPadding = Math.floor(Math.random() * 1000000);

  test("fixed pad length; padded with 0s", () => {
    expect(djangoFilters._utils.padStart(12, 20, 0)).toBe(
      "00000000000000000012"
    );
  });

  test("random pad length; padded with 0s; only checks for length", () => {
    expect(djangoFilters._utils.padStart(12, randomPadding, 0)).toHaveLength(
      randomPadding
    );
  });

  test("fixed pad length; padded with abc", () => {
    expect(djangoFilters._utils.padStart(12, 22, "abc")).toBe(
      "abcabcabcabcabcabcab12"
    );
  });

  test("random pad length; padded with abc; only checks for length", () => {
    expect(
      djangoFilters._utils.padStart(12, randomPadding, "abc")
    ).toHaveLength(randomPadding);
  });
});

describe("_utils.padEnd", () => {
  const randomPadding = Math.floor(Math.random() * 1000000);

  test("fixed pad length; padded with 0s", () => {
    expect(djangoFilters._utils.padEnd(12, 20, 0)).toBe("12000000000000000000");
  });

  test("random pad length; padded with 0s; only checks for length", () => {
    expect(djangoFilters._utils.padEnd(12, randomPadding, 0)).toHaveLength(
      randomPadding
    );
  });

  test("fixed pad length; padded with abc", () => {
    expect(djangoFilters._utils.padEnd(12, 22, "abc")).toBe(
      "12abcabcabcabcabcabcab"
    );
  });

  test("random pad length; padded with abc; only checks for length", () => {
    expect(djangoFilters._utils.padEnd(12, randomPadding, "abc")).toHaveLength(
      randomPadding
    );
  });
});

describe("_utils.parseDate", () => {
  test("existing date object", () => {
    const date = new Date();
    expect(djangoFilters._utils.parseDate(date)).toBe(date);
  });

  test("valid datetime string", () => {
    const date = new Date();
    expect(
      djangoFilters._utils.parseDate(date.toISOString()).toISOString()
    ).toBe(date.toISOString());
  });

  test("invalide datetime string", () => {
    const originalWarn = console.warn;
    console.warn = jest.fn();
    expect(djangoFilters._utils.parseDate("monkeybat")).toBe("monkeybat");
    expect(console.warn).toHaveBeenCalled();
    console.warn = originalWarn;
  });
});
