/**
 * Checks an object for required methods such as onevent, onaction, onbroadcast etc.
 */
gui.Interface = {
		
	/**
	 * Check for implemented interface; throw an exception if not.
	 * @param {object} interfais 
	 * @param {object} object
	 * @returns {boolean}
	 */
	validate : function ( interfais, object ) {
		
		var is = true;
		var expected = interfais.toString ();
		var type = gui.Type.of ( object );
		switch ( type ) {
			case "null" :
			case "string" :
			case "number" :
			case "boolean" :
			case "undefined" :
				throw new Error ( "Expected " + expected + ", got " + type + ": " + object );
			default :
				try {
					var missing = null, t = null;
					is = Object.keys ( interfais ).every ( function ( name ) {
						missing = name; t = gui.Type.of ( interfais [ name ]);
						return gui.Type.of ( object [ name ]) === t;
					});
					if ( !is ) {
						throw new Error ( "Expected " + expected + ". A required " + type + " \"" + missing + "\" is missing" );
					}
				} catch ( exception ) {
					throw new Error ( "Expected " + expected );
				}
				break;
		}
		return is;
	}
};