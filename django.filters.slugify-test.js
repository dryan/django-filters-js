module("djangoFilters.slugify");

test("slugify", 2, function () {
  equal(djangoFilters.slugify("Monkeybat"), "monkeybat", "Monkeybat");
  equal(
    djangoFilters.slugify("A Farmers Market in the Heart of Suburbia"),
    "a-farmers-market-in-the-heart-of-suburbia",
    "Farmers Market"
  );
});
