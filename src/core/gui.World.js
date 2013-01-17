/**
 * Spiritualizing documents by overloading DOM methods.
 */
gui.World = {
	
	/**
	 * True when in JQuery mode. This will be removed when 
	 * iOS supports a mechanism for intercepting innerHTML. 
	 * @type {boolean}
	 */
	jquery : false,

	/**
	 * Tracking success with overloading the innerHTML setter.
	 * @type {Map<String,boolean>}
	 */
	innerhtml : {
		global : false, // Firefox, Opera and Explorer does this on an Element.prototype level
		local : false, // Webkit does this on all *instances* of Element @see {gui.Guide#attach}
		missing : false // Safari on iOS fails completely on must fallback to use JQuery module
	},
	
	/**
	 * Declare "spirit" as a fundamental property of things 
	 * and extend native DOM methods in given window scope.
	 * @param {Window} win
	 */
	descend : function descend ( win ) {

		/*
		var ms = "";
		gui.Object.methods(win.DocumentFragment.prototype).forEach(function(m){
			ms += m + "\n";
		});
		alert(ms);
		*/

		var element = win.Element.prototype;
		if ( gui.Type.isDefined ( element.spirit )) {
			throw new Error ( "Spiritual loaded twice?" );
		} else {		
			/*
			 * TODO: WeakMap<Element,gui.Spirit> in supporting agents
			 */
			element.spirit = null; // defineProperty fails in iOS 5.0
			switch ( win.gui.mode ) {
				case gui.MODE_NATIVE :
				case gui.MODE_OPTIMIZE :
					this.upgrade ( win, gui.UPGRADE );
					break;
				case gui.MODE_JQUERY :
					this._jquery ( win );
					break;
			}
		}
	},

	/**
	 * Upgrade DOM in window.
	 * @param {Window} win
	 * @param {function} upgrade
	 */
	upgrade : function ( win, upgrade ) {
		this._change ( win, upgrade ());
	},


	// PRIVATES ........................................................................
	
	/**
	 * JQuery mode: Confirm loaded JQuery 
	 * and the "jquery" Spiritual module.
	 * @param {Window} win
	 * @returns {boolan}
	 */
	_jquery : function ( win ) {

		var ok = false;
		if (!( ok = gui.Type.isDefined ( win.jQuery ))) {
			throw new Error ( "Spiritual runs in JQuery mode: Expected JQuery to be loaded first" );
		}
		if (!( ok = win.gui.hasModule ( "jquery" ))) {
			throw new Error ( "Spiritual runs in JQuery mode: Expected the \"jquery\" module" );
		}
		return ok;
	},

	/**
	 * Observe the document by extending Element.prototype to 
	 * intercept DOM updates. Firefox ignores extending of 
	 * Element.prototype, we must step down the prototype chain.
	 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=618379
	 * TODO: Add to the bug a comment about Object.prototype
	 * TODO: Extend DocumentFragment
	 * TODO: Extend insertAdjecantHTML
	 * TODO: Support SVG elements (in XHTML)
	 * @param {Window} win
	 */
	_change : function _change ( win, upgrade ) {
		
		var did = [], doc = win.document;
		if ( !this._canchange ( win.Element.prototype, win, upgrade )) {
			if ( !win.HTMLElement || !this._canchange ( win.HTMLElement.prototype, win )) {
				this._tags ().forEach ( function ( tag ) {
					var e = doc.createElement ( tag );
					var p = e.constructor.prototype;
					// alert ( p ); this call throws a BAD_CONVERT_JS
					if ( p !== win.Object.prototype ) { // excluding object and embed tags
						if ( did.indexOf ( p ) === -1 ) {
							this._dochange ( p, win, upgrade );
							did.push ( p ); // some elements share the same prototype
						}
					}
				}, this );
			}
		}
	},

	/**
	 * Firefox has to traverse the constructor of *all* elements.
	 * Object and embed tags excluded because the constructor of 
	 * these elements appear to be identical to Object.prototype.
	 * @returns {Array<String>}
	 */
	_tags : function tags () {

		return ( "a abbr address area article aside audio b base bdi bdo blockquote " +
			"body br button canvas caption cite code col colgroup command datalist dd del " +
			"details device dfn div dl dt em fieldset figcaption figure footer form " +
			"h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen " +
			"label legend li link map menu meta meter nav noscript ol optgroup option " +
			"output p param pre progress q rp rt ruby s samp script section select small " +
			"source span strong style submark summary sup table tbody td textarea tfoot " +
			"th thead time title tr track ul unknown var video wbr" ).split ( " " );
	},

	/**
	 * Can extend given prototype object? If so, do it now.
	 * @param {object} proto
	 * @param {Window} win
	 * @returns {boolean} Success
	 */
	_canchange : function _canchange ( proto, win, upgrade ) {
		
		// attempt overwrite
		var result = false;
		var test = "it appears to work";
		var cache = proto.hasChildNodes;
		proto.hasChildNodes = function () {
			return test;
		};

		// test overwrite and reset back
		var root = win.document.documentElement;
		if ( root.hasChildNodes () === test) {
			proto.hasChildNodes = cache;
			this._dochange ( proto, win, upgrade );
			result = true;
		}

		return result;
	},
	
	/**
	 * Overloading prototype methods and properties. If we cannot get an angle on innerHTML, 
	 * we switch to JQuery mode. This is currently known to happen in Safari on iOS 5.1
	 * TODO: inserAdjecantHTML
	 * @param {object} proto
	 * @param {Window} win
	 */
	_dochange : function _dochange ( proto, win, upgrade ) {

		/*
		 * (old notes) Overloading properties (innerHTML).
		 * TODO: Flag for gui.ready-something to onenter() in correct order.
		 * TODO: Firefox creates 50-something unique functions here
		 * TODO: Test success runtime (not rely on user agent string).
		 */

		switch ( gui.Client.agent ) {
			case "explorer" : // http://msdn.microsoft.com/en-us/library/dd229916(v=vs.85).aspx
				this.innerhtml.global = true;
				break;
			case "gecko" :
			case "opera" : // TODO: Object.defineProperty supported?
				this.innerhtml.global = true;
				break;
			case "webkit" :
				if ( gui.WEBKIT.canpatch ( win )) {
					this.innerhtml.local = true;
				} else {
					this.innerhtml.local = false;
					this.innerhtml.missing = true;
				}
				break;
		}

		var title = win.document.title;
		switch ( win.gui.mode ) {
			case gui.MODE_NATIVE :
				if ( this.innerhtml.missing ) {
					throw new Error ( "Spiritual native mode is not supported on this device." );
				}
				break;
			case gui.MODE_OPTIMIZE :
				if ( this.innerhtml.missing ) {
					win.gui.mode = gui.MODE_JQUERY;
					if ( this._jquery ( win ) && win.gui.debug ) {
						console.debug ( 
							title + ": Spiritual runs in JQuery mode. To keep spirits " +
							"in synch, use JQuery or Spiritual to perform DOM updates."
						);
					}
				} else {
					win.gui.mode = gui.MODE_NATIVE;
					if ( win.gui.debug ) {
						console.debug ( title + ": Spiritual runs in native mode" );
					}
				}
				break;
		}
		
		/*
		 * Overloading methods? Only in native mode.
		 * TODO: insertAdjecantHTML
		 */
		if ( win.gui.mode === gui.MODE_NATIVE ) {
			var root = win.document.documentElement;
			gui.Object.each ( upgrade, function ( name, combo ) {
				this._docombo ( proto, name, combo, root );
			}, this );
		}
	},

	/**
	 * Property setters for Firefox and Opera.
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 * @param {Element} root
	 */
	_docombo : function ( proto, name, combo, root ) {

		if ( this._ismethod ( name )) {
			this._domethod ( proto, name, combo );
		} else {
			switch ( gui.Client.agent ) {
				case "opera" :
				case "gecko" :
					this._doboth ( proto, name, combo, root );
					break;
				case "explorer" :
					this._doie ( proto, name, combo, root );
					break;
				case "webkit" :
					// it's complicated
					break;
			}
		}
	},

	/**
	 * Is method? (non-crashing Firefox version)
	 * @returns {boolean}
	 */
	_ismethod : function ( name ) {

		var is = false;
		switch ( name ) {
			case "appendChild" : 
			case "removeChild" :
			case "insertBefore" :
			case "replaceChild" :
			case "setAttribute" :
			case "removeAttribute" :
				is = true;
				break;
		}
		return is;
	},

	/**
	 * Overload DOM method (x-browser supported).
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 */
	_domethod : function ( proto, name, combo ) {
		var base = proto [ name ];
		proto [ name ] = combo ( function () {
			return base.apply ( this, arguments );
		});
	},

	/**
	 * Overload property setter for Internet Explorer.
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 * @param {Element} root
	 */
	_doie : function ( proto, name, combo, root ) {
		var base = Object.getOwnPropertyDescriptor ( proto, name );
		Object.defineProperty ( proto, name, {
			get: function () {
				return base.get.call ( this );
			},
			set: combo ( function () {
				return base.apply ( this, arguments );
			})
		});
	},

	/**
	 * Overload property setter for Firefox and Opera.
	 * @param {object} proto
	 * @param {String} name
	 * @param {function} combo
	 * @param {Element} root
	 */
	_doboth : function ( proto, name, combo, root ) {
		var base = root.__lookupSetter__ ( name );
		proto.__defineSetter__ ( name, combo ( function () {
			return base.apply ( this, arguments );
		}));
	}
};