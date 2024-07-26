import { translate } from "../dist/_utils.js";

describe("_utils.translate", () => {
  test("matched translation", () => {
    expect(translate("apnumbers", 0, "es-US")).toBe("zero");
  });

  test("unmatched translation in unsupported language", () => {
    expect(translate("testing", "foo", "es-US")).toBeUndefined();
  });
});
