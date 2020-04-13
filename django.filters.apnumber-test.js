module("djangoFilters.apnumber");

test("apnumber", 12, function () {
  equal(djangoFilters.apnumber(1), "one", "1");
  equal(djangoFilters.apnumber(2), "two", "2");
  equal(djangoFilters.apnumber(3), "three", "3");
  equal(djangoFilters.apnumber(4), "four", "4");
  equal(djangoFilters.apnumber(5), "five", "5");
  equal(djangoFilters.apnumber(6), "six", "6");
  equal(djangoFilters.apnumber(7), "seven", "7");
  equal(djangoFilters.apnumber(8), "eight", "8");
  equal(djangoFilters.apnumber(9), "nine", "9");
  equal(djangoFilters.apnumber(10), "10", "10");
  equal(djangoFilters.apnumber(100), "100", "100");
  equal(djangoFilters.apnumber("monkeybat"), "monkeybat", "not a number");
});

test("apnumber_reverse", 11, function () {
  equal(djangoFilters.apnumber_reverse("one"), 1, "1");
  equal(djangoFilters.apnumber_reverse("two"), 2, "2");
  equal(djangoFilters.apnumber_reverse("three"), 3, "3");
  equal(djangoFilters.apnumber_reverse("four"), 4, "4");
  equal(djangoFilters.apnumber_reverse("five"), 5, "5");
  equal(djangoFilters.apnumber_reverse("six"), 6, "6");
  equal(djangoFilters.apnumber_reverse("seven"), 7, "7");
  equal(djangoFilters.apnumber_reverse("eight"), 8, "8");
  equal(djangoFilters.apnumber_reverse("nine"), 9, "9");
  equal(djangoFilters.apnumber_reverse("ten"), "ten", "10");
  equal(djangoFilters.apnumber_reverse("100"), 100, "100");
});
