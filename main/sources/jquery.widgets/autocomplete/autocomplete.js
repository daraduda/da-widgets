$(function() {
    $( "#tags-ajax-json" ).autocomplete({
        source: function(request, response) {
            $.ajax({
                url: "https://secure.geonames.org/searchJSON?q=UA&country=UA&lang=en&maxRows=10&username=slv_yaroslav",
                dataType: "jsonp",
                data: {
                    featureClass: "P",
                    style: "full",
                    maxRows: 12,
                    name_startsWith: request.term
                },
                success: function(data) {
                    response($.map(data.geonames, function(item) {
                        return {
                            label: item.name + (item.adminName1 ? ", " + item.adminName1 : "") + ", " + item.countryName,
                            value: item.name
                        }
                    }));
                }
            });

        }
    });
    $( "#tags-json" ).autocomplete({
        source: [
            { label: "Saint Petersburg City", value: "Saint Petersburg" },
            { label: "Moscow City", value: "Moscow" },
            { label: "Kazan City", value: "Kazan" },
            { label: "Samara City", value: "Samara" },
            { label: "Omsk City", value: "Omsk" },
            { label: "Ufa City", value: "Ufa" },
            { label: "Penza City", value: "Penza" }
        ],
        open: function(event, ui) {
        }
    });
});        