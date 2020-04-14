const { djangoFilter } = require("../django-filters");

describe("chainable filters", () => {
  test("apnumber unchained", () => {
    expect(djangoFilter("1").apnumber().toString()).toBe("one");
  });

  test("intcomma unchained", () => {
    expect(djangoFilter("1000000").intcomma().toString()).toBe("1,000,000");
  });

  test("cut unchained", () => {
    expect(djangoFilter("this is a string").cut("is").toString()).toBe(
      "th  a string"
    );
  });

  test("trim->cut->slugify", () => {
    expect(
      djangoFilter("    this is a string     ").cut("is").slugify().toString()
    ).toBe("th-a-string");
  });

  test("date unchained: date only", () => {
    expect(djangoFilter("21 December 2000").date("N j, Y").toString()).toBe(
      "Dec. 21, 2000"
    );
  });

  test("date unchained: default format", () => {
    expect(djangoFilter("21 December 2000").date().toString()).toBe(
      "Dec. 21, 2000"
    );
  });

  test("time unchained: default format", () => {
    expect(djangoFilter("21 December 2000").time().toString()).toBe("midnight");
  });

  test("date unchained: date and time", () => {
    expect(djangoFilter("2011-06-07 13:48").date("N j, Y, P").toString()).toBe(
      "June 7, 2011, 1:48 p.m."
    );
  });

  test("intcomma->ordinal", () => {
    expect(djangoFilter("1000000").intcomma().ordinal().toString()).toBe(
      "1,000,000th"
    );
  });

  test("ordinal->intcomma", () => {
    expect(djangoFilter("1000000").ordinal().intcomma().toString()).toBe(
      "1,000,000th"
    );
  });

  test("valueOf", () => {
    expect(djangoFilter("monkeybat").valueOf()).toBe("monkeybat");
  });
});
