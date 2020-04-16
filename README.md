# django-filters-js

A project to convert the default and contrib.humanize template string filters from Django to JavaScript

## Usage

Add `<script src="django-filters.min.js"></script>` to your page. There are no dependencies.

## Default Filters

<a id="addslashes"></a>

### [.addslashes(value)](#addslashes)

Adds slashes before quotes. Useful for escaping strings in CSV, for example.

- `"I'm using Django"` becomes `"I\'m using Django"`

<a id="capfirst"></a>

### [.capfirst(value)](#capfirst)

Capitalizes the first character of the value. If the first character is not a letter, this filter has no effect.

- `"django"` becomes `"Django"`

<a id="center"></a>

### [.center(value, length)](#center)

Centers the value in a field of a given width.

- `"django".center(15)` becomes `"     django    "`

<a id="cut"></a>

### [.cut(value, toCut)](#cut)

Removes all instances of the `toCut` parameter from the string.

<a id="date"></a>

### [.date(value, format)](#date)

Formats a Date object according to the `format` parameter (a string). For formatting options, see [Django's date documentation](https://docs.djangoproject.com/en/latest/ref/templates/builtins/#date).

<a id="escape"></a>

### [.escape(value)](#escape)

Escapes a string’s HTML. Specifically, it makes these replacements:

- < is converted to &lt;
- > is converted to &gt;
- ' (single quote) is converted to &#x27;
- " (double quote) is converted to &quot;
- & is converted to &amp;

<a id="escapejs"></a>

### [.escapejs(value)](#escapejs)

Escapes characters for use in JavaScript strings. This does not make the string safe for use in HTML or JavaScript template literals, but does protect you from syntax errors when using templates to generate JavaScript/JSON.

<a id="filesizeformat"></a>

### [.filesizeformat(value)](#filesizeformat)

Formats the value like a ‘human-readable’ file size (i.e. `13 KB`, `4.1 MB`, `102 bytes`, etc.).

<a id="floatformat"></a>

### [.floatformat(value, precision)](#floatformat)

When used without an argument, rounds a floating-point number to one decimal place – but only if there’s a decimal part to be displayed. Default precision is -1. See https://docs.djangoproject.com/en/3.0/ref/templates/builtins/#floatformat for more details.

<a id="force_escape"></a>

### [.force_escape(value)](#force_escape)

This is an alias of `.escape()`. Unlike the Django version, the behavior here is identical to `.escape()`. Calling this multiple times returns the same result each time.

<a id="iriencode"></a>

### [.iriencode(value)](#iriencode)

Converts an IRI (Internationalized Resource Identifier) to a string that is suitable for including in a URL. This is necessary if you’re trying to use strings containing non-ASCII characters in a URL.

It’s safe to use this filter on a string that has already gone through the urlencode filter.

<a id="linebreaks"></a>

### [.linebreaks(value, autoescape)](#linebreaks)

Replaces line breaks in plain text with appropriate HTML; a single newline becomes an HTML line break (`<br>`) and a new line followed by a blank line becomes a paragraph break (`</p>`)

`autoescape` is true by default. When `autoescape` is true, the content will be passed through `.escape()` before the `<p>` and `<br>` tags are inserted.

<a id="linebreaksbr"></a>

### [.linebreaksbr(value, autoescape)](#linebreaksbr)

Converts all newlines in a piece of plain text to HTML line breaks (`<br>`).

`autoescape` is true by default. When `autoescape` is true, the content will be passed through `.escape()` before the `<br>` tags are inserted.

<a id="linenumbers"></a>

### [.linenumbers(value, autoescape)](#linenumbers)

Displays text with line numbers.

<a id="ljust"></a>

### [.ljust(value, width)](#ljust)

Left-aligns the value in a field of a given width.

<a id="rjust"></a>

### [.rjust(value, width)](#rjust)

Right-aligns the value in a field of a given width.

<a id="phone2numeric"></a>

### [.phone2numeric(value)](#phone2numeric)

Converts a phone number (possibly containing letters) to its numerical equivalent.

The input doesn’t have to be a valid phone number. This will happily convert any string.

<a id="pluralize"></a>

### [.pluralize(value, suffixes)](#pluralize)

Returns a plural suffix if the value is not 1, '1', or an object of length 1. By default, this suffix is 's'.

Example:

```js
`You have ${numMessages} message${djangoFilters.pluralize(numMessages)}.`
```

If numMessages is 1, the output will be `''` (an empty string). If numMessages is 2 the output will be `s`.

For words that require a suffix other than 's', you can provide an alternate suffix as a parameter to the filter.

Example:

```js
`You have ${numWalruses } walrus${djangoFilters.pluralize(numWalruses, "es")}.`
```

For words that don’t pluralize by simple suffix, you can specify both a singular and plural suffix, separated by a comma.

Example:

```js
`You have ${numCherries} cherr${djangoFilters.pluralize(numCherries, 'y,ies')}.`
```

<a id="slugify"></a>

### [.slugify(value, allowUnicode)](#slugify)

Returns a URI safe version of the string, lowercased with all non-standard characters replaced with '-'. If allowUnicode is true, most utf-8 characters respresenting letters or numbers will be allowed.

<a id="striptags"></a>

### [.striptags(value)](#striptags)

Attempts to remove all HTML tags. Do not put this output directly into the DOM.

<a id="time"></a>

### [.time(value, format)](#time)

An alias of `.date()`. Unlike the Django implementation, `.time()` works with Date objects since there isn't a time-only equivalent in JavaScript.

<a id="timesince"></a>

### [.timesince(value, format)](#timesince)

Formats a date as the time since that date (e.g., “4 days, 6 hours”).

Takes an optional argument that is a variable containing the date to use as the comparison point (without the argument, the comparison point is _now_). For example, if `blogDate` is a date instance representing midnight on 1 June 2006, and `commentDate` is a date instance for 08:00 on 1 June 2006, then the following would return “8 hours”:

```js
djangoFilters.timesince(blogDate, commentDate);
```

Minutes is the smallest unit used, and “0 minutes” will be returned for any date that is in the future relative to the comparison point.

<a id="timeuntil"></a>

### [.timeuntil(value, format)](#timeuntil)

Similar to `.timesince()` except it compares _now_ to a date in the future.


## django.contrib.humanize Filters

<a id="intcomma"></a>

### [.intcomma(value)](#intcomma)

Adds comma separators to a number or string representation of a number.

- `1000000` becomes `1,000,000`
- `1000` becomes `1,000`
- `100` becomes `100`

<a id="apnumber"></a>

### [.apnumber(value)](#apnumber)

For integers 0-9, returns the word. For integers 10+, returns the integer.

- `1` becomes `one`
- `10` becomes `10`

<a id="ordinal"></a>

### [.ordinal(value)](#ordinal)

Appends the ordinal suffix to a number or string representation of a number

- `1` becomes `1st`
- `33` becomes `33rd`
