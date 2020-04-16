const { djangoFilter } = require("../django-filters");

describe("chainable filters: built-in JS methods", () => {
  test("valueOf", () => {
    expect(djangoFilter("monkeybat").valueOf()).toBe("monkeybat");
  });

  test("toString", () => {
    expect(djangoFilter("monkeybat").toString()).toBe("monkeybat");
  });
});

describe("chainable filters: individual methods", () => {
  test("addslashes", () => {
    expect(
      djangoFilter(`"double quotes" and 'single quotes'`)
        .addslashes()
        .toString()
    ).toBe("\\\"double quotes\\\" and \\'single quotes\\'");
  });

  test("apnumber", () => {
    expect(djangoFilter("1").apnumber().toString()).toBe("one");
  });

  test("capfirst", () => {
    expect(djangoFilter("django").capfirst().toString()).toBe("Django");
  });

  test("center", () => {
    expect(djangoFilter("django").center(8).toString()).toBe(" django ");
  });

  test("cut", () => {
    expect(djangoFilter("this is a string").cut("is").toString()).toBe(
      "th  a string"
    );
  });

  test("date: date only", () => {
    expect(djangoFilter("21 December 2000").date("N j, Y").toString()).toBe(
      "Dec. 21, 2000"
    );
  });

  test("date: default format", () => {
    expect(djangoFilter("21 December 2000").date().toString()).toBe(
      "Dec. 21, 2000"
    );
  });

  test("date: date and time", () => {
    expect(djangoFilter("2011-06-07 13:48").date("N j, Y, P").toString()).toBe(
      "June 7, 2011, 1:48 p.m."
    );
  });

  test("escape", () => {
    expect(djangoFilter("x&y").escape().toString()).toBe("x&amp;y");
  });

  test("escape->escape", () => {
    expect(djangoFilter("x&y").escape().escape().toString()).toBe("x&amp;y");
  });

  test("escapejs", () => {
    expect(
      djangoFilter("\"double quotes\" and 'single quotes'")
        .escapejs()
        .toString()
    ).toBe("\\u0022double quotes\\u0022 and \\u0027single quotes\\u0027");
  });

  test("filesizeformat", () => {
    expect(djangoFilter(0).filesizeformat().toString()).toBe("0\xa0bytes");
  });

  test("floatformat", () => {
    expect(djangoFilter(7.7).floatformat().toString()).toBe("7.7");
  });

  test("force_escape", () => {
    expect(djangoFilter("x&y").force_escape().toString()).toBe("x&amp;y");
  });

  test("force_escape->force_escape", () => {
    expect(djangoFilter("x&y").force_escape().force_escape().toString()).toBe(
      "x&amp;y"
    );
  });

  test("forceEscape", () => {
    expect(djangoFilter("x&y").forceEscape().toString()).toBe("x&amp;y");
  });

  test("forceEscape->forceEscape", () => {
    expect(djangoFilter("x&y").forceEscape().forceEscape().toString()).toBe(
      "x&amp;y"
    );
  });

  test("intcomma", () => {
    expect(djangoFilter("1000000").intcomma().toString()).toBe("1,000,000");
  });

  test("iriencode", () => {
    expect(djangoFilter("S\xf8r-Tr\xf8ndelag").iriencode().toString()).toBe(
      "S%C3%B8r-Tr%C3%B8ndelag"
    );
  });

  test("linebreaks", () => {
    expect(djangoFilter("line 1").linebreaks().toString()).toBe(
      "<p>line 1</p>"
    );
  });

  test("linebreaksbr", () => {
    expect(djangoFilter("line 1\nline 2").linebreaksbr().toString()).toBe(
      "line 1<br>line 2"
    );
  });

  test("linenumbers", () => {
    expect(djangoFilter("line 1\nline 2").linenumbers().toString()).toBe(
      "1. line 1\n2. line 2"
    );
  });

  test("ljust", () => {
    expect(djangoFilter("test").ljust(10).toString()).toBe("test      ");
  });

  test("phone2numeric", () => {
    expect(djangoFilter("1-800-call-me").phone2numeric().toString()).toBe(
      "1-800-2255-63"
    );
  });

  test("rjust", () => {
    expect(djangoFilter("test").rjust(10).toString()).toBe("      test");
  });

  test("time: default format", () => {
    expect(djangoFilter("21 December 2000").time().toString()).toBe("midnight");
  });
});

describe("chainable filters: sequential methods", () => {
  test("trim->cut->slugify", () => {
    expect(
      djangoFilter("    this is a string     ").cut("is").slugify().toString()
    ).toBe("th-a-string");
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
});
