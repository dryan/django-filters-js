const { djangoFilters } = require("../dist/django-filters");

describe("filesizeformat", () => {
  [
    [0, "0\xa0bytes"],
    [1, "1\xa0byte"],
    [1023, "1023\xa0bytes"],
    [1024, "1.0\xa0KB"],
    [10 * 1024, "10.0\xa0KB"],
    [1024 * 1024 - 1, "1024.0\xa0KB"],
    [1024 * 1024, "1.0\xa0MB"],
    [1024 * 1024 * 50, "50.0\xa0MB"],
    [1024 * 1024 * 1024 - 1, "1024.0\xa0MB"],
    [1024 * 1024 * 1024, "1.0\xa0GB"],
    [1024 * 1024 * 1024 * 1024, "1.0\xa0TB"],
    [1024 * 1024 * 1024 * 1024 * 1024, "1.0\xa0PB"],
    [1024 * 1024 * 1024 * 1024 * 1024 * 2000, "2000.0\xa0PB"],
    [Math.sqrt(-1), "0\xa0bytes"],
    ["", "0\xa0bytes"],
    ["α", "0\xa0bytes"],
  ].forEach((testData, index) => {
    test(`non-localized number ${index + 1}: ${testData[0]} -> ${
      testData[1]
    }`, () => {
      expect(djangoFilters.filesizeformat(testData[0], false)).toBe(
        testData[1]
      );
    });
  });

  [
    [0, "0\xa0bytes"],
    [1, "1\xa0byte"],
    [1023, "1023\xa0bytes"],
    [1024, "1.0\xa0KB"],
    [10 * 1024, "10.0\xa0KB"],
    [1024 * 1024 - 1, "1,024.0\xa0KB"],
    [1024 * 1024, "1.0\xa0MB"],
    [1024 * 1024 * 50, "50.0\xa0MB"],
    [1024 * 1024 * 1024 - 1, "1,024.0\xa0MB"],
    [1024 * 1024 * 1024, "1.0\xa0GB"],
    [1024 * 1024 * 1024 * 1024, "1.0\xa0TB"],
    [1024 * 1024 * 1024 * 1024 * 1024, "1.0\xa0PB"],
    [1024 * 1024 * 1024 * 1024 * 1024 * 2000, "2,000.0\xa0PB"],
    [Math.sqrt(-1), "0\xa0bytes"],
    ["", "0\xa0bytes"],
    ["α", "0\xa0bytes"],
  ].forEach((testData, index) => {
    test(`localized number ${index + 1}: ${testData[0]} -> ${
      testData[1]
    }`, () => {
      expect(djangoFilters.filesizeformat(testData[0])).toBe(testData[1]);
    });
  });

  [
    [-1, "-1\xa0byte"],
    [-100, "-100\xa0bytes"],
    [-1024 * 1024 * 50, "-50.0\xa0MB"],
  ].forEach((testData, index) => {
    test(`localized negative number ${index + 1}: ${testData[0]} -> ${
      testData[1]
    }`, () => {
      expect(djangoFilters.filesizeformat(testData[0])).toBe(testData[1]);
    });
  });
});
