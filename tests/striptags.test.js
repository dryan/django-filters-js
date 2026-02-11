import { default as djangoFilters } from "../dist/index.js";

describe("striptags", () => {
  test("striptags 1", () => {
    expect(djangoFilters.striptags("<a>x</a> <p><b>y</b></p>")).toBe("x y");
  });

  test("striptags 2", () => {
    expect(
      djangoFilters.striptags(
        'some <b>html</b> with <script>alert("You smell")</script> disallowed <img /> tags'
      )
    ).toBe('some html with alert("You smell") disallowed  tags');
  });

  test("non string input", () => {
    expect(djangoFilters.striptags(42)).toBe("42");
  });

  test("nested script tag injection (security)", () => {
    // This tests the fix for incomplete multi-character sanitization
    const malicious = "<scrip<script>alert(1)</script>t>test</script>";
    const result = djangoFilters.striptags(malicious);
    // Should strip all tags, but standalone > characters are preserved
    expect(result).not.toContain("<");
    expect(result).toBe("alert(1)t>test");
  });

  test("multiple nested tags", () => {
    expect(djangoFilters.striptags("<a<b<c>d</c>e</b>f</a>")).toBe("def");
  });

  test("unclosed angle bracket", () => {
    // In HTML, <b> opens AND closes the angle bracket (even without </b>)
    // This matches Django's behavior of treating <tag> as a complete tag token
    expect(djangoFilters.striptags("<p>Hello <b>world")).toBe("Hello world");
  });

  test("multiple > characters in content", () => {
    // > characters outside of tags should be preserved
    expect(djangoFilters.striptags("<p>1 > 2 > 3</p>")).toBe("1 > 2 > 3");
  });

  test("ReDoS protection - large input (performance)", () => {
    // This tests the fix for polynomial ReDoS vulnerability
    // The character-by-character approach should handle this in O(n) time
    const malicious = "<".repeat(10000) + "test";
    const start = Date.now();
    const result = djangoFilters.striptags(malicious);
    const elapsed = Date.now() - start;

    // Should complete very quickly (< 100ms even on slow machines)
    expect(elapsed).toBeLessThan(100);
    // All the < characters are unclosed, so "test" is inside a tag and gets stripped
    expect(result).toBe("");
  });

  test("empty tags", () => {
    expect(djangoFilters.striptags("<><><>test<>")).toBe("test");
  });

  test("tags with attributes", () => {
    expect(
      djangoFilters.striptags('<a href="example.com" class="link">click</a>')
    ).toBe("click");
  });
});
