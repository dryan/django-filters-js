import {
  padStart,
  padEnd,
  parseDate,
  translate,
  getLanguageCode,
} from "../dist/_utils.js";

describe("_utils.padStart", () => {
  const randomPadding = Math.floor(Math.random() * 1000000);

  test("fixed pad length; padded with 0s", () => {
    expect(padStart(12, 20, 0)).toBe("00000000000000000012");
  });

  test("random pad length; padded with 0s; only checks for length", () => {
    expect(padStart(12, randomPadding, 0)).toHaveLength(randomPadding);
  });

  test("fixed pad length; padded with abc", () => {
    expect(padStart(12, 22, "abc")).toBe("abcabcabcabcabcabcab12");
  });

  test("random pad length; padded with abc; only checks for length", () => {
    expect(padStart(12, randomPadding, "abc")).toHaveLength(randomPadding);
  });
});

describe("_utils.padEnd", () => {
  const randomPadding = Math.floor(Math.random() * 1000000);

  test("fixed pad length; padded with 0s", () => {
    expect(padEnd(12, 20, 0)).toBe("12000000000000000000");
  });

  test("random pad length; padded with 0s; only checks for length", () => {
    expect(padEnd(12, randomPadding, 0)).toHaveLength(randomPadding);
  });

  test("fixed pad length; padded with abc", () => {
    expect(padEnd(12, 22, "abc")).toBe("12abcabcabcabcabcabcab");
  });

  test("random pad length; padded with abc; only checks for length", () => {
    expect(padEnd(12, randomPadding, "abc")).toHaveLength(randomPadding);
  });
});

describe("_utils.parseDate", () => {
  test("existing date object", () => {
    const date = new Date();
    expect(parseDate(date)).toBe(date);
  });

  test("valid datetime string", () => {
    const date = new Date();
    expect(parseDate(date.toISOString()).toISOString()).toBe(
      date.toISOString()
    );
  });

  test("invalid datetime string", () => {
    const originalWarn = console.warn;
    console.warn = jest.fn();
    expect(parseDate("monkeybat")).toBe(null);
    expect(console.warn).toHaveBeenCalled();
    console.warn = originalWarn;
  });
});

describe("_utils.translate", () => {
  beforeAll(() => {
    translate.translations["en-us"].testing = {
      monkeybat: "monkeybat",
    };
  });

  test("matched translation", () => {
    expect(translate("testing", "monkeybat")).toBe("monkeybat");
  });

  test("unmatched translation in supported language", () => {
    expect(translate("testing", "foo")).toBeUndefined();
  });
});

describe("_utils.getLanguageCode", () => {
  test("default", () => {
    expect(getLanguageCode()).toBe("en-us");
  });

  test("with navigator", () => {
    Object.defineProperty(global, "navigator", {
      value: {
        language: "es_US",
      },
    });
    expect(getLanguageCode()).toBe("es-us");
  });

  test("with navigator language not set", () => {
    Object.defineProperty(global, "navigator", {
      value: {},
    });
    expect(getLanguageCode()).toBe("en-us");
  });
});
