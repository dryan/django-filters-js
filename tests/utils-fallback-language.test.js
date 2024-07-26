import { translate, getLanguageCode, inspect } from "../dist/_utils.js";

describe("_utils.translate", () => {
  test("matched translation", () => {
    expect(translate("apnumbers", 0)).toBe("zero");
  });

  test("unmatched translation in supported language", () => {
    expect(translate("testing", "foo")).toBeUndefined();
  });
});
