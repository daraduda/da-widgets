/* Copyright (c) 2006 Brandon Aaron (brandon.aaron@gmail.com || http://brandonaaron.net)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 * Thanks to: http://adomas.org/javascript-mouse-wheel/ for some pointers.
 * Thanks to: Mathias Bank(http://www.mathias-bank.de) for a scope bug fix.
 *
 * jQueryLastChangedDate: 2007-12-20 09:02:08 -0600 (Thu, 20 Dec 2007) jQuery
 * jQueryRev: 4265 jQuery
 *
 * Version: 3.0
 * 
 * Requires: jQuery 1.2.2+
 */

(function(jQuery) {

jQuery.event.special.mousewheel = {
	setup: function() {
		var handler = jQuery.event.special.mousewheel.handler;
		
		// Fix pageX, pageY, clientX and clientY for mozilla
		if ( jQuery.browser.mozilla )
			jQuery(this).bind('mousemove.mousewheel', function(event) {
				jQuery.data(this, 'mwcursorposdata', {
					pageX: event.pageX,
					pageY: event.pageY,
					clientX: event.clientX,
					clientY: event.clientY
				});
			});
	
		if ( this.addEventListener )
			this.addEventListener( (jQuery.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = handler;
	},
	
	teardown: function() {
		var handler = jQuery.event.special.mousewheel.handler;
		
		jQuery(this).unbind('mousemove.mousewheel');
		
		if ( this.removeEventListener )
			this.removeEventListener( (jQuery.browser.mozilla ? 'DOMMouseScroll' : 'mousewheel'), handler, false);
		else
			this.onmousewheel = function(){};
		
		jQuery.removeData(this, 'mwcursorposdata');
	},
	
	handler: function(event) {
		var args = Array.prototype.slice.call( arguments, 1 );
		
		event = jQuery.event.fix(event || window.event);
		// Get correct pageX, pageY, clientX and clientY for mozilla
		jQuery.extend( event, jQuery.data(this, 'mwcursorposdata') || {} );
		var delta = 0, returnValue = true;
		
		if ( event.wheelDelta ) delta = event.wheelDelta/120;
		if ( event.detail     ) delta = -event.detail/3;
//		if ( jQuery.browser.opera  ) delta = -event.wheelDelta;
		
		event.data  = event.data || {};
		event.type  = "mousewheel";
		
		// Add delta to the front of the arguments
		args.unshift(delta);
		// Add event to the front of the arguments
		args.unshift(event);

		return jQuery.event.handle.apply(this, args);
	}
};

jQuery.fn.extend({
	mousewheel: function(fn) {
		return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
	},
	
	unmousewheel: function(fn) {
		return this.unbind("mousewheel", fn);
	}
});

})(jQuery);