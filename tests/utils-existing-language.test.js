Object.defineProperty(navigator, "language", {
  get: function () {
    return "xx-XX";
  },
});

window.djangoFilters = { translations: { "en-us": { apnumbers: { 0: "0" } } } };

const { djangoFilters } = require("../django-filters");

describe("_utils.translate", () => {
  test("matched translation", () => {
    expect(djangoFilters._utils.translate("apnumbers", 0)).toBe("0");
  });
});
