$(function() {
    $(".select-radio[name=test]").radioButtons({});
    $(".select-radio[name=test3]").radioButtons({});
    $(".select-radio[name=test2]").radioButtons({column: 2});
});
$(function() {
    $(".second").hide();
    $(".third").hide();
    $(".first ul.da_ui-select-radio-list li").click(function(){
        $(this).parent().parent().prev().attr("src", "../core/images/second.png");
        $(this).parent().hide();
        $(".second").show();
    });
    $(".submit_button").click(function(){
        $(this).parent().prev().prev().attr("src", "../core/images/third.png");
        $(this).parent().hide();
        $(".third").show();
    });
});