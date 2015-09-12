'use strict';

function interpolator( from, to, percentage ) {
	var s, from_val, to_val, diff, target = {}, n, m, type;

	function string_type(str) {
		if ( str[n-2] === 'p' && str[n-1] === 'x') { return 'px'; }
		if ( str[n-2] === 'e' && str[n-1] === 'm') { return 'em'; }
		if ( str[n-1] === '%' ) { return '%'; }
	}

	for ( var name in to ) {
		if ( to.hasOwnProperty( name ) ) {
			s = name;
			to_val = to[name];

			// für alle numerischen Werte
			if ( typeof(to_val) === 'number' ) {
				if (from[name]) { from_val = from[name]; }
				else            { from_val = 0; }
				diff = to_val - from_val;
				target[name] = (diff * percentage) + from_val;
			}

			// now all strings
			if ( typeof(to_val) === 'string' ) {
				n = to_val.length;
				if ( n > 2 ) {
					type = string_type(to_val);
					n  = parseInt(to_val, 10);
					if (from[name]) {
						from_val = from[name];
						m        = parseInt(from_val, 10);
					} else {
						m = 1;
					}
					diff = n - m;
					switch(type) {
						case 'px':
							target[name] = parseInt(diff*percentage + m, 10) + type;
						break;
						case 'em':
							target[name] = (diff*percentage + m).toFixed(2) + type;
						break;
						case '%':
							target[name] = (diff*percentage + m).toFixed(2) + type;
						break;
					}
				} // PIXEL END
			}
		}
	}
	return target;
}


// EXPORTS //

module.exports = interpolator;
