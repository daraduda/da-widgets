(function($) {
  var incriment = 0;

  $.widgetda("da_ui.radioButtons", {
    version: "0.1",
    options: {
      multiple: false,
      column: 1,
    },
    _create: function() {
      var self = this,
        o = self.options,
        el = self.element;

      o.multiple = el.attr("multiple") == "multiple" ? true : false;
      incriment++;
      this.element.css("display", "none");

      this.tmplOptions =
        '<li data-value="%value%" class="%class%">%label%</li>';

      var listdata = el
        .children()
        .map(function () {
          var $this = $(this);
          return self._optionItem($this);
        })
        .get();

      var selectname = el.attr("id");
      if (!selectname) {
        selectname = "da_ui-select-radio-";
        if (o.multiple) {
          selectname += "multi-";
        }
        selectname += incriment + Math.floor(Math.random() * 1000);
      }
      this.lists = this._listsColumn(listdata, selectname);
      this.block_list = $('<div class="da_ui-select-radio-block"></div>');
      for (var ii = 0; ii < this.lists.length; ii++) {
        var list = this.lists[ii];
        $("li", list)
          .click(function () {
            self._selectOption(this, list);
          })
          .bind("mouseenter", function () {
            $(this).addClass("da_ui-state-hover");
          })
          .bind("mouseleave", function () {
            $(this).removeClass("da_ui-state-hover");
          });
        this.block_list.append(list);
      }
      this.block_list.children().insertAfter(el);
    },
    _optionItem: function (elem) {
      if (!elem.val()) {
        return;
      }
      var selected = "",
        recordclass = elem.attr("class") || "";
      if (elem.attr("selected")) {
        recordclass = "da_ui-state-active " + recordclass;
      }
      var optionItem = this.tmplOptions
        .replace("%value%", elem.val())
        .replace("%class%", recordclass)
        .replace("%label%", elem.text());
      return optionItem;
    },
    _listsColumn: function (listdata, selectname) {
      var col_count = this.options.column;
      var div_list = parseInt(listdata.length / col_count),
        mod_list = listdata.length % col_count,
        objects_array = [],
        last = 0,
        start;

      for (var ii = 0; ii < col_count; ii++) {
        start = last;
        last = start + div_list;
        if (ii < mod_list) last++;
        objects_array.push(
          $("<ul></ul>", {
            id: selectname + "-list-" + ii,
            class: this.options.multiple
              ? "da_ui-select-radio-multi-list"
              : "da_ui-select-radio-list",
          })
            .data({
              element: this.element,
            })
            .append(listdata.slice(start, last).join(""))
        );
      }
      if (this.options.multiple) {
        objects_array[0].addClass("da_ui-select-radio-first");
        objects_array[objects_array.length - 1].addClass(
          "da_ui-select-radio-last"
        );
      }
      return objects_array;
    },
    _selectOption: function (opt, list) {
      if (this.options.multiple) {
        return this._selectOptionMultiple(opt);
      }
      $("li", list).removeClass("da_ui-state-active");
      $(opt).addClass("da_ui-state-active");

      this._emptySelected();
      var value = $(opt).attr("data-value");
      this.element
        .find("option[value='" + value + "']")
        .attr("selected", "selected");
    },
    _selectOptionMultiple: function (opt) {
      var value = $(opt).attr("data-value");
      if (!$(opt).hasClass("da_ui-state-active")) {
        $(opt).addClass("da_ui-state-active");
        this.element
          .find("option[value='" + value + "']")
          .attr("selected", "selected");
      } else {
        $(opt).removeClass("da_ui-state-active");
        this.element
          .find("option[value='" + value + "']")
          .removeAttr("selected");
      }
    },
    _emptySelected: function () {
      this.element.find("option:selected").each(function () {
        this.selected = false;
      });
    },
  });
})(jQuery);
