$(function() {
    $(".test-select-radio[name=test2]").radioButtons({column: 2});

    var inputsForm = $("#lines").find("input,textarea");

    for (var k = 0; k < inputsForm.length; k++) {
        $(inputsForm[k]).watermark($(inputsForm[k]).attr('title'));	
    }
});