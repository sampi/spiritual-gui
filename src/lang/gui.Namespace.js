/**
 * Experimental namespace concept.
 * @param {Window|WorkerScope}
 * @param {String} ns
 * @param {Object} defs
 */
gui.Namespace = function Namespace ( context, ns, defs ) {
	gui.Namespace.validate ( context, ns, this );
	gui.Object.extend ( this, defs );
	this.$context = context;
	this.$ns = ns;
};

gui.Namespace.prototype = {

	/**
	 * @type {boolean}
	 */
	portals : false,

	/**
	 * Identification.
	 * @returns {String}
	 */
	toString : function () {
		return "[namespace " + this.$ns + "]";
	},


	// Secrets .............................................

	/**
	 * Namespace string.
	 * @type {String}
	 */
	$ns : null,

	/**
	 * @type {Window|WorkerScope}
	 */
	$context : null
};

/**
 * Hm.
 * @param {Window|WorkerScope} context
 * @param {String} objectpath
 * @param {gui.Namespace} namespace
 * @throws {ReferenceError}
 */
gui.Namespace.validate = function ( context, ns, namespace ) {
	gui.Tick.next ( function () {
		if ( gui.Object.lookup ( ns, context ) !== namespace ) {
			throw new ReferenceError ( "The string \"" + ns + "\" must evaluate to a namespace object." );
		}
	}, this );
};