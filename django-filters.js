if(!window['django']) {
	window['django'] = {};
	var django = window['django'];
}

if(!django.filters) {
    django.filters  =   {};
}

(function(){
    
    var utils   =   {
        // borrowed from jQuery
        'trim': typeof String.prototype.trim ?  function( text ) {
                            return text == null ? "" : String.prototype.trim.call( text );
                        } : 
                        function( text ) {
                            return text == null ? "" : text.toString().replace(/^\s+/, "").replace(/\s+$/, "");
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
                            while(obj.length < len) {
                                obj =   pad + obj;
                            }
                            return obj;
                        },
    	'r_pad':        function(obj, len, pad) {
                            obj =   obj.toString();
                            pad =   pad.toString();
                            while(obj.length < len) {
                                obj =   obj + pad;
                            }
                            return obj;
                        }
        
    }

	django.filters.intcomma = function( number ) {
		origNumber = number;
		number = parseInt( number, 10 );
		if( isNaN(number) ) {
			return origNumber;
		}
		numString = String( number );
		number = "";
		var loopCount = 0;
		for (var i = numString.length - 1; i >= 0; i--){
			number = ( loopCount % 3 === 2 && i > 0 ? ',' : '' ) + numString[i] + number;
			loopCount++;
		};
		return number;
	}

	django.filters.apnumber = function( number ) {
	    try {
    		number = parseInt( number, 10 );
	    } catch(e) {
	        return number;
	    }
		return django.filters.apnumber.numbers.current[number] || String(number);
	}

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
	django.filters.apnumber.numbers['en']   =   django.filters.apnumber.numbers['en-us'];
	if(navigator.language && django.filters.apnumber.numbers[navigator.language]) {
        django.filters.apnumber.numbers['current']  =   django.filters.apnumber.numbers[navigator.language];
    } else {
        django.filters.apnumber.numbers['current']  =   django.filters.apnumber.numbers['en-us'];
    }

	django.filters.apnumber_reverse = function( number ) {
		number = utils.trim(number);
		for (var i = django.filters.apnumber.numbers.length - 1; i >= 0; i--) {
		    if(number == django.filters.apnumber.numbers[i]) {
		        return i;
		    }
		};
		try {
    		number = parseInt( number, 10 );
		} catch(e) {}
		return number;
	}
	
	django.filters.slugify = function( str ) {
		str = utils.trim(str);
		return str.replace(/[^a-zA-Z0-9-._~]/g, '-').toLowerCase();
	}
	
	django.filters.ordinal = function( number ) {
		var num = parseInt(number, 10);
		if(isNaN(num)) {
			return number;
		}
		number = num;

		var suffixes = {
		    'en-us': ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th']
	    };
	    suffixes['en']  =   suffixes['en-us'];
	    if(navigator.language && suffixes[navigator.language]) {
            suffixes['current'] =   suffixes[navigator.language];
        } else {
            suffixes['current'] =   suffixes['en-us'];
        }
        
		if(utils.inArray(number % 100, [11, 12, 13]) > -1) {
			return [number, suffixes.current[0]].join('');
		}
		return [number, suffixes.current[number % 10]].join('');
	}
})();