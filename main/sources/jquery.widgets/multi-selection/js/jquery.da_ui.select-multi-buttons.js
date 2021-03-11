(function( $ ) {
    var incriment=0;
    $.widgetda("da_ui.select-multi-buttons", {
        version: "0.1",
        options: {
            items_cont: 0,
            html_item: false,
            html_menu: false,
            left_menu:0,
            top_menu:0
        },
        _initialization: false,
        _nameItems: [],
        _selectElConstr: function( el ){
            var self = this;
            this.el = el;
            this.value = null;
            this.check = false;
            (function(){
                self.value = self.el.val();
            })();
        },
        _selectObjects: {},
        _selectObjectRender: function(){
            var items_cont = this.options.items_cont,
                name = this.elementName;

            this._nameItems = [];
            this._selectObjects = {};
            for(var ii=0; ii<items_cont; ii++){
                this._nameItems.push( name+"-select-"+ii.toString() );
            }
            for(var ii=0;ii<this.element.children().length; ii++){
                var option = $(this.element.children()[ii]);
                this._selectObjects[option.val()] = option.text();
            }
            //for(var ii=0;ii<this.element.children().length; ii++){
            //    var obj = new this._selectElConstr( $(this.element.children()[ii]) );
            //    var indexArr = $.inArray( obj.value, this._initialization.selected );
            //    if( indexArr != -1 ){ obj.check = true; }
            //    this._selectObjects.push( obj );
            //}
        },
        _create: function() {
            var self=this,
                o=self.options,
                el=self.element;

            incriment++;

            if( o.items_cont == 0 ){
                o.items_cont = el.children().length;
            }
            this._initialization = (el.attr('initialization')?$.parseJSON(el.attr('initialization')):false);
            if( this._initialization ){
                if( this._initialization.selected.length != o.items_cont ){
                    alert( 'Атрибут "initialization" должен иметь длину '+o.items_cont.toString() );
                    return;
                }
            }

            el.css('display', 'none');

            this.elementName = el.attr("name");
            this._selectObjectRender();

            var listdata = [];
            for(var ii=0;ii<this._nameItems.length; ii++){
                listdata.push( self._htmlItem( this._nameItems[ii], ii ) );
            }

            var selectname = el.attr("id");
            if( !selectname ){
                selectname = "da_ui-select-multi-buttons-";
                selectname += incriment+Math.floor(Math.random()*1000);
            }
            this.list = $('<ul></ul>',{
                    'id': selectname+"-list",
                    'class': "da_ui-select-multi-buttons-list"
                })
                .data({
                    "element":this.element
                })
                .append(listdata.join(""));

            $("li", this.list)
                .bind("mouseenter",
                    function(){
                        $(this).addClass("da_ui-state-hover");
                }).bind("mouseleave",function(){
                    $(this).removeClass("da_ui-state-hover");
            });

            this.list.insertAfter(el)
                .selectMultiButtonsMenu({
                    html_menu: this.options.html_menu,
                    select_multi: this.element,
                    left:this.options.left_menu,
                    top:this.options.top_menu
                });
        },
        _htmlItem: function( name, index ){
            var select_val = (this._initialization?this._initialization.selected[index]:false);
            select_val = (select_val==-1?false:select_val);
            var html = '<li data-value="%value%" data-index="%index%" class="%class%"><div class="item-text">%label%</div></li>';
            if( this.options.html_item != false ){
                html = $(html).html( this.options.html_item( name, index, '<div class="item-text">%label%</div>' ) );
            }
            html = $("<div></div>").append( $(html).append( $('<input type="hidden" name="%name%">') ).clone() ).remove()//.html();
            var value = "",
                label = "",
                class_ = "";
            if( select_val ){
                value = select_val;
                label = this._selectObjects[value];
                class_ = "da_ui-state-active";
                this._selectedOption(value);
            }
            if( value != "" ){
                $("input", html).val(value);
            }
            html = html.html();
            html = html.replace("%value%", value)
                       .replace("%name%", name)
                       .replace("%class%", class_)
                       .replace("%index%", index)
                       .replace("%label%", label);
            return html;
        },
        _selectedLi: function( el, value ){
            if( !value ){return el;}
            if( !el.hasClass("da_ui-state-active") ){
                el.addClass("da_ui-state-active");
            }
            var label = this._selectObjects[value];
            el.attr("data-value", value);
            $("input", el).attr("value", value);
            $("div.item-text", el).text( label );
            return el;
        },
        _selectedOption: function( value ){
            var el = this.element;
            $("option[value="+value+"]", el).attr('selected', 'selected');
        }
    });
})( jQuery );