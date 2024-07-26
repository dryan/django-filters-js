# django-filters-js

A project to convert the default and contrib.humanize template string filters from
Django to JavaScript (via TypeScript).

## Usage as Vanilla JavaScript

The vanilla JavaScript version of this library is available in the `dist` folder. It
sets a djangoFilters property on window. You can include it in your project like so:

```html
<script src="django-filters.js" type="module"></script>
<script>
  const slashed = djangoFilters.addslashes("I'm using Django");
  // "I\'m using Django"
</script>
```

## Usage as TypeScript/ES6 Module

The TypeScript version of this library is available in the `src` folder.
You can include it in your project like so:

```typescript
// grab it all
import * as djangoFilters from 'django-filters-js';
// or pick a few from the main index
import { addslashes, capfirst, ... } from 'django-filters-js';
// or pick a few from the individual files, which should give you better tree-shaking
import { addslashes } from 'django-filters-js/addslashes';
import { capfirst } from 'django-filters-js/capfirst';
```

## Default Filters

### addslashes(value)

_Alias: `addSlashes(value)`_

Adds slashes before quotes. Useful for escaping strings in CSV, for example.

- `"I'm using Django"` becomes `"I\'m using Django"`

### capfirst(value)

_Alias: `capFirst(value)`_

Capitalizes the first character of the value. If the first character is not a letter,
this filter has no effect.

- `"django"` becomes `"Django"`

### center(value, length)

Centers the value in a field of a given width.

- `"django".center(15)` becomes `"     django    "`

### cut(value, toCut)

Removes all instances of the `toCut` parameter from the string.

### date(value, format)

