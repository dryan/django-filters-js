module("django.filters.intcomma");

test("intcomma", 10, function () {
  equal(django.filters.intcomma(10000000), "10,000,000", "10 million");
  equal(django.filters.intcomma(1000000), "1,000,000", "1 million");
  equal(django.filters.intcomma(1000), "1,000", "1 thousand");
  equal(django.filters.intcomma(100), "100", "1 hundred");
  equal(django.filters.intcomma(1.5), "1.5", "1 point 5");
  equal(django.filters.intcomma(100.5), "100.5", "1 hundred point 5");
  equal(django.filters.intcomma(1000.5), "1,000.5", "1 thousand point 5");
  equal(django.filters.intcomma(1000000.5), "1,000,000.5", "1 million point 5");
  notEqual(
    django.filters.intcomma("$1000"),
    "1,000",
    "1 thousand dollars (should not translate)"
  );
  equal(django.filters.intcomma("monkeybat"), "monkeybat", "not a number");
});
