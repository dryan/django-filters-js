Object.defineProperty(navigator, "language", {
  get: function () {
    return "en-XX";
  },
});

const { djangoFilters } = require("../django-filters");

describe("apnumber", () => {
  test("apnumber 1", () => {
    expect(djangoFilters.apnumber(1)).toBe("one");
  });

  test("apnumber 2", () => {
    expect(djangoFilters.apnumber(2)).toBe("two");
  });

  test("apnumber 3", () => {
    expect(djangoFilters.apnumber(3)).toBe("three");
  });

  test("apnumber 4", () => {
    expect(djangoFilters.apnumber(4)).toBe("four");
  });

  test("apnumber 5", () => {
    expect(djangoFilters.apnumber(5)).toBe("five");
  });

  test("apnumber 6", () => {
    expect(djangoFilters.apnumber(6)).toBe("six");
  });

  test("apnumber 7", () => {
    expect(djangoFilters.apnumber(7)).toBe("seven");
  });

  test("apnumber 8", () => {
    expect(djangoFilters.apnumber(8)).toBe("eight");
  });

  test("apnumber 9", () => {
    expect(djangoFilters.apnumber(9)).toBe("nine");
  });

  test("apnumber 10", () => {
    expect(djangoFilters.apnumber(10)).toBe("10");
  });

  test("apnumber 11", () => {
    expect(djangoFilters.apnumber(100)).toBe("100");
  });

  test("apnumber invalid number", () => {
    expect(djangoFilters.apnumber("monkeybat")).toBe("monkeybat");
  });
});
