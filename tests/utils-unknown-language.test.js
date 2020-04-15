Object.defineProperty(navigator, "language", {
  get: function () {
    return "xx-XX";
  },
});

const { djangoFilters } = require("../django-filters");

describe("_utils.translate", () => {
  beforeAll(() => {
    djangoFilters.translations["en-us"].testing = {
      monkeybat: "monkeybat",
    };
  });

  test("matched translation", () => {
    expect(djangoFilters._utils.translate("testing", "monkeybat")).toBe(
      "monkeybat"
    );
  });

  test("unmatched translation in supported language", () => {
    expect(djangoFilters._utils.translate("testing", "foo")).toBeUndefined();
  });
});
