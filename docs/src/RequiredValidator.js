// Generated by CoffeeScript 1.9.3
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  if (!this.Maslosoft) {
    this.Maslosoft = {};
  }

  if (!this.Maslosoft.BinderDev) {
    this.Maslosoft.BinderDev = {};
  }

  this.Maslosoft.BinderDev.RequiredValidator = (function(superClass) {
    extend(RequiredValidator, superClass);

    function RequiredValidator() {
      return RequiredValidator.__super__.constructor.apply(this, arguments);
    }

    RequiredValidator.prototype.isValid = function(value) {
      var valid;
      valid = !!value;
      if (!valid) {
        if (this.label) {
          this.addError("{attribute} is required", {
            attribute: this.label
          });
        } else {
          this.addError("This field is required");
        }
      }
      return valid;
    };

    return RequiredValidator;

  })(this.Maslosoft.Binder.BaseValidator);

}).call(this);
