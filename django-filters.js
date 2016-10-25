var django = window.django || (window.django = {});

(function(){
    "use strict";
    
    if(!django.filters) {
        django.filters  =   {};
    }
    
    django.filters.utils   =   {
        // borrowed from jQuery
        'trim': typeof String.prototype.trim ?  function( text ) {
                            return text === null ? "" : String.prototype.trim.call( text );
                        } : 
                        function( text ) {
                            return text === null ? "" : text.toString().replace(/^\s+/, "").replace(/\s+$/, "");
                        },
        // borrowed from jQuery
        'inArray':      function( elem, array ) {
                            if ( Array.prototype.indexOf ) {
                                return Array.prototype.indexOf.call( array, elem );
                            }

                            for ( var i = 0, length = array.length; i < length; i++ ) {
                                if ( array[ i ] === elem ) {
                                    return i;
                                }
                            }

                            return -1;
                        },
        'l_pad':        function(obj, len, pad) {
                            obj =   obj.toString();
                            pad =   pad.toString();
                            var padding =   "";
                            while(padding.length < len) {
                                padding =   pad + padding;
                            }
                            obj =   padding.substr(0, len - obj.length) + obj;
                            return obj;
                        },
        'r_pad':        function(obj, len, pad) {
                            obj =   obj.toString();
                            pad =   pad.toString();
                            while(obj.length < len) {
                                obj =   obj + pad;
                            }
                            obj =   obj.substr(0, len);
                            return obj;
                        },
        'parseDate':    function(string) {
                            var date    =   new Date(string.replace(/-/g, '/').replace(/T/g, ' '));
                            if(date.toString().toLowerCase() === 'invalid date') {
                                return string;
                            }
                            return date;
                        }
        
    };
    
    var utils   =   django.filters.utils;

    django.filters.intcomma = function( number ) {
        var origNumber = number;
        number = parseFloat( number );
        if( isNaN( number ) ) {
            return origNumber;
        }
        var numString = String( number );
        var decimal = null;
        if ( numString.indexOf('.') > -1 ) {
            numString = numString.split('.', 2);
            decimal = numString[1];
            numString = numString[0];
        }
        number = "";
        var loopCount = 0;
        for (var i = numString.length - 1; i >= 0; i--){
            number = ( loopCount % 3 === 2 && i > 0 ? ',' : '' ) + numString[i] + number;
            loopCount++;
        }
        if(django.filters.utils.inArray(String(origNumber).substr(String(origNumber).length - 2), django.filters.ordinal.suffixes.current) > -1) {
            return [number, String(origNumber).substr(String(origNumber).length - 2)].join('');
        }
        if( decimal ) {
            number = [number, decimal].join('.');
        }
        return number;
    };

    django.filters.apnumber = function( number ) {
        var origNumber  =   number;
        number = parseInt( String(number).replace(/[^\d]+/g, ''), 10 );
        if( isNaN(number) ) {
            return origNumber;
        }
        return django.filters.apnumber.numbers.current[number] || String(number);
    };

    django.filters.apnumber.numbers =   {
        'en-us':    [
            'zero',
            'one',
            'two',
            'three',
            'four',
            'five',
            'six',
            'seven',
            'eight',
            'nine'
        ]
    };
    django.filters.apnumber.numbers.en      =   django.filters.apnumber.numbers['en-us'];
    if(navigator.language && django.filters.apnumber.numbers[navigator.language]) {
        django.filters.apnumber.numbers.current     =   django.filters.apnumber.numbers[navigator.language];
    } else {
        django.filters.apnumber.numbers.current     =   django.filters.apnumber.numbers['en-us'];
    }

    django.filters.apnumber_reverse = function( number ) {
        var origNumber  =   number;
        number = utils.trim(number);
        for (var i = django.filters.apnumber.numbers.current.length - 1; i >= 0; i--) {
            if(number === django.filters.apnumber.numbers.current[i]) {
                return i;
            }
        }
        number = parseInt( String(number).replace(/[^\d]+/g, ''), 10 );
        if( isNaN(number) ) {
            number  =   origNumber;
        }
        return number;
    };
    
    django.filters.slugify = function( str ) {
        return utils.trim(str).replace(/[^a-zA-Z0-9-._~]/g, '-').toLowerCase().replace(/^-+/, '').replace(/-+$/, '').replace(/-+/g, '-');
    };
    
    django.filters.ordinal = function( number ) {
        var num = parseInt(String(number).replace(/[^\d]+/g, ''), 10);
        if(isNaN(num)) {
            return number;
        }

        if(utils.inArray(num % 100, [11, 12, 13]) > -1) {
            return [number, django.filters.ordinal.suffixes.current[0]].join('');
        }
        return [number, django.filters.ordinal.suffixes.current[num % 10]].join('');
    };
    
    django.filters.date =   function(date, format) {
        /*
            To escape a character, use '%'; to print a literal '%', use '%%'.
            Otherwise, formatting follows https://docs.djangoproject.com/en/1.3/ref/templates/builtins/#date.
        */
        if(!date || ( date.toString && date.toString().toLowerCase() === 'invalid date' )) {
            return date;
        }
        format      =   format || django.filters.date.defaultFormats.date;
        var jan1    =   new Date(date.getFullYear(), 0, 1);
        
        function normalize12Hours(hours) {
            if(hours > 12) {
                hours   =   hours - 12;
            } else if(hours === 0) {
                hours   =   12;
            }
            return hours;
        }

        var formats =   {
            'a':    (date.getHours() < 12 ? django.filters.date.meridians.current.ap.am : django.filters.date.meridians.current.ap.pm),
            'A':    (date.getHours() < 12 ? django.filters.date.meridians.current.normal.am : django.filters.date.meridians.current.normal.pm),
            'b':    django.filters.date.months.current.s[date.getMonth()].toLowerCase(),
            'd':    utils.l_pad(date.getDate(), 2, 0),
            'D':    django.filters.date.days.current.s[date.getDay()],
            'E':    (django.filters.date.months.current.locale ? django.filters.date.months.current.locale[date.getMonth()] : django.filters.date.months.current.l[date.getMonth()]),
            'f':    (function(date) {
                        var ret =   [normalize12Hours(date.getHours())];
                        if(date.getMinutes() !== 0) {
                            ret.push(':');
                            ret.push(utils.l_pad(date.getMinutes(), 2, 0));
                        }
                        return ret.join('');
                    })(date),
            'F':    django.filters.date.months.current.l[date.getMonth()],
            'g':    normalize12Hours(date.getHours()),
            'G':    date.getHours(),
            'h':    utils.l_pad(normalize12Hours(date.getHours()), 2, 0),
            'H':    utils.l_pad(date.getHours(), 2, 0),
            'i':    utils.l_pad(date.getMinutes(), 2, 0),
            'j':    date.getDate(),
            'l':    django.filters.date.days.current.l[date.getDay()],
            'L':    Boolean(new Date(date.getFullYear(), 1, 29).getDate() === 29),
            'm':    utils.l_pad(date.getMonth() + 1, 2, 0),
            'M':    django.filters.date.months.current.s[date.getMonth()],
            'n':    date.getMonth() + 1,
            'N':    django.filters.date.months.current.ap[date.getMonth()],
            'O':    (function(date) {
                        var offsetHours     =   Math.ceil(date.getTimezoneOffset() / 60),
                            offsetMinutes   =   date.getTimezoneOffset() % 60;
                        return (offsetHours <= 0 ? '+' : '-') + utils.l_pad(offsetHours, 2, 0) + utils.l_pad(offsetMinutes, 2, 0);
                    })(date),
            'P':    (function(date) {
                        if((date.getHours() === 0 || date.getHours() === 12) && date.getMinutes() === 0) {
                            return django.filters.date.meridians.current.normal[date.getHours()];
                        }
                        var ret =   [normalize12Hours(date.getHours())];
                        if(date.getMinutes() !== 0) {
                            ret.push(':');
                            ret.push(utils.l_pad(date.getMinutes(), 2, 0));
                        }
                        ret.push(' ');
                        ret.push((date.getHours() < 12 ? django.filters.date.meridians.current.ap.am : django.filters.date.meridians.current.ap.pm));
                        return ret.join('');
                    })(date),
            's':    utils.l_pad(date.getSeconds(), 2, 0),
            'S':    django.filters.ordinal(date.getDate()).replace(date.getDate(), ''),
            't':    (32 - new Date(date.getYear(), date.getMonth(), 32).getDate()),
            'T':    (function(date) {
                        var timeString  =   date.toTimeString();
                        timeString      =   timeString.substring(timeString.indexOf('(') + 1, timeString.length - 1);
                        return timeString;
                    })(date),
            'u':    date.getMilliseconds() * 1000,
            'U':    Math.floor(date.getTime() / 1000),
            'w':    date.getDay(),
            'W':    (function(date) {
                        // based on http://www.meanfreepath.com/support/getting_iso_week.html
                        var newYearDoW  =   jan1.getDay();
                        newYearDoW      =   newYearDoW >= 0 ? newYearDoW : newYearDoW + 7;
                        var dayNum      =   Math.floor(
                                                (
                                                    date.getTime() - jan1.getTime() -
                                                    (
                                                        date.getTimezoneOffset() - jan1.getTimezoneOffset()
                                                    ) * 60000
                                                ) / 86400000
                                            ) + 1,
                            weekNum;
                        if(newYearDoW < 4) {
                            weekNum     =   Math.floor(
                                                (dayNum + newYearDoW - 1) / 7
                                            ) + 1;
                            if(weekNum > 52) {
                                newYearDoW  =   new Date(date.getFullYear() + 1, 0, 1).getDay();
                                newYearDoW  =   newYearDoW >= 0 ? newYearDoW : newYearDoW + 7;
                                weekNum =   newYearDoW < 4 ? 1 : 53;
                            }
                        } else {
                            weekNum     =   Math.floor(
                                                (dayNum + newYearDoW - 1) / 7
                                            );
                        }
                        return weekNum > 0 ? weekNum : 1;
                    })(date),
            'y':    date.getFullYear().toString().substr(2),
            'Y':    date.getFullYear(),
            'z':    Math.ceil( ( date - jan1 ) / 86400000 ),
            'Z':    (function(date) {
                        var offsetSeconds =   date.getTimezoneOffset() * 60 * -1;
                        return (offsetSeconds < 0 ? '-' : '') + utils.r_pad(Math.abs(offsetSeconds), 5, 0);
                    })(date)
        };
        // special cases
        // ISO 8601
        //                   YYYY            MM              DD              HH              MM              SS              mmmmmm
        formats.c       =   [formats.Y, '-', formats.m, '-', formats.d, 'T', formats.H, ':', formats.i, ':', formats.s, '.', utils.l_pad(formats.u, 6, 0)].join('');
        // RFC 2822
        //                   Short Day        Date            Short Month     Year            HH              MM              SS              Timezone Offset
        formats.r       =   [formats.D, ', ', formats.j, ' ', formats.M, ' ', formats.Y, ' ', formats.H, ':', formats.i, ':', formats.s, ' ', formats.O].join('');
        
        format  =   format.split('');
        format.reverse();
        var ret     =   [],
            lastChar;
        for (var i = format.length - 1; i >= 0; i--) {
            var f   =   format[i];
            if(lastChar === '%' || f === '%') {
                if(lastChar === '%') {
                    ret.push(f);
                }
                lastChar    =   f;
                continue;
            }
            ret.push(f in formats ? formats[f] : f);
        }
        if(ret.length === 1 && typeof ret[0] === 'boolean') {
            return ret[0];
        }
        return ret.join('');
    };
    
    django.filters.time =   function(date, format) {
        return django.filters.date(date, format || django.filters.date.defaultFormats.time);
    };
    
    django.filters.cut  =   function(str, toCut) {
        var regex   =   new RegExp(toCut, 'g');
        return String(str).replace(regex, '');
    };
    
    django.filters.date.defaultFormats  =   {
        'date':     'N j, Y',
        'time':     'P'
    };
    
    django.filters.ordinal.suffixes = {
        'en-us': ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
    };
    
    django.filters.date.months  =   {
        'en-us': {
            // long
            'l': [
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December'
            ],
            // short
            's': [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            // A.P. style
            'ap': [
                'Jan.',
                'Feb.',
                'March',
                'April',
                'May',
                'June',
                'July',
                'Aug.',
                'Sept.',
                'Oct.',
                'Nov.',
                'Dec.'
            ]
        }
    };
    
    django.filters.date.days        =   {
        'en-us': {
            // long
            'l': [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ],
            // short
            's': [
                'Sun',
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat'
            ]
        }
    };
    
    django.filters.date.meridians    =   {
        'en-us': {
            'ap': {
                'am': 'a.m.',
                'pm': 'p.m.'
            },
            'normal': {
                'am': 'AM',
                'pm': 'PM',
                0: 'midnight',
                12: 'noon'
            }
        }
    };

    var translatable    =   ['months', 'meridians', 'days', 'suffixes'];
    for (var i = translatable.length - 1; i >= 0; i--) {
        var
        group;
        if(translatable[i] === 'suffixes') {
            group   =   django.filters.ordinal[translatable[i]];
        } else {
            group    =   django.filters.date[translatable[i]];
        }
        if(group) {
            if(group['en-us']) {
                group.en  =   group['en-us'];
            }
            if(navigator.language && group[navigator.language]) {
                group.current =   group[navigator.language];
            } else {
                group.current =   group['en-us'];
            }
        }
    }
    
    /*
        Now make these into a chainable object
    */
    
    // http://michaux.ca/articles/class-based-inheritance-in-javascript
    function extend(subclass, superclass) {
        function Dummy(){}
        Dummy.prototype                 =   superclass.prototype;
        subclass.prototype              =   new Dummy();
        subclass.prototype.constructor  =   subclass;
        subclass.superclass             =   superclass;
        subclass.superproto             =   superclass.prototype;
    }
    
    function DjangoFilterString(value) {
        this.value  =   value;
    }
    
    extend(DjangoFilterString, String);
    
    DjangoFilterString.prototype.toString = function() {
        return this.value;
    };

    DjangoFilterString.prototype.valueOf = function() {
        return this.value;
    };

    DjangoFilterString.prototype.apnumber = function() {
        this.value  =   django.filters.apnumber(this.value);
        return this;
    };

    DjangoFilterString.prototype.apnumber_reverse = function() {
        this.value  =   django.filters.apnumber_reverse(this.value);
        return this;
    };

    DjangoFilterString.prototype.cut = function(toCut) {
        this.value  =   django.filters.cut(this.value, toCut);
        return this;
    };

    DjangoFilterString.prototype.date = function(format) {
        var date    =   django.filters.utils.parseDate(this.value);
        if(date.toString() !== this.value) {
            this.value  =   django.filters.date(date, format);
        }
        return this;
    };

    DjangoFilterString.prototype.intcomma = function() {
        this.value  =   django.filters.intcomma(this.value);
        return this;
    };

    DjangoFilterString.prototype.ordinal = function() {
        this.value  =   django.filters.ordinal(this.value);
        return this;
    };

    DjangoFilterString.prototype.slugify = function() {
        this.value  =   django.filters.slugify(this.value);
        return this;
    };

    DjangoFilterString.prototype.time = function(format) {
        var date    =   django.filters.utils.parseDate(this.value);
        if(date.toString() !== this.value) {
            this.value  =   django.filters.time(date, format);
        }
        return this;
    };

    DjangoFilterString.prototype.trim = function() {
        this.value  =   django.filters.utils.trim(this.value);
        return this;
    };
    
    django.filter   =   function(text) {
        this.dfs    =   new DjangoFilterString(text);
        return this.dfs;
    };
    
    django.filter.toString  =   function() {
        return this.dfs.toString();
    };

    django.filter.toSource  =   function() {
        return this.dfs.toSource();
    };
    
    django.filter.valueOf   =   function() {
        return this.dfs.valueOf();
    };
})();
