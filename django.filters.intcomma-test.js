module('django.filters.intcomma');

test('intcomma', 6, function() {
    equal(django.filters.intcomma(10000000), '10,000,000', '10 million');
    equal(django.filters.intcomma(1000000), '1,000,000', '1 million');
    equal(django.filters.intcomma(1000), '1,000', '1 thousand');
    equal(django.filters.intcomma(100), '100', '1 hundred');
    notEqual(django.filters.intcomma('$1000'), '$1,000', '1 thousand dollars (should not translate)');
    equal(django.filters.intcomma('monkeybat'), 'monkeybat', 'not a number');
});