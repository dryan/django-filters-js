module('django.filters.slugify');

test('slugify', 2, function() {
    equal(django.filters.slugify('Monkeybat'), 'monkeybat', 'Monkeybat');
    equal(django.filters.slugify('A Farmers Market in the Heart of Suburbia'), 'a-farmers-market-in-the-heart-of-suburbia', 'Farmers Market');
});