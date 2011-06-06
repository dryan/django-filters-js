module('django.filters.utils');

test('trim', 2, function() {
    equal(django.filters.utils.trim('      abd ejf js12 jd\t fjsks\t   '), 'abd ejf js12 jd\t fjsks', 'with tab and spaces');
    equal(django.filters.utils.trim('\n\rabcd\n\n    efg hijk\n\r\n'), 'abcd\n\n    efg hijk', 'with new lines');
});

test('inArray', 2, function() {
    var array  =   ['monkey', 'bat', 'foo', 'bar'];
    equal(django.filters.utils.inArray('bat', array), 1, 'element is in array');
    equal(django.filters.utils.inArray('bananna', array), -1, 'element is not in array');
});

test('l_pad', 4, function() {
    var randomPadding   =   Math.floor(Math.random() * 1000000);
    equal(django.filters.utils.l_pad(12, 20, 0), '00000000000000000012', 'fixed pad length; padded with 0s');
    equal(django.filters.utils.l_pad(12, randomPadding, 0).length, randomPadding, 'random pad length; padded with 0s; only checks for length');
    equal(django.filters.utils.l_pad(12, 22, 'abc'), 'abcabcabcabcabcabcab12', 'fixed pad length; padded with abc');
    equal(django.filters.utils.l_pad(12, randomPadding, 'abc').length, randomPadding, 'random pad length; padded with abc; only checks for length');
});

test('r_pad', 4, function() {
    var randomPadding   =   Math.floor(Math.random() * 1000000);
    equal(django.filters.utils.r_pad(12, 20, 0), '12000000000000000000', 'fixed pad length; padded with 0s');
    equal(django.filters.utils.r_pad(12, randomPadding, 0).length, randomPadding, 'random pad length; padded with 0s; only checks for length');
    equal(django.filters.utils.r_pad(12, 22, 'abc'), '12abcabcabcabcabcabcab', 'fixed pad length; padded with abc');
    equal(django.filters.utils.r_pad(12, randomPadding, 'abc').length, randomPadding, 'random pad length; padded with abc; only checks for length');
});