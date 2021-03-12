(function($) {
    $(document).ready(function () {
        $(".reg-extlogin .extlogin-provider").addClass('colorizable');
        $(".partners .partner").addClass('colorizable');
        $(".colorizable").not('.colorized').hover(
            function () {
                $(this).clone().addClass('colorized').removeClass('colorizable').appendTo($(this));
            },
            function () {
                $(this).find('.colorized').fadeOut(500,function(){$(this).remove();});
            }
        );
    });
})(jQuery);