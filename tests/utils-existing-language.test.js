import { translate } from "../dist/_utils.js";

describe("_utils.translate", () => {
  test("matched translation", () => {
    expect(translate("apnumbers", 0)).toBe("zero");
  });

  test("matched translation, short language code", () => {
    expect(translate("apnumbers", 0, "en-UK")).toBe("zero");
  });
});
