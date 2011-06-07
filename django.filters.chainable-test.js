module('django.filter');

test('filter chainable', 10, function() {
    equal(django.filter('1').apnumber().toString(), 'one', 'apnumber unchained');
    equal(django.filter('1000000').intcomma().toString(), '1,000,000', 'intcomma unchained');
    equal(django.filter('    this is a string     ').trim().toString(), 'this is a string', 'trim unchained');
    equal(django.filter('this is a string').cut('is').toString(), 'th  a string', 'cut unchained');
    equal(django.filter('    this is a string     ').trim().cut('is').toString(), 'th  a string', 'trim->cut');
    equal(django.filter('    this is a string     ').trim().cut('is').slugify().toString(), 'th-a-string', 'trim->cut->slugify');
    equal(django.filter('21 December 2000').date('N j, Y').toString(), 'Dec. 21, 2000', 'date unchained');
    equal(django.filter('2011-06-07 13:48').date('N j, Y, P').toString(), 'June 7, 2011, 1:48 p.m.', 'date unchained');
    equal(django.filter('1000000').intcomma().ordinal().toString(), '1,000,000th', 'intcomma->ordinal');
    equal(django.filter('1000000').ordinal().intcomma().toString(), '1,000,000th', 'ordinal->intcomma');
});