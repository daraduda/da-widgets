$(function() {
    $(".test-select").selectMultiButtons({
        html_item: function( name, index, html_data ){
            return $("<span class='number'>"+index+"</span>"+html_data);
        },
        html_menu: function( menu ){
            var html = $("<div class='menu-tests'><div class='t'></div><div class='rep'></div><div class='b'></div></div>");
            $(".rep", html).append( menu );
            return html;
        },
        top_menu: -10,
        left_menu: 20
    });
});