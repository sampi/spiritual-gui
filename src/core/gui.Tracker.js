/**
 * # gui.Tracker
 * Comment goes here.
 * @extends {gui.Plugin}
 */
gui.Tracker = gui.Plugin.extend ( "gui.Tracker", {

	/**
	 * Bookkeeping assigned types and handlers.
	 * @type {Map<String,Array<object>}
	 */
	_xxx : null,

	/**
	 * Containing window's gui.signature.
	 * @type {String}
	 */
	_sig : null,

	/**
	 * Construction time.
	 * @param {Spirit} spirit
	 */
	onconstruct : function () {
		this._super.onconstruct ();
		this._sig = this.spirit.window.gui.signature;
		this._xxx = Object.create ( null );
	},

	/**
	 * @todo Toggle type(s).
	 * @param {object} arg
	 * @returns {gui.Tracker}
	 */
	toggle : function ( arg, checks ) {
		console.error ( "@todo SpiritTracker#toggle" );
	},

	/**
	 * Contains handlers for type(s)? Note that handlers might 
	 * assert criterias other than type in order to be invoked.
	 * @param {object} arg
	 * @returns {boolean}
	 */
	contains : function ( arg ) {
		return this._breakdown ( arg ).every ( function ( type ) {
			return this._xxx [ type ];
		}, this );
		
	},

	/**
	 * @todo what? 
	 */
	destruct : function () {
		var type, list;
		this._super.destruct ();
		gui.Object.each ( this._xxx, function ( type, list ) {
			list.slice ( 0 ).forEach ( function ( checks ) {
				this._cleanup ( type, checks );
			}, this );
		}, this );
	},

	/**
	 * Isolated for subclass to overwrite.
	 * @param {String} type
	 * @param {Array<object>} checks
	 */
	_cleanup : function ( type, checks ) {
		if ( this._removechecks ( type, checks )) { 
			// do cleanup here
		}
	},
	
	
	// Private .....................................................

	/**
	 * Can add type of given checks?
	 * @param {String} type
	 * @param {Array<object>} checks
	 * @returns {boolean}
	 */
	_addchecks : function ( type, checks ) {
		var result = false;
		var list = this._xxx [ type ];
		if ( !list ) {
			list = this._xxx [ type ] = [];
			result = true;
		} else {
			result = !this._haschecks ( list, checks );
		}
		if ( result ) {
			list.push ( checks );
		}
		return result;
	},

	/**
	 * Can remove type of given checks?
	 * @param {String} type
	 * @param {Array<object>} checks
	 * @returns {boolean}
	 */
	_removechecks : function ( type, checks ) {
		var result = false;
		var list = this._xxx [ type ];
		if ( list ) {
			var index = this._checksindex ( list, checks );
			if ( index > -1 ) {
				list.remove ( index );
				if ( list.length === 0 ) {
					delete this._xxx [ type ];
				}
				result = true;
			}
		}
		return result;
	},

	/**
	 * Has list for type AND given checks?
	 * @param {String} type
	 * @param {Array<object>} checks 
	 */
	_containschecks : function ( type, checks ) {
		var result = false;
		var list = this._xxx [ type ];
		if ( list ) {
			//result = !this._haschecks ( list, checks );
			result = this._haschecks ( list, checks );
		}
		return result;
	},

	/**
	 * Has checks indexed?
	 * @param {Array<Array<object>>} list
	 * @param {Array<object>} checks
	 * @returns {boolean}
	 */
	_haschecks : function ( list, checks ) {
		var result = false;
		list.every ( function ( a ) {
			if ( a.every ( function ( b, i ) {
				return b === checks [ i ];
			})) {
				result = true;
			}
			return !result;
		});
		return result;
	},

	/**
	 * Get index of checks.
	 * @param {Array<Array<object>>} list
	 * @param {Array<object>} checks
	 * @returns {number}
	 */
	_checksindex : function ( list, checks ) {
		var result = -1;
		list.every ( function ( a, index ) {
			if ( a.every ( function ( b, i ) {
				return b === checks [ i ];
			})) {
				result = index;
			}
			return result === -1;
		});
		return result;
	},

	/**
	 * Resolve single argument into array with one or more entries.
	 * @param {Array<String>|String} arg
	 * @returns {Array<String>}
	 */
	_breakdown : function ( arg ) {
		var result = null;
		switch ( gui.Type.of ( arg )) {
			case "array" :
				result = arg;
				break;
			case "string" :
				result = arg.split ( " " );
				break;
		}
		return result;
	}
});