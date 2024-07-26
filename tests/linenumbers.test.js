import { default as djangoFilters } from "../dist/index.js";

describe("linenumbers", () => {
  test("two lines", () => {
    expect(djangoFilters.linenumbers("line 1\nline 2")).toBe(
      "1. line 1\n2. line 2"
    );
  });

  test("ten lines", () => {
    expect(
      djangoFilters.linenumbers(
        Array.from(Array(10).keys())
          .map((val) => "x")
          .join("\n")
      )
    ).toBe(
      "01. x\n02. x\n03. x\n04. x\n05. x\n06. x\n07. x\n08. x\n09. x\n10. x"
    );
  });

  test("non string input", () => {
    expect(djangoFilters.linenumbers(42)).toBe("1. 42");
  });

  test("autoescape on", () => {
    expect(djangoFilters.linenumbers("foo\n<a>bar</a>\nbuz")).toBe(
      "1. foo\n2. &lt;a&gt;bar&lt;/a&gt;\n3. buz"
    );
  });

  test("autoescape off", () => {
    expect(djangoFilters.linenumbers("foo\n<a>bar</a>\nbuz", false)).toBe(
      "1. foo\n2. <a>bar</a>\n3. buz"
    );
  });
});
