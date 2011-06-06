module('django.filters.slugify');

test('slugify', 5, function() {
    equal(django.filters.slugify('Monkeybat'), 'monkeybat', 'Monkeybat');
    equal(django.filters.slugify('A Farmers Market in the Heart of Suburbia'), 'a-farmers-market-in-the-heart-of-suburbia', 'Farmers Market');
    equal(django.filters.slugify('A Farmers Market in the Heart of Suburbia', 20), 'a-farmers-market-in', 'Farmers Market with maxLength');
    equal(django.filters.slugify('A Farmers Market in the Heart of Suburbia', 200), 'a-farmers-market-in-the-heart-of-suburbia', 'Farmers Market with maxLength longer than original string');
    equal(django.filters.slugify('‘Black & Bright!’ a Symbol of Success at Calvin Donaldson'), 'black-bright-a-symbol-of-success-at-calvin-donaldson', 'special characters');
});