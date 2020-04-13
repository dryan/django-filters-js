module("djangoFilters.ordinal");

test("ordinal", 7, function () {
  equal(djangoFilters.ordinal(1), "1st", "1");
  equal(djangoFilters.ordinal(2), "2nd", "2");
  equal(djangoFilters.ordinal(33), "33rd", "33");
  equal(djangoFilters.ordinal(84), "84th", "84");
  equal(djangoFilters.ordinal("84"), "84th", "84 (passed as string)");
  equal(djangoFilters.ordinal(1000000), "1000000th", "1 million");
  equal(djangoFilters.ordinal("monkeybat"), "monkeybat", "monkeybat");
});
