module('django.filters.ordinal');

test('ordinal', 7, function() {
    equal(django.filters.ordinal(1),            '1st',          '1');
    equal(django.filters.ordinal(2),            '2nd',          '2');
    equal(django.filters.ordinal(33),           '33rd',         '33');
    equal(django.filters.ordinal(84),           '84th',         '84');
    equal(django.filters.ordinal('84'),         '84th',         '84 (passed as string)');
    equal(django.filters.ordinal(1000000),      '1000000th',    '1 million');
    equal(django.filters.ordinal('monkeybat'),  'monkeybat',    'monkeybat');
});