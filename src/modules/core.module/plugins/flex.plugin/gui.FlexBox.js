/**
 * Wraps a flexbox container element.
 * @param {Element} elm
 */
gui.FlexBox = function FlexBox ( elm ) {
	this._onconstruct ( elm );
};

gui.FlexBox.prototype = {

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[object gui.FlexBox]";
	},

	/**
	 * Flex everything.
	 */
	flex : function () {
		this._flexself ();
		this._flexchildren ();
	},


	// Private ................................................................
	
	/**
	 * Flexbox element.
	 * @type {Element}
	 */
	_element : null,

	/**
	 * Flexed children.
	 * @type {Array<Element>}
	 */
	_children : null,

	/**
	 * Vertical flexbox?
	 * @type {boolean}
	 */
	_vertical : false,

	/**
	 * Constructor.
	 * @param {Element} elm
	 */
	_onconstruct : function ( elm ) {
		this._element = elm;
		this._vertical = gui.CSSPlugin.contains ( this._element, "vertical" );
		this._children = Array.map ( elm.children, function ( child ) {
			return new gui.FlexChild ( child );
		});
	},
	
	/**
	 * Flex the container. Note that container 
	 * may act as the child of another flexbox. 
	 * Horizontal box fits to contaienr via CSS.
	 */
	_flexself : function () {
		var elm = this._element;
		if ( this._vertical ) {
			var given = elm.style.height;
			var above = elm.parentNode;
			var avail = above.offsetHeight;
			var style = elm.style;
			style.height = "auto";
			if ( elm.offsetHeight < avail ) {
				style.height = given || "100%";
			}
		}
	},

	/**
	 * Flex the children.
	 */
	_flexchildren : function () {
		var flexes = this._childflexes ();
		var factor = this._computefactor ( flexes );
		if ( flexes.length ) {
			var unit = 100 / flexes.reduce ( function ( a, b ) {
				return a + b;
			});
			this._children.forEach ( function ( child, i ) {
				if ( flexes [ i ] > 0 ) {
					var percentage = flexes [ i ] * unit * factor;
					child.setoffset ( percentage, this._vertical );
				}
			},this);
		}
	},
	 
	/**
	 * Collect child flexes. Unflexed members enter as 0.
	 * @return {Array<number>}
	 */
	_childflexes : function () {
		return this._children.map ( function ( child ) {
			return child.getflex ();
		},this);
	},

	/**
	 * Get modifier for percentage widths 
	 * accounting for fixed width members.
	 * @param {<Array<number>} flexes
	 * @return {number} Between 0 and 1
	 */
	_computefactor : function ( flexes ) {
		var all, cut, factor = 1;
		if ( flexes.indexOf ( 0 ) >-1 ) {
			all = cut = this._getoffset ();
			this._children.forEach ( function ( child, i ) {
				cut -= flexes [ i ] ? 0 : child.getoffset ( this._vertical );
			}, this );
			factor = cut / all;
		}
		return factor;
	},

	/**
	 * Get width or height of element (depending on flexbox orientation).
	 * @returns {number} Offset in pixels
	 */
	_getoffset : function () {
		var elm = this._element;
		if ( this._vertical ) {
			return elm.offsetHeight;
		} else {
			return elm.offsetWidth;
		}
	}
};