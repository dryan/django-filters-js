Object.defineProperty(navigator, "language", {
  get: function () {
    return "en-US";
  },
});

const { djangoFilters } = require("../dist/django-filters");

describe("_utils.translate", () => {
  beforeAll(() => {
    djangoFilters.translations = { en: {} };
    djangoFilters.translations["en"].testing = {
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
