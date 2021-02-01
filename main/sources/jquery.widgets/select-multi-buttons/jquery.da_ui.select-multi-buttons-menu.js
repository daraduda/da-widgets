(function( $ ) {
    var incriment = 0;
    $.widgetda("da_ui.select-multi-buttons-menu", {
        version: "0.1",
        options: {
            select_multi: null,
            html_menu: false,
            speed: 100,
            left:0,
            top:0
        },
        _create: function() {
		    var self = this,
                el = this.element,
                o = this.options;

            this.select_multi = this.options.select_multi;
            incriment++;
            var zindex=(this.select_multi.css("zindex") )?this.select_multi.css("zindex"):10;

            this.tmplOptions='<li data-value="%value%" class="%class%">%label%</li>';
            var listdata=this.select_multi.children().map(
                function(){
                    var $this=$(this);
                    var selected="", recordclass=$this.attr("class") || "";
                    if($this.attr("selected")){
                        recordclass="da_ui-state-active "+recordclass;
                    }
                    return self.tmplOptions.replace("%value%",$this.val()).replace("%class%",recordclass).replace("%label%",$this.text());
                }).get().join("");

            var selectname = el.attr("id");
            if( !selectname ){
                selectname = "da_ui-select-multi-buttons-menu-";
                selectname += incriment+Math.floor(Math.random()*1000);
            }
            this.list=$('<ul></ul>',{
                    'id': selectname +'-list',
                    'class': "da_ui-select-multi-buttons-menu-list"
                })
                .data({
                    "element":this.element,
                    "speed": o.speed
                })
                .append(listdata);

            if( o.html_menu ){
                this.list = o.html_menu( this.list );
                this.list.addClass("da_ui-select-multi-buttons-menu-list");
                $("ul.da_ui-select-multi-buttons-menu-list", this.list).removeClass("da_ui-select-multi-buttons-menu-list");
            }
            this.list.css({
                    "position":"absolute",
                    "max-height":o.maxHeight,
                    "z-index": zindex+1000,
                    "display": "none"
                })
                .insertAfter( this.element );

            $("li", this.list).click(function(event){
                self._selectOption(event, this);
                return false;
            }).bind("mouseenter", function(){
                $(this).addClass("da_ui-state-hover");
            }).bind("mouseleave",function(){
                $(this).removeClass("da_ui-state-hover");
            });

            $("li", this.element).click(function(){
                self.active_li = $(this);
                if( self.list.attr("data-open") == $(this).attr("data-index") && self.list.is(":visible") ){
                    self._close();
                    return false;
                }else if( self.list.is(":visible") ){
                    self._close();
                }
                self.list.attr("data-open", $(this).attr("data-index"));
                self._showMenu();
                return false;
            });
        },
        _showMenu: function(){
            var self = this;
            var pos = self.active_li.position();
            $(".da_ui-select-multi-buttons-menu-list").not(this.list).fadeOut(this.options.speed);
            if( !self.list.is(":visible") ){
                self.list.css({ "top": pos.top+self.options.top+"px", "left": pos.left+self.options.left+"px" });
            }
            this.list.fadeIn(this.options.speed);
            if(!this.documentClickEvent){
                this.documentClickEvent=function(e){
                    if(e){
                        self._close();
                    }
                };
                $(document).click(this.documentClickEvent);
            }
        },
        _close: function(){
            var self=this;
            this.list.stop(true,true).fadeOut(this.options.speed, function(){
                var pos = self.active_li.position();
                $(this).css({ "top": pos.top+self.options.top+"px", "left": pos.left+self.options.left+"px" });
            });
            $(document).unbind("click",this.documentClickEvent);
            this.documentClickEvent=null;
            //$(document).unbind("keydown",this.keyboardNavigation);
        },
        _selectOption: function(event, opt){
            var self = this;
            var value = $( opt ).attr("data-value"),
                elem = this.options.select_multi,
                opt_parent = $(self.active_li),
                select_opt = elem.find("option[value='"+value+"']");
            if( !$( opt ).hasClass("da_ui-state-active") ){
                if( opt_parent.attr("data-value") ){
                    this._clearSelected( opt_parent.attr("data-value") );
                }
                $( opt ).addClass("da_ui-state-active");
                select_opt.attr("selected", "selected");
                var label = select_opt.text();
                opt_parent.attr("data-value", value);
                $("input", opt_parent).attr("value", value);
                $("div.item-text", opt_parent).text( label );
            }else if( opt_parent.attr("data-value") == value ){
                this._clearSelected( value );
            }
        },
        _clearSelected: function( value ){
            var self = this,
                elem = this.options.select_multi,
                opt_parent = $(self.active_li),
                select_opt = elem.find("option[value='"+value+"']"),
                opt = $("li[data-value="+value+"]", this.list);
            opt.removeClass("da_ui-state-active");
            select_opt.removeAttr("selected");
            opt_parent.attr("data-value", "");
            $("input", opt_parent).removeAttr("value");
            $("div.item-text", opt_parent).text( "" );
        }
    });
})( jQuery );