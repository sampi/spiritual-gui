/** 
 * Ticks are used for timed events. 
 * @TODO Global versus local ticks
 * @TODO Tick.push
 * @using gui.Arguments#confirmed
 */
( function using ( confirmed ) {

	/**
	 * @param {String} type
	 */
	gui.Tick = function ( type ) {
		this.type = type;
	};

	gui.Tick.prototype = {

		/**
		 * Tick type.
		 * @type {String}
		 */
		type : null,

		/**
		 * Identification.
		 * @returns {String}
		 */
		toString : function () {
			return "[object gui.Tick]";
		}
	};


	// Static .........................................................................

	/**
	 * Identification.
	 * @returns {String}
	 */
	gui.Tick.toString = function () {
		return "[function gui.Tick]";
	};

	/**
	 * Hello.
	 */
	gui.Tick._global = {
		types : Object.create ( null ),
		handlers : Object.create ( null )
	};

	/**
	 * Hej.
	 */
	gui.Tick._local = Object.create ( null );

	/**
	 * Add handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @param @optional {boolean} one Remove handler after on tick of this type?
	 * @returns {function}
	 */
	gui.Tick.add = confirmed ( "string|array", "object|function", "(string)" ) (
		function ( type, handler, sig ) {
			return this._add ( type, handler, false, sig || gui.$contextid );
		}
	);

	/**
	 * Add auto-removing handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.one = confirmed ( "string|array", "object|function", "(string)" ) (
		function ( type, handler, sig ) {
			return this._add ( type, handler, true, sig || gui.$contextid );
		}
	);

	/**
	 * Schedule action for next available execution stack.
	 * @TODO: deprecate setImmedate polyfix and kove the fix here
	 * @param {function} action
	 * @param @optional {object} thisp
	 */
	gui.Tick.next = function ( action, thisp ) {
		setImmediate ( function () {
			action.call ( thisp );
		});
	};

	/**
	 * Remove handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.remove = function ( type, handler, sig ) {
		return this._remove ( type, handler,  sig || gui.$contextid );
	};

	/**
	 * Start repeated tick of given type.
	 * @param {String} type Tick type
	 * @param {number} time Time in milliseconds
	 * @returns {function}
	 */
	gui.Tick.start = function ( type, time ) {
		console.error ( "@TODO gui.Tick.start" );
	};

	/**
	 * Stop repeated tick of specified type.
	 * @param {String} type Tick type
	 * @returns {function}
	 */
	gui.Tick.stop = function ( type ) {
		console.error ( "@TODO gui.Tick#stop" );
	};

	/**
	 * Dispatch tick now or in specified time. Omit time to 
	 * dispatch now. Zero resolves to next available thread.
	 * @param {String} type
	 * @param @optional {number} time
	 * @returns {gui.Tick}
	 */
	gui.Tick.dispatch = function ( type, time, sig ) {
		return this._dispatch ( type, time, sig || gui.$contextid );
	};

	/**
	 * Add handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.addGlobal = confirmed ( "string|array", "object|function" ) (
		function ( type, handler ) {
			return this._add ( type, handler, false, null );
		}
	);

	/**
	 * Add self-removing handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.oneGlobal = function ( type, handler ) {
		return this.add ( type, handler, true, null );
	};

	/**
	 * Remove handler for tick.
	 * @param {object} type String or array of strings
	 * @param {object} handler
	 * @returns {function}
	 */
	gui.Tick.removeGlobal = function ( type, handler ) {
		return this._remove ( type, handler, null );
	};

	/**
	 * Dispatch tick now or in specified time. Omit time to 
	 * dispatch now. Zero resolves to next available thread.
	 * @param {String} type
	 * @param @optional {number} time
	 * @returns {gui.Tick}
	 */
	gui.Tick.dispatchGlobal = function ( type, time ) {
		return this._dispatch ( type, time, null );
	};


	// Private static .....................................................

	/**
	 * Hello.
	 */
	gui.Tick._add = function ( type, handler, one, sig ) {
		if ( gui.Type.isArray ( type )) {
			type.forEach ( function ( t ) {
				this._add ( t, handler, one, sig );
			}, this );
		} else {
			var list, index;
			var map = sig ? this._local [ sig ] : this._global;
			if ( !map ) {
				map = this._local [ sig ] = {
					types : Object.create ( null ),
					handlers : Object.create ( null )
				};
			}
			list = map.handlers [ type ];
			if ( !list ) {
				list = map.handlers [ type ] = [];
			}
			index = list.indexOf ( handler );
			if ( index < 0 ) {
				index = list.push ( handler ) - 1;
			}
			/*
			 * @TODO
			 * Adding a property to an array will 
			 * make it slower in Firefox. Fit it!
			 */
			if ( one ) {
				list._one = list._one || Object.create ( null );
				list._one [ index ] = true;
			}
		}
		return this;
	};

	/**
	 * Hello.
	 */
	gui.Tick._remove = function ( type, handler, sig ) {
		if ( gui.Type.isArray ( type )) {
			type.forEach ( function ( t ) {
				this.remove ( t, handler, sig );
			}, this );
		} else {
			var map = sig ? this._local [ sig] : this._global;
			var list = map.handlers [ type ];
			if ( list ) {
				var index = list.indexOf ( handler );
				if ( gui.Array.remove ( list, index ) === 0 ) {
					delete map.handlers [ type ];
				}
			}
		}
		return this;
	};

	/**
	 * Hofmeister remix.
	 * @TODO refactor to default to zero somehow...
	 */
	gui.Tick._dispatch = function ( type, time, sig ) {
		var map = sig ? this._local [ sig ] : this._global;
		var types = map.types;
		var tick = new gui.Tick ( type );
		if ( !gui.Type.isDefined ( time )) {	
			var list = map.handlers [ type ];
			if ( list ) {
				list.slice ().forEach ( function ( handler, i ) {
					//try {
						handler.ontick ( tick );
					// } catch ( exception ) { // @TODO figure out how destructed spirits should behave while we loop
					// 	if ( exception.message !== gui.Spirit.DENIAL ) {
					// 		throw new Error ( exception.message );
					// 	}
					// }
					// if ( list._one && list._one [ i ]) {
					// 	delete list._one [ i ];
					// }
				});
			}
		} else if ( !types [ type ]) {
			var that = this, id = null;
			if ( time === 0 ) {
				id = setImmediate ( function () {
					that._dispatch ( type, undefined, sig );
					delete types [ type ];
				});
			} else {
				id = setTimeout ( function () {
					that._dispatch ( type, undefined, sig );
					delete types [ type ];
				}, time );
			}	
			types [ type ] = id;
		}
		return tick;
	};

}( gui.Arguments.confirmed ));