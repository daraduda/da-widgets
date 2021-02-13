$(document).ready(function() {
    $("#datepicker").birthdaypicker({
        futureDates: true,
        maxYear: 2020,
        maxAge: 75,
        defaultDate: "10-17-1980"
    });
    
    $('select.styled').customStyle();
});