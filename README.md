# django-filters-js

A project to convert the default and contrib.humanize template filters from Django to JavaScript

## Usage

Add `<script src="django-filters.min.js"></script>` to your page. There are no dependencies.

## Chainable Strings

`django.filter` implements a chainable object similar to jQuery. This allows for multiple methods to be run in sequence. For example:

    var myString    =   django.filter("This is a test sentence").slugify().cut('-'); // becomes "thisisatestsentence"
    // or
    var myString2   =   django.filter(200000);
    myString2.apnumber().intcomma(); // becomes 200,000

## Methods

_In addition to the chainable pattern, you can call each method directly at `django.filters.[methodName]` with the string, number or date to filter as the first argument._

    django.filters.slugify("This is a test sentence"); // becomes "this-is-a-test-sentence"
    django.filters.slugify("This is a test sentence").cut('-'); // raises a TypeError

<a id="intcomma"></a>

### [.intcomma()](#intcomma)

Adds comma separators to a number or string representation of a number.

- `1000000` becomes `1,000,000`
- `1000` becomes `1,000`
- `100` becomes `100`

<a id="apnumber"></a>

### [.apnumber()](#apnumber)

For integers 0-9, returns the word. For integers 10+, returns the integer.

- `1` becomes `one`
- `10` becomes `10`

<a id="slugify"></a>

### [.slugify()](#slugify)

Returns a URI safe version of the string, lowercased with all non-standard characters replaced with '-'.

<a id="ordinal"></a>

### [.ordinal()](#ordinal)

Appends the ordinal suffix to a number or string representation of a number

- `1` becomes `1st`
- `33` becomes `33rd`

<a id="date"></a>

### [.date(format)](#date)

Formats a Date object according to the `format` parameter (a string). Use `%` to escape characters; use `%%`to print a literal `%`. For formatting options, see [Django's date documentation](https://docs.djangoproject.com/en/1.5/ref/templates/builtins/#date).

<a id="time"></a>

### [.time(format)](#time)

An alias of `.date()`. Unlike the Django implementation, `.time()` works with Date objects since there isn't a time-only equivalent in JavaScript.

<a id="cut"></a>

### [.cut(toCut)](#cut)

Removes all instances of the `toCut` parameter from the string.

<a id="trim"></a>

### [.trim()](#trim)

Removes whitespace from the beginning and end of the string. _Only available on instances of `django.filter()`. To use on plain strings, see [`django.filters.utils.trim`](#utils-trim) below._

## Utility Methods

There are five methods primarily intended for internal use by the filter methods, but may be of use on their on as well.

<a id="utils-trim"></a>

### [django.filters.utils.trim(text)](#utils-trim)

Removes whitespace from the beginning and end of the string.

<a id="utils-inarray"></a>

### [django.filters.utils.inArray(element, array)](#utils-inarray)

Returns the position of `element` in `array`. Returns `-1` if `element` is not found.

<a id="utils-l_pad"></a>

### [django.filters.utils.l_pad(object, length, pad)](#utils-l_pad)

Ensures that the string representation of `object` is at least as long as `length`. If `object` is shorter, `pad` is added to the beginning of `object` until is reaches `length`.

<a id="utils-r_pad"></a>

### [django.filters.utils.r_pad(object, length, pad)](#utils-r_pad)

Ensures that the string representation of `object` is at least as long as `length`. If `object` is shorter, `pad` is added to the end of `object` until is reaches `length`.

<a id="utils-parsedate"></a>

### [django.filters.utils.parseDate(dateString)](#utils-parsedate)

Turns a string representation of a date and turns it into a `Date` object. If the `dateString` cannot be parsed, returns the original string.
