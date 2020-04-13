module("django.filters.apnumber");

test("apnumber", 12, function () {
  equal(django.filters.apnumber(1), "one", "1");
  equal(django.filters.apnumber(2), "two", "2");
  equal(django.filters.apnumber(3), "three", "3");
  equal(django.filters.apnumber(4), "four", "4");
  equal(django.filters.apnumber(5), "five", "5");
  equal(django.filters.apnumber(6), "six", "6");
  equal(django.filters.apnumber(7), "seven", "7");
  equal(django.filters.apnumber(8), "eight", "8");
  equal(django.filters.apnumber(9), "nine", "9");
  equal(django.filters.apnumber(10), "10", "10");
  equal(django.filters.apnumber(100), "100", "100");
  equal(django.filters.apnumber("monkeybat"), "monkeybat", "not a number");
});

test("apnumber_reverse", 11, function () {
  equal(django.filters.apnumber_reverse("one"), 1, "1");
  equal(django.filters.apnumber_reverse("two"), 2, "2");
  equal(django.filters.apnumber_reverse("three"), 3, "3");
  equal(django.filters.apnumber_reverse("four"), 4, "4");
  equal(django.filters.apnumber_reverse("five"), 5, "5");
  equal(django.filters.apnumber_reverse("six"), 6, "6");
  equal(django.filters.apnumber_reverse("seven"), 7, "7");
  equal(django.filters.apnumber_reverse("eight"), 8, "8");
  equal(django.filters.apnumber_reverse("nine"), 9, "9");
  equal(django.filters.apnumber_reverse("ten"), "ten", "10");
  equal(django.filters.apnumber_reverse("100"), 100, "100");
});
