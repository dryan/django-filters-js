module("django.filters.utils");

test("trim", 2, function () {
  equal(
    django.filters.utils.trim("      abd ejf js12 jd\t fjsks\t   "),
    "abd ejf js12 jd\t fjsks",
    "with tab and spaces"
  );
  equal(
    django.filters.utils.trim("\n\rabcd\n\n    efg hijk\n\r\n"),
    "abcd\n\n    efg hijk",
    "with new lines"
  );
});

test("padStart", 4, function () {
  var randomPadding = Math.floor(Math.random() * 1000000);
  equal(
    django.filters.utils.padStart(12, 20, 0),
    "00000000000000000012",
    "fixed pad length; padded with 0s"
  );
  equal(
    django.filters.utils.padStart(12, randomPadding, 0).length,
    randomPadding,
    "random pad length; padded with 0s; only checks for length"
  );
  equal(
    django.filters.utils.padStart(12, 22, "abc"),
    "abcabcabcabcabcabcab12",
    "fixed pad length; padded with abc"
  );
  equal(
    django.filters.utils.padStart(12, randomPadding, "abc").length,
    randomPadding,
    "random pad length; padded with abc; only checks for length"
  );
});

test("padEnd", 4, function () {
  var randomPadding = Math.floor(Math.random() * 1000000);
  equal(
    django.filters.utils.padEnd(12, 20, 0),
    "12000000000000000000",
    "fixed pad length; padded with 0s"
  );
  equal(
    django.filters.utils.padEnd(12, randomPadding, 0).length,
    randomPadding,
    "random pad length; padded with 0s; only checks for length"
  );
  equal(
    django.filters.utils.padEnd(12, 22, "abc"),
    "12abcabcabcabcabcabcab",
    "fixed pad length; padded with abc"
  );
  equal(
    django.filters.utils.padEnd(12, randomPadding, "abc").length,
    randomPadding,
    "random pad length; padded with abc; only checks for length"
  );
});
