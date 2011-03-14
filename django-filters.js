if(!window['django']) {
	window['django'] = {};
	var django = window['django'];
}

(function(){
	django.intcomma = function( number ) {
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

	django.apnumber = function( number ) {
		number = parseInt( number, 10 );
		switch(number) {
			case 0:
				number = 'zero';
				break;
			case 1:
				number = 'one';
				break;
			case 2:
				number = 'two';
				break;
			case 3:
				number = 'three';
				break;
			case 4:
				number = 'four';
				break;
			case 5:
				number = 'five';
				break;
			case 6:
				number = 'six';
				break;
			case 7:
				number = 'seven';
				break;
			case 8:
				number = 'eight';
				break;
			case 9:
				number = 'nine';
				break;
			default:
				break;
		}
		return number;
	}

	django.apnumber_reverse = function( number ) {
		number = $.trim(number);
		switch(number) {
			case 'zero':
				number = 0;
				break;
			case 'one':
				number = 1;
				break;
			case 'two':
				number = 2;
				break;
			case 'three':
				number = 3;
				break;
			case 'four':
				number = 4;
				break;
			case 'five':
				number = 5;
				break;
			case 'six':
				number = 6;
				break;
			case 'seven':
				number = 7;
				break;
			case 'eight':
				number = 8;
				break;
			case 'nine':
				number = 9;
				break;
			default:
				break;
		}
		number = parseInt( number, 10 );
		return number;
	}
	
	django.slugify = function( str ) {
		str = $.trim(str);
		return str.replace(/[^a-zA-Z0-9-._~]/g, '-').toLowerCase();
	}
	
	django.ordinal = function( number ) {
		var num = parseInt(number, 10);
		if(isNaN(num)) {
			return number;
		}
		number = num;
		var suffixes = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'];
		if($.inArray(number % 100, [11, 12, 13]) > -1) {
			return [number, suffixes[0]].join('');
		}
		return [number, suffixes[number % 10]].join('');
	}
})();