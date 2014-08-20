// Generated by CoffeeScript 1.7.1
(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  this.Maslosoft.Ko.Balin.HtmlValue = (function(_super) {
    __extends(HtmlValue, _super);

    function HtmlValue() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return HtmlValue.__super__.constructor.apply(this, arguments);
    }

    HtmlValue.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      var handler;
      element.setAttribute('contenteditable', true);
      handler = function() {
        var allBindings, elementValue, modelValue;
        modelValue = valueAccessor();
        elementValue = element.innerHTML;
        if (ko.isWriteableObservable(modelValue)) {
          modelValue(elementValue);
        } else {
          allBindings = allBindingsAccessor();
          if (allBindings["_ko_property_writers"] && allBindings["_ko_property_writers"].htmlValue) {
            allBindings["_ko_property_writers"].htmlValue(elementValue);
          }
        }
      };
      ko.utils.registerEventHandler(element, "keyup", handler);
      ko.utils.registerEventHandler(document, "change.content", handler);
      $(document).on("click", handler);
    };

    HtmlValue.prototype.update = function(element, valueAccessor) {
      var value;
      value = this.getValue(valueAccessor) || '';
      if (element.innerHTML !== value) {
        element.innerHTML = value;
      }
    };

    return HtmlValue;

  })(this.Maslosoft.Ko.Balin.Base);

}).call(this);
