/**
 * Spirit of the key combo listener.
 * <meta content="key" value="Control s" onkey="alert(this)"/>
 */
gui.KeySpirit = gui.Spirit.infuse ( "gui.KeySpirit", {

	/**
	 * Get ready.
	 */
	onready : function () {
		this._super.onready ();
		this._map = Object.create ( null );
		this._setup ();
	},

	/**
	 * Handle key.
	 * @param {gui.Key} key
	 */
	onkey : function ( key ) {
		this._super.onkey ( key );
		console.log ( key.type );
		var map = this._map;
		map [ key.type ] = key.down;
		if ( Object.keys ( map ).every ( function ( type ) {
			//console.log ( type + ": " + map [ type ]);
			return map [ type ] === true;
		})) {
			console.log ( "fis!" );
		}

	},

	// https://github.com/jeresig/jquery.hotkeys/blob/master/jquery.hotkeys.js
	// http://stackoverflow.com/questions/3845009/how-to-handle-ctrl-s-event-on-chrome-and-ie-using-jquery
	// http://stackoverflow.com/questions/11000826/ctrls-preventdefault-in-chrome
	// http://stackoverflow.com/questions/93695/best-cross-browser-method-to-capture-ctrls-with-jquery


	// Private ...........................................
	
	_map : null,

	/**
	 * Parsing the 'value' attribute, setup key listeners.
	 */
	_setup : function () {
		var value = this.att.get ( "value" );
		if ( value ) {
			value.split ( " " ).forEach ( function ( token ) {
				token = token.trim ();
				this.key.addGlobal ( token );
				this._map [ token ] = false;
			}, this );
		}
	}
});