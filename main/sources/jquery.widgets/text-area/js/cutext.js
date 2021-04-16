/* -------------------------------------
	cutext version 0.9
	нестандартные textarea
	autor: Alexandr Golovko 
	www.xiper.net
----------------------------------------	
*/


(function(jQuery) {    
    jQuery.fn.cuText = function(options) { 		
		var settings = jQuery.extend({
			scrollbarWidth : 18,
			showArrows: true,
			minWidth : 400,
			minHeight: 60,
			resizable : false
        }, options);

        this.filter('textarea').each(function() {											  
			jQuery(this).wrap("<div class='cuTextWrap'><div class='scroll-pane'></div></div>");								
            
			var objParent = jQuery(this).parents('.scroll-pane');
			
			objParent.jScrollPane({scrollbarWidth: settings.scrollbarWidth, showArrows:settings.showArrows});
			
			jQuery(this).autoResize({
				 extraSpace : 0,
				 animateCallback : function(){
					 	objParent.jScrollPane({scrollbarWidth:settings.scrollbarWidth, showArrows:settings.showArrows});
						
						var str= jQuery(this).css('font-size');
						var fontShift=str.replace("px", "") 
					 	objParent[0].scrollBy(parseInt(fontShift) - 4);
					 }
			});
			
			if(settings.resizable){
				var objWrap = jQuery(this).parents('.cuTextWrap');
				
				objWrap.resizable({
				handles: "se",
				minWidth: settings.minWidth,
				minHeight: settings.minHeight,
				start: function(event, ui) {
					objWrap.find('.jScrollPaneContainer').css('display','none');
					},			
				stop: function(event, ui) {
					var objCont = objWrap.find('.jScrollPaneContainer');
				
					objCont.height(objWrap.height());
					objCont.width(objWrap.width());
					objCont.css('display','block');
					objWrap.find('.scroll-pane').jScrollPane({scrollbarWidth:settings.scrollbarWidth, showArrows:settings.showArrows});
				
					}
				});
			}
        });
        
        return this;        
    };
    
})(jQuery);
