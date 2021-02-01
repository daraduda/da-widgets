(function( $, undefined ) {
    $.da_ui = $.da_ui || {};
    if ( $.da_ui.version ) {
	    return;
    }

    $.extend( $.da_ui, {
	    version: "0.1"
    });
})( jQuery );

(function( $, undefined ) {
    $.widgetda = function( name, base, prototype ) {
        var namespace = name.split( "." )[ 0 ],
            fullName;
        name = name.split( "." )[ 1 ];
        fullName = namespace + "-" + name;

        if ( !prototype ) {
            prototype = base;
            base = $.Widgetda;
        }

        $.expr[ ":" ][ fullName ] = function( elem ) {
            return !!$.data( elem, name );
        };

        $[ namespace ] = $[ namespace ] || {};
        $[ namespace ][ name ] = function( options, element ) {
            if ( arguments.length ) {
                this._createWidget( options, element );
            }
        };

        var basePrototype = new base();
        basePrototype.options = $.extend( true, {}, basePrototype.options );
        $[ namespace ][ name ].prototype = $.extend( true, basePrototype, {
            namespace: namespace,
            widgetName: name,
            widgetEventPrefix: $[ namespace ][ name ].prototype.widgetEventPrefix || name,
            widgetBaseClass: fullName
        }, prototype );
        $.widgetda.bridge( name, $[ namespace ][ name ] );
    };
    $.widgetda.bridge = function( name, object ) {
	    $.fn[ name ] = function( options ) {
            var isMethodCall = typeof options === "string",
                args = Array.prototype.slice.call( arguments, 1 ),
                returnValue = this;
            options = !isMethodCall && args.length ?
                $.extend.apply( null, [ true, options ].concat(args) ):options;

            if ( isMethodCall && options.charAt( 0 ) === "_" ) {
                return returnValue;
            }

            if ( isMethodCall ) {
                this.each(function() {
                    var instance = $.data( this, name ),
                        methodValue = instance && $.isFunction( instance[options] ) ?
                            instance[ options ].apply( instance, args ) :
                            instance;
                    if ( methodValue !== instance && methodValue !== undefined ) {
                        returnValue = methodValue;
                        return false;
                    }
                });
            } else {
                this.each(function() {
                    var instance = $.data( this, name );
                    if ( instance ) {
                        instance.option( options || {} )._init();
                    } else {
                        $.data( this, name, new object( options, this ) );
                    }
                });
            }
            return returnValue;
        }
    };

    $.Widgetda = function( options, element ) {
        if ( arguments.length ) {
            this._createWidget( options, element );
        }
    };
    $.Widgetda.prototype = {
        widgetName: "widget",
        widgetEventPrefix: "",
        options: {
            disabled: false
        },
        _createWidget: function( options, element ) {
            $.data( element, this.widgetName, this );
            this.element = $( element );
            this.options = $.extend( true, {},
                this.options,
                this._getCreateOptions(),
                options );

            var self = this;

            this._create();
            this._trigger( "create" );
            this._init();
        },
        _getCreateOptions: function() {
		    return $.metadata && $.metadata.get( this.element[0] )[ this.widgetName ];
	    },
        _create: function() {},
	    _init: function() {},
        widget: function() {
            return this.element;
        },
        _trigger: function( type, event, data ) {
            var callback = this.options[ type ];
            event = $.Event( event );
            event.type = ( type === this.widgetEventPrefix ?
                type :
                this.widgetEventPrefix + type ).toLowerCase();
            data = data || {};

            if ( event.originalEvent ) {
                for ( var i = $.event.props.length, prop; i; ) {
                    prop = $.event.props[ --i ];
                    event[ prop ] = event.originalEvent[ prop ];
                }
            }

            this.element.trigger( event, data );

            return !( $.isFunction(callback) &&
                callback.call( this.element[0], event, data ) === false ||
                event.isDefaultPrevented() );
        }
    };
})( jQuery );