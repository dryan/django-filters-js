module("djangoFilters.utils");

test("padStart", 4, function () {
  var randomPadding = Math.floor(Math.random() * 1000000);
  equal(
    djangoFilters.utils.padStart(12, 20, 0),
    "00000000000000000012",
    "fixed pad length; padded with 0s"
  );
  equal(
    djangoFilters.utils.padStart(12, randomPadding, 0).length,
    randomPadding,
    "random pad length; padded with 0s; only checks for length"
  );
  equal(
    djangoFilters.utils.padStart(12, 22, "abc"),
    "abcabcabcabcabcabcab12",
    "fixed pad length; padded with abc"
  );
  equal(
    djangoFilters.utils.padStart(12, randomPadding, "abc").length,
    randomPadding,
    "random pad length; padded with abc; only checks for length"
  );
});

test("padEnd", 4, function () {
  var randomPadding = Math.floor(Math.random() * 1000000);
  equal(
    djangoFilters.utils.padEnd(12, 20, 0),
    "12000000000000000000",
    "fixed pad length; padded with 0s"
  );
  equal(
    djangoFilters.utils.padEnd(12, randomPadding, 0).length,
    randomPadding,
    "random pad length; padded with 0s; only checks for length"
  );
  equal(
    djangoFilters.utils.padEnd(12, 22, "abc"),
    "12abcabcabcabcabcabcab",
    "fixed pad length; padded with abc"
  );
  equal(
    djangoFilters.utils.padEnd(12, randomPadding, "abc").length,
    randomPadding,
    "random pad length; padded with abc; only checks for length"
  );
});