Formats a Date object according to the `format` parameter (a string). For formatting
options, see [Django's date documentation](https://docs.djangoproject.com/en/latest/ref/templates/builtins/#date).

Note that you can backslash-escape a format string if you want to use the “raw” value.
In this example, both “h” and “m” are backslash-escaped, because otherwise each is a
format string that displays the hour and the month, respectively:

```js
date(value, 'H\\h i\\m');
```

This would display as “01h 23m”. Note the need to escape the backslash itself, which
differs from Django Templates.

### escape(value)

Escapes a string’s HTML. Specifically, it makes these replacements:

- < is converted to &lt;
- > is converted to &gt;
- ' (single quote) is converted to &#x27;
- " (double quote) is converted to &quot;
- & is converted to &amp;

### escapejs(value)

_Alias: `escapeJs(value)`_

Escapes characters for use in JavaScript strings. This does not make the string safe
for use in HTML or JavaScript template literals, but does protect you from syntax
errors when using templates to generate JavaScript/JSON.

### filesizeformat(value)

_Alias: `fileSizeFormat(value)`_

Formats the value like a ‘human-readable’ file size (i.e. `13 KB`, `4.1 MB`,
`102 bytes`, etc.).

### floatformat(value, precision)

_Alias: `floatFormat(value, precision)`_

@precision: The number of decimal places to return. If not provided, the default is -1.
Negative precision will leave off the decimal part if it’s zero.
Additionally, precision can contain a "g" suffix to get the integer portion separated
by Intl.NumberFormat for the current locale. Unlike Django, precision cannot be higher
than 21 because of Intl.NumberFormat.

When used without an argument, rounds a floating-point number to one decimal place –
but only if there’s a decimal part to be displayed. Default precision is -1.
See [Django's floatformat documentation](https://docs.djangoproject.com/en/3.0/ref/templates/builtins/#floatformat)
for more details.

### force_escape(value)(#force_escape)

_Alias: `forceEscape(value)`_

This is an alias of `.escape()`. Unlike the Django version, the behavior here is
identical to `.escape()`. Calling this multiple times returns the same result each time.

### iriencode(value)

_Alias: `iriEncode(value)`_

Converts an IRI (Internationalized Resource Identifier) to a string that is suitable
for including in a URL. This is necessary if you’re trying to use strings containing
non-ASCII characters in a URL.

It’s safe to use this filter on a string that has already gone through the
urlencode filter.

### linebreaks(value, autoescape)

Replaces line breaks in plain text with appropriate HTML; a single newline becomes an
HTML line break (`<br>`) and a new line followed by a blank line becomes a paragraph
break (`</p>`). _Note that this returns a string not DOM nodes._

`autoescape` is true by default. When `autoescape` is true, the content will be passed
through `.escape()` before the `<p>` and `<br>` tags are inserted.

### linebreaksbr(value, autoescape)

_Alias: `linebreaksBr(value, autoescape)`_

Converts all newlines in a piece of plain text to HTML line breaks (`<br>`).

`autoescape` is true by default. When `autoescape` is true, the content will be passed
through `.escape()` before the `<br>` tags are inserted.

### linenumbers(value, autoescape)

_Alias: `lineNumbers(value, autoescape)`_

Displays text with line numbers.

### ljust(value, width)

Left-aligns the value in a field of a given width.

### rjust(value, width)

Right-aligns the value in a field of a given width.

### phone2numeric(value)(#phone2numeric)

_Alias: `phone2Numeric(value)`_

Converts a phone number (possibly containing letters) to its numerical equivalent.

The input doesn’t have to be a valid phone number. This will happily convert any string.

### pluralize(value, suffixes)

Returns a plural suffix if the value is not 1, '1', or an object of length 1. By
default, this suffix is 's'.

Example:

```js
`You have ${numMessages} message${pluralize(numMessages)}.`
```

If numMessages is 1, the output will be `''` (an empty string). If numMessages is 2 the
output will be `s`.

For words that require a suffix other than 's', you can provide an alternate suffix as
a parameter to the filter.

Example:

```js
`You have ${numWalruses } walrus${pluralize(numWalruses, "es")}.`
```

For words that don’t pluralize by simple suffix, you can specify both a singular and
plural suffix, separated by a comma.

Example:

```js
`You have ${numCherries} cherr${pluralize(numCherries, 'y,ies')}.`
```

### slugify(value, allowUnicode)

Returns a URI safe version of the string, lowercased with all non-standard characters
replaced with '-'. If allowUnicode is true, most utf-8 characters respresenting
letters or numbers will be allowed.

### striptags(value)

_Alias: `stripTags(value)`_

Attempts to remove all HTML tags. Do not put this output directly into the DOM.

### time(value, format)

An alias of `.date()`. Unlike the Django implementation, `.time()` works with Date
objects since there isn't a time-only equivalent in JavaScript.

### timesince(value, format)

_Alias: `timeSince(value, format)`_

Formats a date as the time since that date (e.g., “4 days, 6 hours”).

Takes an optional argument that is a variable containing the date to use as the
comparison point (without the argument, the comparison point is _now_). For example,
if `blogDate` is a date instance representing midnight on 1 June 2006, and
`commentDate` is a date instance for 08:00 on 1 June 2006, then the following would
return “8 hours”:

```js
timesince(blogDate, commentDate);
```

Minutes is the smallest unit used, and “0 minutes” will be returned for any date that
is in the future relative to the comparison point.

### timeuntil(value, format)

_Alias: `timeUntil(value, format)`_

Similar to `.timesince()` except it compares _now_ to a date in the future.

### title(value)

Converts a string into titlecase by making words start with an uppercase character and
the remaining characters lowercase. This filter makes no effort to keep
“trivial words” in lowercase.

### upper(value)

Converts a string into all uppercase.

### urlencode(value, safe)

_Alias: `urlEncode(value, safe)`_

Escapes a value for use in a URL. An optional argument containing the characters which
should not be escaped can be provided.

If not provided, the ‘/’ character is assumed safe. An empty string can be provided
when all characters should be escaped.

## django.contrib.humanize Filters

### intcomma(value)

Adds comma separators to a number or string representation of a number. _A better
would be to use Intl.NumberFormat. This is here for feature parity with Django._

- `1000000` becomes `1,000,000`
- `1000` becomes `1,000`
- `100` becomes `100`

### apnumber(value)

_Alias: `apNumber(value)`_

For integers 0-9, returns the word. For integers 10+, returns the integer.

- `1` becomes `one`
- `10` becomes `10`

### ordinal(value)

Appends the ordinal suffix to a number or string representation of a number

- `1` becomes `1st`
- `33` becomes `33rd`
