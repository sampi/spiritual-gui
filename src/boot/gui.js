var gui = { // namespace object

	/**
	 * Spiritual version. Hardcoded for now.
	 * TODO: Deprecate or generate buildtime.
	 * @type {String}
	 */
	version : "0.0.4",

	/**
	 * Spirit management mode. 
	 * native: Overloading native DOM methods and setters.
	 * jquery: Overloading JQuery DOM manipulation methods.
	 * optimize: use native if supported, fallback on jquery.
	 */
	MODE_NATIVE : "native",
	MODE_JQUERY : "jquery",
	MODE_OPTIMIZE : "optimize",

	/*
	 * Global broadcasts
	 * TODO : harmonize some naming with action types
	 */
	BROADCAST_KICKSTART : "gui-broadcast-kickstart",
	BROADCAST_DOMCONTENT : "gui-broadcast-document-domcontentloaded",
	BROADCAST_ONLOAD : "gui-broadcast-window-onload",
	BROADCAST_UNLOAD : "gui-broadcast-window-unload",
	BROADCAST_WILL_SPIRITUALIZE : "gui-broadcast-will-spiritualize",
	BROADCAST_DID_SPIRITUALIZE : "gui-broadcast-did-spiritualize",
	BROADCAST_MOUSECLICK  : "gui-broadcast-mouseevent-click",
	BROADCAST_MOUSEMOVE : "gui-broadcast-mouseevent-mousemove",
	BROADCAST_MOUSEDOWN : "gui-broadcast-mouseevent-mousedown",
	BROADCAST_MOUSEUP : "gui-broadcast-mouseevent-mouseup",
	BROADCAST_SCROLL : "gui-broadcast-window-scroll",
	BROADCAST_RESIZE : "gui-broadcast-window-resize",
	BROADCAST_RESIZE_END : "gui-broadcast-window-resize-end",
	BROADCAST_POPSTATE : "gui-broadcast-window-popstate",
	BROADCAST_HASHCHANGE : "gui-broadcast-window-hashchange",
	BROADCAST_LOADING_CHANNELS : "gui-broadcast-loading-channels",
	BROADCAST_CHANNELS_LOADED : "gui-broadcast-channels-loaded",
	BROADCAST_TWEEN : "gui-broadcast-tween",

	/*
	 * Plugin broadcast types
	 * TODO : assign these via module system at some point
	 */
	BROADCAST_ORIENTATIONCHANGE : "gui-broadcast-orientationchange",
	BROADCAST_TOUCHSTART : "gui-broadcast-touchstart",
	BROADCAST_TOUCHEND : "gui-broadcast-touchend",
	BROADCAST_TOUCHCANCEL : "gui-broadcast-touchcancel",
	BROADCAST_TOUCHLEAVE : "gui-broadcast-touchleave",
	BROADCAST_TOUCHMOVE : "gui-broadcast-touchmove",
	BROADCAST_DRAG_START : "gui-broadcast-drag-start",
	BROADCAST_DRAG_END : "gui-broadcast-drag-end",
	BROADCAST_DRAG_DROP : "gui-broadcast-drag-drop",
	BROADCAST_COMMAND : "gui-broadcast-command",
	BROADCAST_OUTPUT : "gui-broadcast-output",
	BROADCAST_INPUT : "gui-broadcast-input",
	BROADCAST_DATA_PUB : "gui-broadcast-data-pub",
	BROADCAST_DATA_SUB : "gui-broadcast-data-sub",
	BROADCAST_SCRIPT_INVOKE : "gui-broadcast-spiritscript-invoke",
	BROADCAST_ATTENTION_ON : "gui-broadcast-attention-on",
	BROADCAST_ATTENTION_OFF : "gui-broadcast-attention-off",
	BROADCAST_ATTENTION_GO : "gui-broadcast-attention-go",

	/*
	 * Global actions
	 */
	ACTION_DOCUMENT_CONSTRUCT : "gui-action-document-construct",
	ACTION_DOCUMENT_READY : "gui-action-document-ready",
	ACTION_DOCUMENT_ONLOAD : "gui-action-document-onload",
	ACTION_DOCUMENT_UNLOAD : "gui-action-document-unload",
	ACTION_DOCUMENT_FIT : "gui-action-document-fit",
	ACTION_DOCUMENT_DONE : "gui-action-document-done",

	/*
	 * Local actions.
	 */
	ACTION_WINDOW_LOADING : "gui-action-window-loading",
	ACTION_WINDOW_LOADED : "gui-action-window-loaded",

	/*
	 * Questionable types (future)
	 */
	ACTION_DRAG_START : "gui-action-drag-start",
	ACTION_COMMAND : "gui-action-command",
	
	/*
	 * Crawler types
	 */
	CRAWLER_ATTACH : "gui-crawler-attach",
	CRAWLER_DETACH : "gui-crawler-detach",
	CRAWLER_DISPOSE : "gui-crawler-dispose",
	CRAWLER_ACTION : "gui-crawler-action",
	CRAWLER_VISIBLE : "gui-crawler-visible",
	CRAWLER_INVISIBLE : "gui-crawler-invisible",

	
	//CRAWLER_APPEARANCE : "gui-crawler-appearance",

	/*
	 * Tick types (timed events)
	 */
	TICK_DESTRUCT_DETACHED : "gui-tick-destruct-detached",
	TICK_SCRIPT_UPDATE : "gui-tick-spiritscript-update", // TODO: move to EDB
	TICK_COLLECT_INPUT : "gui-tick-collect-input",
	TICK_SPIRIT_NULL : "gui-tick-spirit-null",
	TICK_FIT : "gui-tick-fit",

	/**
	 * CSS classnames. Underscore indicates 
	 * that the classname are managed by JS.
	 */
	CLASS_INVISIBLE : "_gui-invisible",
	CLASS_HIDDEN : "_gui-hidden",

	/*
	 * Device orientation.
	 * TODO : Get this out of here
	 * TODO: gui.Observerice or something
	 */
	orientation : 0,
	ORIENTATION_PORTRAIT : 0,
	ORIENTATION_LANDSCAPE : 1
};