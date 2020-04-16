# django-filters-js

A project to convert the default and contrib.humanize template string filters from Django to JavaScript

## Usage

Add `<script src="django-filters.min.js"></script>` to your page. There are no dependencies.

## Chainable Strings

`djangoFilter` implements a chainable object similar to jQuery. This allows for multiple methods to be run in sequence. For example:

    var myString    =   djangoFilter("This is a test sentence").slugify().cut('-'); // becomes "thisisatestsentence"
    // or
    var myString2   =   djangoFilter(200000);
    myString2.apnumber().intcomma(); // becomes 200,000

## Methods

_In addition to the chainable pattern, you can call each method directly at `djangoFilters.[methodName]` with the string, number or date to filter as the first argument._

    djangoFilters.slugify("This is a test sentence"); // becomes "this-is-a-test-sentence"
    djangoFilters.slugify("This is a test sentence").cut('-'); // raises a TypeError

## Default Filters

<a id="addslashes"></a>

### [.addslashes()](#addslashes)

Adds slashes before quotes. Useful for escaping strings in CSV, for example.

- `"I'm using Django"` becomes `"I\'m using Django"`

<a id="capfirst"></a>

### [.capfirst()](#capfirst)

Capitalizes the first character of the value. If the first character is not a letter, this filter has no effect.

- `"django"` becomes `"Django"`

<a id="center"></a>

### [.center(length)](#center)

Centers the value in a field of a given width.

- `"django".center(15)` becomes `"     django    "`

<a id="date"></a>

### [.date(format)](#date)

Formats a Date object according to the `format` parameter (a string). For formatting options, see [Django's date documentation](https://docs.djangoproject.com/en/latest/ref/templates/builtins/#date).

<a id="escape"></a>

### [.escape()](#escape)

Escapes a string’s HTML. Specifically, it makes these replacements:

- < is converted to &lt;
- > is converted to &gt;
- ' (single quote) is converted to &#x27;
- " (double quote) is converted to &quot;
- & is converted to &amp;

<a id="escapejs"></a>

### [.escapejs()](#escapejs)

Escapes characters for use in JavaScript strings. This does not make the string safe for use in HTML or JavaScript template literals, but does protect you from syntax errors when using templates to generate JavaScript/JSON.

<a id="filesizeformat"></a>

### [.filesizeformat()](#filesizeformat)

Formats the value like a ‘human-readable’ file size (i.e. `13 KB`, `4.1 MB`, `102 bytes`, etc.).

<a id="floatformat"></a>

### [.floatformat(precision)](#floatformat)

When used without an argument, rounds a floating-point number to one decimal place – but only if there’s a decimal part to be displayed. Default precision is -1. See https://docs.djangoproject.com/en/3.0/ref/templates/builtins/#floatformat for more details.

<a id="force_escape"></a>

### [.force_escape(precision)](#force_escape)

This is an alias of `.escape()`. Unlike the Django version, the behavior here is identical to `.escape()`. Calling this multiple times returns the same result each time.

<a id="slugify"></a>

### [.slugify(allowUnicode)](#slugify)

Returns a URI safe version of the string, lowercased with all non-standard characters replaced with '-'. If allowUnicode is true, most utf-8 characters respresenting letters or numbers will be allowed.

<a id="time"></a>

### [.time(format)](#time)

An alias of `.date()`. Unlike the Django implementation, `.time()` works with Date objects since there isn't a time-only equivalent in JavaScript.

<a id="cut"></a>

### [.cut(toCut)](#cut)

Removes all instances of the `toCut` parameter from the string.

## django.contrib.humanize Filters

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

<a id="ordinal"></a>

### [.ordinal()](#ordinal)

Appends the ordinal suffix to a number or string representation of a number

- `1` becomes `1st`
- `33` becomes `33rd`
