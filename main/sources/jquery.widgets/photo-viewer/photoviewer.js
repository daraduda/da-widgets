$(document).ready(function () {
    function formatTitle() {
        return '<div class=\"clear\"></div><div class=\"smile\"><div class=\"smile_text\"><a class=\"f12\" href=\"#\">Smile</a></div></div><div class=\"plus\"><div class=\"plus_text\"><a class=\"f12\" href=\"#\">Like</a></div></div>';
    }
    $("a.photo").fancybox({
        'transitionIn': 'elastic',
        'transitionOut': 'elastic',
        'padding': 10,
        'speedIn': 600,
        'speedOut': 200,
        'titlePosition': 'over',
        'titleFormat': formatTitle,
        'overlayShow': false,
        'onComplete': function () {
            $('#fancybox-content')
                .append('<img id="watermark-inner" src="../core/images/photo_watermark.png" style="position:absolute;right:20px;top:20px;" />');
        }
    });
});