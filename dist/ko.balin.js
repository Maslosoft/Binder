(function() {
  "use strict";
  var ModelProxyHandler, TreeDnd, TreeDrag, TreeEvents, TreeNodeCache, TreeNodeFinder, TreeNodeRenderer, ValidationManager, assert, error, initMap, isPlainObject, log, warn,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  assert = function(expr) {
    if (!console) {
      return;
    }
    return console.assert.apply(console, arguments);
  };

  log = function(expr) {
    if (!console) {
      return;
    }
    return console.log.apply(console, arguments);
  };

  warn = function(expr, element) {
    if (element == null) {
      element = null;
    }
    if (!console) {
      return;
    }
    return console.warn.apply(console, arguments);
  };

  error = function(expr, element) {
    if (element == null) {
      element = null;
    }
    if (!console) {
      return;
    }
    return console.error.apply(console, arguments);
  };

  if (!Array.isArray) {
    Array.isArray = function(arg) {
      return Object.prototype.toString.call(arg) === '[object Array]';
    };
  }

  isPlainObject = function(obj) {
    return !!obj && typeof obj === 'object' && obj.constructor === Object;
  };

  if (!Object.keys) {
    Object.keys = (function() {
      'use strict';
      var dontEnums, dontEnumsLength, hasDontEnumBug, hasOwnProperty;
      hasOwnProperty = Object.prototype.hasOwnProperty;
      hasDontEnumBug = !{
        toString: null
      }.propertyIsEnumerable('toString');
      dontEnums = ['toString', 'toLocaleString', 'valueOf', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable', 'constructor'];
      dontEnumsLength = dontEnums.length;
      return function(obj) {
        var i, prop, result;
        if (typeof obj !== 'object' && (typeof obj !== 'function' || obj === null)) {
          throw new TypeError('Object.keys called on non-object');
        }
        result = [];
        prop = void 0;
        i = void 0;
        for (prop in obj) {
          prop = prop;
          if (hasOwnProperty.call(obj, prop)) {
            result.push(prop);
          }
        }
        if (hasDontEnumBug) {
          i = 0;
          while (i < dontEnumsLength) {
            if (hasOwnProperty.call(obj, dontEnums[i])) {
              result.push(dontEnums[i]);
            }
            i++;
          }
        }
        return result;
      };
    })();
  }

  "use strict";

  if (!this.Maslosoft) {
    this.Maslosoft = {};
  }

  if (!this.Maslosoft.Ko) {
    this.Maslosoft.Ko = {};
  }

  if (!this.Maslosoft.Ko.Balin) {
    this.Maslosoft.Ko.Balin = {};
  }

  if (!this.Maslosoft.Ko.Balin.Helpers) {
    this.Maslosoft.Ko.Balin.Helpers = {};
  }

  this.Maslosoft.Ko.debounce = function(func, wait, immediate) {
    var timeout;
    timeout = void 0;
    return function() {
      var args, callNow, context, later;
      context = this;
      args = arguments;
      later = function() {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };
      callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait || 200);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };

  this.Maslosoft.Ko.Balin.register = function(name, handler) {
    var name2;
    name2 = false;
    if (name.match(/[A-Z]/)) {
      name2 = name.toLowerCase();
    }
    if (handler.writable) {
      if (ko.expressionRewriting && ko.expressionRewriting.twoWayBindings) {
        ko.expressionRewriting.twoWayBindings[name] = true;
        if (name2) {
          ko.expressionRewriting.twoWayBindings[name2] = true;
        }
      }
    }
    ko.bindingHandlers[name] = handler;
    if (name2) {
      return ko.bindingHandlers[name2] = handler;
    }
  };

  this.Maslosoft.Ko.Balin.registerDefaults = function(handlers) {
    var config, index, value, _results, _results1;
    if (handlers == null) {
      handlers = null;
    }
    config = {
      active: Maslosoft.Ko.Balin.Active,
      action: Maslosoft.Ko.Balin.WidgetAction,
      activity: Maslosoft.Ko.Balin.WidgetActivity,
      asset: Maslosoft.Ko.Balin.Asset,
      data: Maslosoft.Ko.Balin.Data,
      dateFormatter: Maslosoft.Ko.Balin.DateFormatter,
      datePicker: Maslosoft.Ko.Balin.DatePicker,
      datePickerPickaDate: Maslosoft.Ko.Balin.PickaDate,
      dateTimeFormatter: Maslosoft.Ko.Balin.DateTimeFormatter,
      disabled: Maslosoft.Ko.Balin.Disabled,
      enumCssClassFormatter: Maslosoft.Ko.Balin.EnumCssClassFormatter,
      enumFormatter: Maslosoft.Ko.Balin.EnumFormatter,
      fancytree: Maslosoft.Ko.Balin.Fancytree,
      fileSizeFormatter: Maslosoft.Ko.Balin.FileSizeFormatter,
      hidden: Maslosoft.Ko.Balin.Hidden,
      href: Maslosoft.Ko.Balin.Href,
      htmlTree: Maslosoft.Ko.Balin.HtmlTree,
      htmlValue: Maslosoft.Ko.Balin.HtmlValue,
      icon: Maslosoft.Ko.Balin.Icon,
      log: Maslosoft.Ko.Balin.Log,
      model: Maslosoft.Ko.Balin.DataModel,
      src: Maslosoft.Ko.Balin.Src,
      textValue: Maslosoft.Ko.Balin.TextValue,
      textValueHlJs: Maslosoft.Ko.Balin.TextValueHLJS,
      tooltip: Maslosoft.Ko.Balin.Tooltip,
      timeAgoFormatter: Maslosoft.Ko.Balin.TimeAgoFormatter,
      timeFormatter: Maslosoft.Ko.Balin.TimeFormatter,
      timePicker: Maslosoft.Ko.Balin.TimePicker,
      selected: Maslosoft.Ko.Balin.Selected,
      validator: Maslosoft.Ko.Balin.Validator,
      videoPlaylist: Maslosoft.Ko.Balin.VideoPlaylist,
      videoThumb: Maslosoft.Ko.Balin.VideoThumb
    };
    if (handlers !== null) {
      _results = [];
      for (index in handlers) {
        value = handlers[index];
        _results.push(Maslosoft.Ko.Balin.register(value, new config[value]));
      }
      return _results;
    } else {
      _results1 = [];
      for (index in config) {
        value = config[index];
        _results1.push(Maslosoft.Ko.Balin.register(index, new value));
      }
      return _results1;
    }
  };

  this.Maslosoft.Ko.Balin.registerEvents = function(handlers) {
    var config, index, value, _results, _results1;
    if (handlers == null) {
      handlers = null;
    }
    config = {
      'dblclick': 'dblclick',
      'mousedown': 'mousedown',
      'mouseup': 'mouseup',
      'mouseover': 'mouseover',
      'mouseout': 'mouseout'
    };
    if (handlers !== null) {
      _results = [];
      for (index in handlers) {
        value = handlers[index];
        _results.push(Maslosoft.Ko.Balin.makeEventHandlerShortcut(value));
      }
      return _results;
    } else {
      _results1 = [];
      for (index in config) {
        value = config[index];
        _results1.push(Maslosoft.Ko.Balin.makeEventHandlerShortcut(value));
      }
      return _results1;
    }
  };

  this.Maslosoft.Ko.Balin.makeEventHandlerShortcut = function(eventName) {
    ko.bindingHandlers[eventName] = {
      init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var newValueAccessor;
        newValueAccessor = function() {
          var result;
          result = {};
          result[eventName] = valueAccessor();
          return result;
        };
        return ko.bindingHandlers["event"]["init"].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
      }
    };
  };

  this.Maslosoft.Ko.Balin.Base = (function() {
    Base.prototype.writable = true;

    Base.prototype.options = {};

    function Base(options) {
      var name, value;
      if (options == null) {
        options = {};
      }
      this.getValue = __bind(this.getValue, this);
      this.options = {};
      for (name in options) {
        value = options[name];
        this.options[name] = value;
      }
    }

    Base.prototype.getValue = function(valueAccessor, defaults) {
      var value;
      if (defaults == null) {
        defaults = '';
      }
      if (typeof valueAccessor === 'function') {
        value = ko.unwrap(valueAccessor());
      } else {
        value = ko.unwrap(valueAccessor);
      }
      if (this.options.valueField) {
        if (this.options.ec5) {
          value = value[this.options.valueField];
        } else {
          value = value[this.options.valueField]();
        }
      }
      if (typeof value === 'undefined') {
        return defaults;
      }
      return value;
    };

    return Base;

  })();

  this.Maslosoft.Ko.Balin.Options = (function() {
    Options.prototype.valueField = null;

    Options.prototype.ec5 = null;

    Options.prototype.afterUpdate = null;

    function Options(values) {
      var index, value;
      if (values == null) {
        values = {};
      }
      for (index in values) {
        value = values[index];
        this[index] = value;
      }
      if (this.ec5 === null) {
        this.ec5 = !!ko.track;
      }
      if (this.afterUpdate === null) {
        this.afterUpdate = function(element, value) {};
      }
    }

    return Options;

  })();

  this.Maslosoft.Ko.Balin.CssOptions = (function(_super) {
    __extends(CssOptions, _super);

    function CssOptions() {
      return CssOptions.__super__.constructor.apply(this, arguments);
    }

    CssOptions.prototype.className = 'active';

    return CssOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.DateOptions = (function(_super) {
    __extends(DateOptions, _super);

    function DateOptions() {
      return DateOptions.__super__.constructor.apply(this, arguments);
    }

    DateOptions.prototype.lang = 'en';

    DateOptions.prototype.sourceFormat = 'unix';

    DateOptions.prototype.displayFormat = 'YYYY-MM-DD';

    return DateOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.DateTimeOptions = (function(_super) {
    __extends(DateTimeOptions, _super);

    function DateTimeOptions() {
      return DateTimeOptions.__super__.constructor.apply(this, arguments);
    }

    DateTimeOptions.prototype.lang = 'en';

    DateTimeOptions.prototype.sourceFormat = 'unix';

    DateTimeOptions.prototype.displayFormat = 'YYYY-MM-DD hh:mm';

    return DateTimeOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.TimeAgoOptions = (function(_super) {
    __extends(TimeAgoOptions, _super);

    function TimeAgoOptions() {
      return TimeAgoOptions.__super__.constructor.apply(this, arguments);
    }

    TimeAgoOptions.prototype.lang = 'en';

    TimeAgoOptions.prototype.sourceFormat = 'unix';

    TimeAgoOptions.prototype.displayFormat = 'hh:mm';

    return TimeAgoOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.TimeOptions = (function(_super) {
    __extends(TimeOptions, _super);

    function TimeOptions() {
      return TimeOptions.__super__.constructor.apply(this, arguments);
    }

    TimeOptions.prototype.lang = 'en';

    TimeOptions.prototype.sourceFormat = 'unix';

    TimeOptions.prototype.displayFormat = 'hh:mm';

    return TimeOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.ValidatorOptions = (function(_super) {
    __extends(ValidatorOptions, _super);

    function ValidatorOptions() {
      return ValidatorOptions.__super__.constructor.apply(this, arguments);
    }

    ValidatorOptions.prototype.classField = '_class';

    ValidatorOptions.prototype.parentSelector = '.form-group';

    ValidatorOptions.prototype.inputError = 'error';

    ValidatorOptions.prototype.parentError = 'has-error';

    ValidatorOptions.prototype.inputWarning = 'warning';

    ValidatorOptions.prototype.parentWarning = 'has-warning';

    ValidatorOptions.prototype.inputSuccess = 'success';

    ValidatorOptions.prototype.parentSuccess = 'has-success';

    ValidatorOptions.prototype.errorMessages = '.error-messages';

    ValidatorOptions.prototype.warningMessages = '.warning-messages';

    return ValidatorOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.BaseValidator = (function() {
    BaseValidator.prototype.label = '';

    BaseValidator.prototype.model = null;

    BaseValidator.prototype.messages = [];

    BaseValidator.prototype.rawMessages = [];

    BaseValidator.prototype.warningMessages = [];

    BaseValidator.prototype.rawWarningMessages = [];

    function BaseValidator(config) {
      var index, value;
      this.reset();
      for (index in config) {
        value = config[index];
        this[index] = null;
        this[index] = value;
      }
    }

    BaseValidator.prototype.reset = function() {
      this.messages = new Array;
      this.rawMessages = new Object;
      this.warningMessages = new Array;
      return this.rawWarningMessages = new Object;
    };

    BaseValidator.prototype.isValid = function() {
      throw new Error('Validator must implement `isValid` method');
    };

    BaseValidator.prototype.getErrors = function() {
      return this.messages;
    };

    BaseValidator.prototype.getWarnings = function() {
      return this.warningMessages;
    };

    BaseValidator.prototype.addError = function(errorMessage, params) {
      var name, rawMessage, value, _ref;
      rawMessage = errorMessage;
      errorMessage = errorMessage.replace("{attribute}", this.label);
      for (name in this) {
        value = this[name];
        errorMessage = errorMessage.replace("{" + name + "}", value);
      }
      for (name in params) {
        value = params[name];
        errorMessage = errorMessage.replace("{" + name + "}", value);
      }
      _ref = this.model;
      for (name in _ref) {
        value = _ref[name];
        errorMessage = errorMessage.replace("{" + name + "}", value);
      }
      if (!this.rawMessages[rawMessage]) {
        this.messages.push(errorMessage);
        return this.rawMessages[rawMessage] = true;
      }
    };

    BaseValidator.prototype.addWarning = function(warningMessage, params) {
      var name, rawMessage, value, _ref;
      rawMessage = warningMessage;
      warningMessage = warningMessage.replace("{attribute}", this.label);
      for (name in this) {
        value = this[name];
        warningMessage = warningMessage.replace("{" + name + "}", value);
      }
      for (name in params) {
        value = params[name];
        warningMessage = warningMessage.replace("{" + name + "}", value);
      }
      _ref = this.model;
      for (name in _ref) {
        value = _ref[name];
        warningMessage = warningMessage.replace("{" + name + "}", value);
      }
      if (!this.rawWarningMessages[rawMessage]) {
        this.warningMessages.push(warningMessage);
        return this.rawWarningMessages[rawMessage] = true;
      }
    };

    return BaseValidator;

  })();

  this.Maslosoft.Ko.Balin.CssClass = (function(_super) {
    __extends(CssClass, _super);

    function CssClass() {
      this.update = __bind(this.update, this);
      return CssClass.__super__.constructor.apply(this, arguments);
    }

    CssClass.prototype.writable = false;

    CssClass.prototype.update = function(element, valueAccessor) {
      var value;
      value = this.getValue(valueAccessor);
      if (!!value) {
        ko.utils.toggleDomNodeCssClass(element, this.options.className, true);
      } else {
        ko.utils.toggleDomNodeCssClass(element, this.options.className, false);
      }
    };

    return CssClass;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.MomentFormatter = (function(_super) {
    __extends(MomentFormatter, _super);

    function MomentFormatter() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return MomentFormatter.__super__.constructor.apply(this, arguments);
    }

    MomentFormatter.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      moment.locale(this.options.lang);
    };

    MomentFormatter.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value;
      value = this.getValue(valueAccessor);
      element.innerHTML = moment[this.options.sourceFormat](value).format(this.options.displayFormat);
    };

    return MomentFormatter;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Picker = (function(_super) {
    __extends(Picker, _super);

    function Picker() {
      return Picker.__super__.constructor.apply(this, arguments);
    }

    return Picker;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Video = (function(_super) {
    var adapters, options;

    __extends(Video, _super);

    function Video() {
      this.setThumb = __bind(this.setThumb, this);
      this.isVideoUrl = __bind(this.isVideoUrl, this);
      return Video.__super__.constructor.apply(this, arguments);
    }

    options = null;

    adapters = null;

    jQuery(document).ready(function() {
      options = new Maslosoft.Playlist.Options;
      return adapters = options.adapters;
    });

    Video.prototype.isVideoUrl = function(url) {
      var adapter, _i, _len;
      for (_i = 0, _len = adapters.length; _i < _len; _i++) {
        adapter = adapters[_i];
        if (adapter.match(url)) {
          return adapter;
        }
      }
      return false;
    };

    Video.prototype.setThumb = function(url, element) {
      var ad, adapter, thumbCallback;
      if (adapter = this.isVideoUrl(url)) {
        thumbCallback = function(src) {
          if (element.tagName.toLowerCase() === 'img') {
            return element.src = src;
          } else {
            return jQuery(element).css('background-image', "url('" + src + "')");
          }
        };
        console.log(url);
        ad = new adapter;
        ad.setUrl(url);
        return ad.setThumb(thumbCallback);
      }
    };

    return Video;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.WidgetUrl = (function(_super) {
    __extends(WidgetUrl, _super);

    function WidgetUrl() {
      this.setRel = __bind(this.setRel, this);
      this.createUrl = __bind(this.createUrl, this);
      return WidgetUrl.__super__.constructor.apply(this, arguments);
    }

    WidgetUrl.prototype.getData = function(element, valueAccessor, allBindings, bindingName) {
      var bindingParams, data, src;
      src = this.getValue(valueAccessor);
      data = {};
      data.id = allBindings.get('widgetId') || src.id;
      if (allBindings.get('widget')) {
        data.id = allBindings.get('widget').id;
      }
      data[bindingName] = allBindings.get(bindingName) || src[bindingName];
      bindingParams = allBindings.get('params');
      if (typeof bindingParams === void 0) {
        data.params = src.params;
      } else {
        data.params = bindingParams;
      }
      console.log(data.params);
      data.params = this.getValue(data.params);
      console.log(data.params);
      if (typeof src === 'string') {
        data[bindingName] = src;
      }
      return data;
    };

    WidgetUrl.prototype.createUrl = function(widgetId, action, params, terminator) {
      var args, href, name, value;
      args = [];
      console.log(typeof params);
      if (typeof params === 'string' || typeof params === 'number') {
        if (params !== "" || typeof params === 'number') {
          args.push("" + params);
        }
      } else {
        for (name in params) {
          value = params[name];
          name = encodeURIComponent("" + name);
          value = encodeURIComponent("" + value);
          args.push("" + name + ":" + value);
        }
      }
      href = "" + terminator + widgetId + "." + action;
      console.log(args);
      if (args.length === 0) {
        return href;
      } else {
        args = args.join(',', args);
        return "" + href + "=" + args;
      }
    };

    WidgetUrl.prototype.setRel = function(element) {
      var hasRel, rel, relValue, rels, _i, _len;
      hasRel = false;
      rels = [];
      rel = element.getAttribute('rel');
      if (rel) {
        rels = rel.split(' ');
        for (_i = 0, _len = rels.length; _i < _len; _i++) {
          relValue = rels[_i];
          if (relValue === 'virtual') {
            hasRel = true;
          }
        }
      }
      if (!hasRel) {
        rels.push('virtual');
      }
      return element.setAttribute('rel', rels.join(' '));
    };

    return WidgetUrl;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Active = (function(_super) {
    __extends(Active, _super);

    function Active(options) {
      Active.__super__.constructor.call(this, new Maslosoft.Ko.Balin.CssOptions({
        className: 'active'
      }));
    }

    return Active;

  })(this.Maslosoft.Ko.Balin.CssClass);

  this.Maslosoft.Ko.Balin.Asset = (function(_super) {
    __extends(Asset, _super);

    function Asset() {
      this.update = __bind(this.update, this);
      return Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype.update = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var $element, date, height, model, proportional, sec, src, url, width;
      $element = $(element);
      width = allBindings.get('w' || allBindings.get('width' || null));
      height = allBindings.get('h' || allBindings.get('height' || null));
      proportional = allBindings.get('p' || allBindings.get('proportional' || null));
      model = this.getValue(valueAccessor);
      if (model.updateDate) {
        date = model.updateDate;
        sec = date.sec;
      }
      url = model.url;
      src = [];
      src.push(url);
      if (width) {
        src.push("w/" + width);
      }
      if (height) {
        src.push("h/" + height);
      }
      if (proportional === false) {
        src.push("p/0");
      }
      if (sec) {
        src.push(sec);
      }
      src = src.join('/');
      if ($element.attr("src") !== src) {
        $element.attr("src", src);
      }
    };

    return Asset;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Data = (function(_super) {
    __extends(Data, _super);

    function Data() {
      return Data.__super__.constructor.apply(this, arguments);
    }

    Data.prototype.getNamespacedHandler = function(binding) {
      return {
        update: (function(_this) {
          return function(element, valueAccessor) {
            var value, _ref;
            value = _this.getValue(valueAccessor);
            if ((_ref = typeof value) !== 'string' && _ref !== 'number') {
              value = JSON.stringify(value);
            }
            return element.setAttribute('data-' + binding, value);
          };
        })(this)
      };
    };

    return Data;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.DataModel = (function(_super) {
    __extends(DataModel, _super);

    function DataModel() {
      this.update = __bind(this.update, this);
      return DataModel.__super__.constructor.apply(this, arguments);
    }

    DataModel.prototype.update = function(element, valueAccessor, allBindings) {
      var field, fields, model, modelStub, _i, _len, _results;
      model = this.getValue(valueAccessor);
      fields = allBindings.get("fields") || null;
      if (fields === null) {
        this.bindModel(element, model);
        return;
      }
      modelStub = {};
      _results = [];
      for (_i = 0, _len = fields.length; _i < _len; _i++) {
        field = fields[_i];
        if (typeof model[field] === 'undefined') {
          warn("Model field `" + field + "` is undefined on element:", element);
        } else {
          modelStub[field] = model[field];
        }
        _results.push(this.bindModel(element, modelStub));
      }
      return _results;
    };

    DataModel.prototype.bindModel = function(element, model) {
      var modelString, _ref;
      if ((_ref = typeof value) !== 'string' && _ref !== 'number') {
        modelString = JSON.stringify(model);
      }
      return element.setAttribute('data-model', modelString);
    };

    return DataModel;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.DateFormatter = (function(_super) {
    __extends(DateFormatter, _super);

    function DateFormatter(options) {
      DateFormatter.__super__.constructor.call(this, new Maslosoft.Ko.Balin.DateOptions(options));
    }

    return DateFormatter;

  })(this.Maslosoft.Ko.Balin.MomentFormatter);


  /*
  Date picker
   */

  this.Maslosoft.Ko.Balin.DatePicker = (function(_super) {
    __extends(DatePicker, _super);

    function DatePicker(options) {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      this.getModelValue = __bind(this.getModelValue, this);
      this.getDisplayValue = __bind(this.getDisplayValue, this);
      this.updateModel = __bind(this.updateModel, this);
      DatePicker.__super__.constructor.call(this, new Maslosoft.Ko.Balin.DateOptions(options));
    }

    DatePicker.prototype.getData = function(valueAccessor) {
      var value;
      value = this.getValue(valueAccessor) || [];
      if (value.data) {
        return value.data;
      }
      return value;
    };

    DatePicker.prototype.getOptions = function(allBindingsAccessor) {
      var config, name, options, value;
      options = {
        lang: this.options.lang,
        sourceFormat: this.options.sourceFormat,
        displayFormat: this.options.displayFormat,
        format: this.options.displayFormat.toLowerCase(),
        forceParse: false,
        todayHighlight: true,
        showOnFocus: false
      };
      config = allBindingsAccessor.get('dateOptions') || [];
      if (config) {
        for (name in config) {
          value = config[name];
          if (name === 'data') {
            continue;
          }
          if (name === 'template') {
            continue;
          }
          if (name === 'format') {
            options.displayFormat = value.toUpperCase();
          }
          options[name] = value;
        }
      }
      return options;
    };

    DatePicker.prototype.updateModel = function(element, valueAccessor, allBindings) {
      var elementValue, modelValue, options;
      options = this.getOptions(allBindings);
      modelValue = this.getData(valueAccessor);
      elementValue = this.getModelValue(element.value, options);
      if (modelValue !== elementValue) {
        if (valueAccessor().data) {
          return ko.expressionRewriting.writeValueToProperty(ko.unwrap(valueAccessor()).data, allBindings, 'datePicker.data', elementValue);
        } else {
          return ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue);
        }
      }
    };

    DatePicker.prototype.getDisplayValue = function(value, options) {
      var inputValue;
      if (options.sourceFormat === 'unix') {
        inputValue = moment.unix(value).format(options.displayFormat);
      } else {
        inputValue = moment(value, options.sourceFormat).format(options.displayFormat);
      }
      return inputValue;
    };

    DatePicker.prototype.getModelValue = function(value, options) {
      var modelValue;
      if (options.sourceFormat === 'unix') {
        modelValue = moment(value, options.displayFormat).unix();
      } else {
        modelValue = moment(value, options.displayFormat).format(options.sourceFormat);
      }
      return modelValue;
    };

    DatePicker.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var addon, input, isOpen, options, template, trigger;
      options = this.getOptions(allBindingsAccessor);
      element.value = this.getDisplayValue(this.getData(valueAccessor), options);
      input = jQuery(element);
      if (options.template) {
        template = options.template;
      } else {
        template = '<div class="input-group-addon">\n	<a class="picker-trigger-link" style="cursor: pointer;">\n		<i class="glyphicon glyphicon-calendar"></i>\n	</a>\n</div>';
      }
      addon = jQuery(template);
      addon.insertAfter(input);
      trigger = addon.find('a.picker-trigger-link');
      input.datepicker(options);
      input.on('changeDate', (function(_this) {
        return function(e) {
          return false;
        };
      })(this));
      input.on('change', (function(_this) {
        return function(e) {
          var parsedDate;
          parsedDate = Date.parse(element.value);
          if (parsedDate && !e.isTrigger) {
            element.value = _this.getDisplayValue(Math.round(parsedDate.getTime() / 1000), options);
            _this.updateModel(element, valueAccessor, allBindingsAccessor);
            input.datepicker('update');
            return true;
          }
          return false;
        };
      })(this));
      isOpen = false;
      input.on('show', (function(_this) {
        return function(e) {
          return isOpen = true;
        };
      })(this));
      input.on('hide', (function(_this) {
        return function(e) {
          return isOpen = false;
        };
      })(this));
      trigger.on('mousedown', function(e) {
        if (isOpen) {
          input.datepicker('hide');
        } else {
          input.datepicker('show');
        }
        e.stopPropagation();
        e.preventDefault();
      });
    };

    DatePicker.prototype.update = function(element, valueAccessor, allBindingsAccessor) {
      var options, value;
      if (valueAccessor().data) {
        ko.utils.setTextContent(element, valueAccessor().data);
      } else {
        ko.utils.setTextContent(element, valueAccessor());
      }
      options = this.getOptions(allBindingsAccessor);
      value = this.getDisplayValue(this.getData(valueAccessor), options);
      if (element.value !== value) {
        return element.value = value;
      }
    };

    return DatePicker;

  })(this.Maslosoft.Ko.Balin.Picker);


  /*
  One-way date/time formatter
   */

  this.Maslosoft.Ko.Balin.DateTimeFormatter = (function(_super) {
    __extends(DateTimeFormatter, _super);

    function DateTimeFormatter(options) {
      DateTimeFormatter.__super__.constructor.call(this, new Maslosoft.Ko.Balin.DateTimeOptions(options));
    }

    return DateTimeFormatter;

  })(this.Maslosoft.Ko.Balin.MomentFormatter);

  this.Maslosoft.Ko.Balin.Disabled = (function(_super) {
    __extends(Disabled, _super);

    function Disabled(options) {
      Disabled.__super__.constructor.call(this, new Maslosoft.Ko.Balin.CssOptions({
        className: 'disabled'
      }));
    }

    return Disabled;

  })(this.Maslosoft.Ko.Balin.CssClass);

  this.Maslosoft.Ko.Balin.EnumCssClassFormatter = (function(_super) {
    __extends(EnumCssClassFormatter, _super);

    function EnumCssClassFormatter() {
      this.update = __bind(this.update, this);
      return EnumCssClassFormatter.__super__.constructor.apply(this, arguments);
    }

    EnumCssClassFormatter.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var config, name, re, _i, _len, _ref;
      config = this.getValue(valueAccessor);
      _ref = config.values;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        name = _ref[_i];
        re = new RegExp("(?:^|\\s)" + name + "(?!\\S)", 'g');
        element.className = element.className.replace(re, '');
      }
      element.className += ' ' + config.values[config.data];
    };

    return EnumCssClassFormatter;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.EnumFormatter = (function(_super) {
    __extends(EnumFormatter, _super);

    function EnumFormatter() {
      this.update = __bind(this.update, this);
      return EnumFormatter.__super__.constructor.apply(this, arguments);
    }

    EnumFormatter.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var config;
      config = this.getValue(valueAccessor);
      element.innerHTML = config.values[config.data];
    };

    return EnumFormatter;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Fancytree = (function(_super) {
    __extends(Fancytree, _super);

    function Fancytree() {
      this.update = __bind(this.update, this);
      this.handle = __bind(this.handle, this);
      this.init = __bind(this.init, this);
      return Fancytree.__super__.constructor.apply(this, arguments);
    }

    Fancytree.prototype.tree = null;

    Fancytree.prototype.element = null;

    Fancytree.prototype.getData = function(valueAccessor) {
      var value;
      value = this.getValue(valueAccessor) || [];
      if (value.data) {
        return value.data;
      }
      return value;
    };

    Fancytree.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      var dnd, drag, events, folderIcon, nodeIcon, nodeRenderer, options, renderer, tree, treeEvents;
      tree = this.getData(valueAccessor);
      options = valueAccessor().options || {};
      events = this.getValue(valueAccessor).on || false;
      options.toggleEffect = false;
      options.source = tree.children;
      options.extensions = [];
      treeEvents = new TreeEvents(tree, events, options);
      dnd = valueAccessor().dnd || false;
      drag = valueAccessor().drag || false;
      if (dnd && drag) {
        throw new Error('Cannot use both `dnd` and `drag`');
      }
      if (dnd) {
        options.autoScroll = false;
        options.extensions.push('dnd');
        options.dnd = new TreeDnd(tree, element, treeEvents);
      }
      if (drag) {
        options.autoScroll = false;
        options.extensions.push('dnd');
        options.dnd = new TreeDrag(tree, element);
      }
      nodeIcon = valueAccessor().nodeIcon || false;
      folderIcon = valueAccessor().folderIcon || false;
      nodeRenderer = valueAccessor().nodeRenderer || false;
      if (folderIcon && !nodeIcon) {
        warn("Option `folderIcon` require also `nodeIcon` or it will not work at all");
      }
      if (nodeIcon || nodeRenderer) {
        if (nodeIcon) {
          options.icon = false;
        }
        renderer = new TreeNodeRenderer(tree, options, nodeIcon, folderIcon);
        if (nodeRenderer) {
          renderer.setRenderer(new nodeRenderer(tree, options));
        }
        options.renderNode = renderer.render;
      }
      return jQuery(element).fancytree(options);
    };

    Fancytree.prototype.handle = function(element, valueAccessor, allBindingsAccessor) {
      var config, handler;
      config = this.getValue(valueAccessor);
      element = jQuery(element);
      handler = (function(_this) {
        return function() {
          if (!element.find('.ui-fancytree').length) {
            return;
          }
          element.fancytree('option', 'source', _this.getData(valueAccessor).children);
          if (config.autoExpand) {
            element.fancytree('getRootNode').visit(function(node) {
              return node.setExpanded(true);
            });
          }
          return element.focus();
        };
      })(this);
      return setTimeout(handler, 0);
    };

    Fancytree.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      return this.handle(element, valueAccessor, allBindingsAccessor);
    };

    return Fancytree;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.FileSizeFormatter = (function(_super) {
    __extends(FileSizeFormatter, _super);

    function FileSizeFormatter() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return FileSizeFormatter.__super__.constructor.apply(this, arguments);
    }

    FileSizeFormatter.prototype.units = {
      binary: ["kiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
      decimal: ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    };

    FileSizeFormatter.prototype.binary = true;

    FileSizeFormatter.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel) {};

    FileSizeFormatter.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var binary, decimal, format, step, value;
      value = this.getValue(valueAccessor) || 0;
      binary = this.binary;
      decimal = !this.binary;
      if (binary) {
        step = 1024;
      }
      if (decimal) {
        step = 1000;
      }
      format = (function(_this) {
        return function(bytes) {
          var i, units;
          bytes = parseInt(bytes);
          if (bytes < step) {
            return bytes + ' B';
          }
          i = -1;
          if (binary) {
            units = _this.units.binary;
          }
          if (decimal) {
            units = _this.units.decimal;
          }
          while (true) {
            bytes = bytes / step;
            i++;
            if (!(bytes > step)) {
              break;
            }
          }
          if (units[i]) {
            return Math.max(bytes, 0.1).toFixed(1) + ' ' + units[i];
          } else {
            return Math.max(bytes, 0.1).toFixed(1) + (" ~*" + (i * step) + " * " + step + " B");
          }
        };
      })(this);
      return element.innerHTML = format(value);
    };

    return FileSizeFormatter;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.GMap = (function(_super) {
    __extends(GMap, _super);

    function GMap() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return GMap.__super__.constructor.apply(this, arguments);
    }

    GMap.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel) {};

    GMap.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value;
      return value = this.getValue(valueAccessor);
    };

    return GMap;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Hidden = (function(_super) {
    __extends(Hidden, _super);

    function Hidden() {
      this.update = __bind(this.update, this);
      return Hidden.__super__.constructor.apply(this, arguments);
    }

    Hidden.prototype.update = function(element, valueAccessor) {
      var value;
      value = !this.getValue(valueAccessor);
      return ko.bindingHandlers.visible.update(element, function() {
        return value;
      });
    };

    return Hidden;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Href = (function(_super) {
    __extends(Href, _super);

    function Href() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return Href.__super__.constructor.apply(this, arguments);
    }

    Href.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      var stopPropagation;
      if (!element.href) {
        element.setAttribute('href', '');
      }
      if (element.tagName.toLowerCase() !== 'a') {
        console.warn('href binding should be used only on `a` tags');
      }
      stopPropagation = allBindingsAccessor.get('stopPropagation') || false;
      if (stopPropagation) {
        return ko.utils.registerEventHandler(element, "click", function(e) {
          return e.stopPropagation();
        });
      }
    };

    Href.prototype.update = function(element, valueAccessor, allBindings) {
      var href, target;
      href = this.getValue(valueAccessor);
      target = allBindings.get('target') || '';
      if (element.href !== href) {
        element.href = href;
      }
      if (element.target !== target) {
        return element.target = target;
      }
    };

    return Href;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.HtmlTree = (function(_super) {
    __extends(HtmlTree, _super);

    function HtmlTree() {
      this.update = __bind(this.update, this);
      return HtmlTree.__super__.constructor.apply(this, arguments);
    }

    HtmlTree.drawNode = function(data) {
      var child, childWrapper, node, title, _i, _len, _ref;
      title = document.createElement('li');
      title.innerHTML = data.title;
      if (data.children && data.children.length > 0) {
        childWrapper = document.createElement('ul');
        _ref = data.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          node = _ref[_i];
          child = HtmlTree.drawNode(node);
          childWrapper.appendChild(child);
        }
        title.appendChild(childWrapper);
      }
      return title;
    };

    HtmlTree.prototype.getData = function(valueAccessor) {
      var value;
      value = this.getValue(valueAccessor) || [];
      if (value.data) {
        return this.getValue(value.data) || [];
      }
      return value;
    };

    HtmlTree.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var data, handler;
      data = this.getValue(valueAccessor);
      warn("HtmlTree is experimental, do not use");
      handler = (function(_this) {
        return function() {
          var nodes;
          nodes = HtmlTree.drawNode(data);
          element.innerHTML = '';
          return element.appendChild(nodes);
        };
      })(this);
      return setTimeout(handler, 0);
    };

    return HtmlTree;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.HtmlValue = (function(_super) {
    var idCounter;

    __extends(HtmlValue, _super);

    idCounter = 0;

    function HtmlValue(options) {
      if (options == null) {
        options = {};
      }
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      HtmlValue.__super__.constructor.call(this, options);
      if (ko.bindingHandlers.sortable && ko.bindingHandlers.sortable.options) {
        ko.bindingHandlers.sortable.options.cancel = ':input,button,[contenteditable]';
      }
    }

    HtmlValue.prototype.getElementValue = function(element) {
      return element.innerHTML;
    };

    HtmlValue.prototype.setElementValue = function(element, value) {
      return element.innerHTML = value;
    };

    HtmlValue.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      var deferHandler, handler;
      element.setAttribute('contenteditable', true);
      if (!element.id) {
        element.id = "Maslosoft-Ko-Balin-HtmlValue-" + (idCounter++);
      }
      handler = (function(_this) {
        return function(e) {
          var accessor, elementValue, modelValue;
          if (!element) {
            return;
          }
          element = document.getElementById(element.id);
          if (!element) {
            return;
          }
          accessor = valueAccessor();
          modelValue = _this.getValue(valueAccessor);
          elementValue = _this.getElementValue(element);
          if (ko.isWriteableObservable(accessor)) {
            if (modelValue !== elementValue) {
              return accessor(elementValue);
            }
          }
        };
      })(this);
      deferHandler = (function(_this) {
        return function(e) {
          return setTimeout(handler, 0);
        };
      })(this);
      ko.utils.registerEventHandler(element, "keyup, input", handler);
      ko.utils.registerEventHandler(document, "mouseup", deferHandler);
    };

    HtmlValue.prototype.update = function(element, valueAccessor, allBindings) {
      var value;
      value = this.getValue(valueAccessor);
      if (this.getElementValue(element) !== value) {
        this.setElementValue(element, value);
      }
    };

    return HtmlValue;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Icon = (function(_super) {
    __extends(Icon, _super);

    function Icon() {
      this.update = __bind(this.update, this);
      return Icon.__super__.constructor.apply(this, arguments);
    }

    Icon.prototype.update = function(element, valueAccessor, allBindings) {
      var $element, defaultSize, fixedSize, iconField, isImage, model, regex, size, src;
      $element = $(element);
      model = this.getValue(valueAccessor);
      iconField = allBindings.get("iconField") || 'icon';
      if (!model) {
        if (console) {
          console.warn('Binding value for `icon` binding not defined, skipping. Element:');
          console.warn(element);
          console.warn((new Error).stack);
        }
        return;
      }
      src = model[iconField];
      if (typeof model.iconSize === 'undefined') {
        defaultSize = 16;
      } else {
        defaultSize = model.iconSize;
      }
      size = allBindings.get("iconSize") || defaultSize;
      regex = new RegExp("/" + defaultSize + "/", "g");
      if (typeof model.isImage === 'undefined') {
        isImage = true;
      } else {
        isImage = model.isImage;
      }
      if (isImage) {
        if (!src.match(new RegExp("/$"))) {
          src = src + '/';
        }
        if (src.match(new RegExp("/w/", "g"))) {
          src = src.replace(regex, "/" + size + "/");
        } else {
          src = src + ("w/" + size + "/h/" + size + "/p/0/");
        }
        if (model.updateDate) {
          src = src + model.updateDate.sec;
        }
      } else {
        fixedSize = 16;
        if (size > 16) {
          fixedSize = 32;
        }
        if (size > 32) {
          fixedSize = 48;
        }
        if (size > 48) {
          fixedSize = 512;
        }
        src = src.replace(regex, "/" + fixedSize + "/");
      }
      if ($element.attr("src") !== src) {
        $element.attr("src", src);
      }
      $element.css({
        width: "" + size + "px",
        height: 'auto',
        maxWidth: '100%'
      });
    };

    return Icon;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Log = (function(_super) {
    __extends(Log, _super);

    function Log() {
      this.init = __bind(this.init, this);
      this.update = __bind(this.update, this);
      return Log.__super__.constructor.apply(this, arguments);
    }

    Log.prototype.update = function(element, valueAccessor, allBindings) {
      return console.log(this.getValue(valueAccessor), element);
    };

    Log.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      return console.log(this.getValue(valueAccessor), element);
    };

    return Log;

  })(this.Maslosoft.Ko.Balin.Base);


  /*
  Date picker
  NOTE: Not recommended, as Pick A Date is not maintanted
   */

  this.Maslosoft.Ko.Balin.PickaDate = (function(_super) {
    __extends(PickaDate, _super);

    function PickaDate(options) {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      this.getModelValue = __bind(this.getModelValue, this);
      this.getDisplayValue = __bind(this.getDisplayValue, this);
      this.updateModel = __bind(this.updateModel, this);
      PickaDate.__super__.constructor.call(this, new Maslosoft.Ko.Balin.DateOptions(options));
    }

    PickaDate.prototype.updateModel = function(element, valueAccessor, allBindings) {
      var elementValue, modelValue, val;
      modelValue = this.getValue(valueAccessor);
      elementValue = this.getModelValue(element.value);
      if (ko.isWriteableObservable(valueAccessor) || true) {
        if (modelValue !== elementValue) {
          ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue);
          return val = elementValue;
        }
      } else {

      }
    };

    PickaDate.prototype.getDisplayValue = function(value) {
      var inputValue;
      if (this.options.sourceFormat === 'unix') {
        inputValue = moment.unix(value).format(this.options.displayFormat);
      } else {
        inputValue = moment(value, this.options.sourceFormat).format(this.options.displayFormat);
      }
      return inputValue;
    };

    PickaDate.prototype.getModelValue = function(value) {
      var modelValue;
      if (this.options.sourceFormat === 'unix') {
        modelValue = moment(value, this.options.displayFormat).unix();
      } else {
        modelValue = moment(value, this.options.displayFormat).format(this.options.sourceFormat);
      }
      return modelValue;
    };

    PickaDate.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var $inputDate, events, inputValue, options, picker, pickerElement, pickerWrapper, template, textInput;
      inputValue = this.getDisplayValue(this.getValue(valueAccessor));
      textInput = jQuery(element);
      textInput.val(inputValue);
      if (this.options.template) {
        template = this.options.template;
      } else {
        template = '<div class="input-group-addon">\n	<a class="picker-trigger-link" style="cursor: pointer;">\n		<i class="glyphicon glyphicon-calendar"></i>\n	</a>\n</div>';
      }
      pickerWrapper = jQuery(template);
      pickerWrapper.insertAfter(textInput);
      pickerElement = pickerWrapper.find('a.picker-trigger-link');
      options = {
        format: this.options.displayFormat.toLowerCase(),
        selectMonths: true,
        selectYears: true
      };
      $inputDate = pickerElement.pickadate(options);
      picker = $inputDate.pickadate('picker');
      picker.on('set', (function(_this) {
        return function() {
          textInput.val(picker.get('value'));
          _this.updateModel(element, valueAccessor, allBindingsAccessor);
        };
      })(this));
      events = {};
      events.change = (function(_this) {
        return function() {
          var parsedDate;
          parsedDate = Date.parse(element.value);
          if (parsedDate) {
            picker.set('select', [parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()]);
            _this.updateModel(element, valueAccessor, allBindingsAccessor);
          }
        };
      })(this);
      events.keyup = function(e) {
        if (e.which === 86 && e.ctrlKey) {
          events.change();
        }
      };
      events.mouseup = events.change;
      events.focus = (function(_this) {
        return function() {
          picker.open(false);
        };
      })(this);
      events.blur = (function(_this) {
        return function(e) {
          if (e.relatedTarget) {
            return;
          }
          picker.close();
          _this.updateModel(element, valueAccessor, allBindingsAccessor);
        };
      })(this);
      textInput.on(events);
      pickerElement.on('click', function(e) {
        var isOpen, root;
        root = jQuery(picker.$root[0]);
        isOpen = jQuery(root.children()[0]).height() > 0;
        if (isOpen) {
          picker.close();
        } else {
          picker.open(false);
        }
        e.stopPropagation();
        e.preventDefault();
      });
    };

    PickaDate.prototype.update = function(element, valueAccessor) {
      var value;
      ko.utils.setTextContent(element, valueAccessor());
      value = this.getDisplayValue(this.getValue(valueAccessor));
      if (element.value !== value) {
        return element.value = value;
      }
    };

    return PickaDate;

  })(this.Maslosoft.Ko.Balin.Picker);

  this.Maslosoft.Ko.Balin.Selected = (function(_super) {
    __extends(Selected, _super);

    function Selected(options) {
      Selected.__super__.constructor.call(this, new Maslosoft.Ko.Balin.CssOptions({
        className: 'selected'
      }));
    }

    return Selected;

  })(this.Maslosoft.Ko.Balin.CssClass);

  this.Maslosoft.Ko.Balin.Src = (function(_super) {
    __extends(Src, _super);

    function Src() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return Src.__super__.constructor.apply(this, arguments);
    }

    Src.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {};

    Src.prototype.update = function(element, valueAccessor) {
      var src;
      src = this.getValue(valueAccessor);
      if (element.src !== src) {
        return element.src = src;
      }
    };

    return Src;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.TextValue = (function(_super) {
    __extends(TextValue, _super);

    function TextValue() {
      return TextValue.__super__.constructor.apply(this, arguments);
    }

    TextValue.prototype.getElementValue = function(element) {
      return element.textContent || element.innerText || "";
    };

    TextValue.prototype.setElementValue = function(element, value) {
      if (typeof element.textContent !== 'undefined') {
        element.textContent = value;
      }
      if (typeof element.innerText !== 'undefined') {
        return element.innerText = value;
      }
    };

    return TextValue;

  })(this.Maslosoft.Ko.Balin.HtmlValue);

  this.Maslosoft.Ko.Balin.TextValueHLJS = (function(_super) {
    __extends(TextValueHLJS, _super);

    function TextValueHLJS() {
      return TextValueHLJS.__super__.constructor.apply(this, arguments);
    }

    TextValueHLJS.prototype.getElementValue = function(element) {
      return element.textContent || element.innerText || "";
    };

    TextValueHLJS.prototype.setElementValue = function(element, value) {
      if (typeof element.textContent !== 'undefined') {
        element.textContent = value;
        if (hljs) {
          hljs.highlightBlock(element);
        }
      }
      if (typeof element.innerText !== 'undefined') {
        element.innerText = value;
        if (hljs) {
          return hljs.highlightBlock(element);
        }
      }
    };

    return TextValueHLJS;

  })(this.Maslosoft.Ko.Balin.HtmlValue);

  this.Maslosoft.Ko.Balin.TimeAgoFormatter = (function(_super) {
    __extends(TimeAgoFormatter, _super);

    function TimeAgoFormatter(options) {
      this.update = __bind(this.update, this);
      TimeAgoFormatter.__super__.constructor.call(this, new Maslosoft.Ko.Balin.TimeAgoOptions(options));
    }

    TimeAgoFormatter.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value;
      value = this.getValue(valueAccessor);
      element.innerHTML = moment[this.options.sourceFormat](value).fromNow();
    };

    return TimeAgoFormatter;

  })(this.Maslosoft.Ko.Balin.MomentFormatter);

  this.Maslosoft.Ko.Balin.TimeFormatter = (function(_super) {
    __extends(TimeFormatter, _super);

    function TimeFormatter(options) {
      TimeFormatter.__super__.constructor.call(this, new Maslosoft.Ko.Balin.TimeOptions(options));
    }

    return TimeFormatter;

  })(this.Maslosoft.Ko.Balin.MomentFormatter);


  /*
  Time picker
   */

  this.Maslosoft.Ko.Balin.TimePicker = (function(_super) {
    __extends(TimePicker, _super);

    function TimePicker() {
      return TimePicker.__super__.constructor.apply(this, arguments);
    }

    return TimePicker;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Tooltip = (function(_super) {
    __extends(Tooltip, _super);

    function Tooltip() {
      this.update = __bind(this.update, this);
      return Tooltip.__super__.constructor.apply(this, arguments);
    }

    Tooltip.prototype.update = function(element, valueAccessor) {
      var title;
      title = this.getValue(valueAccessor);
      $(element).attr("title", title);
      $(element).attr("data-original-title", title);
      $(element).attr("rel", "tooltip");
    };

    return Tooltip;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Tree = (function(_super) {
    __extends(Tree, _super);

    function Tree() {
      this.update = __bind(this.update, this);
      return Tree.__super__.constructor.apply(this, arguments);
    }

    Tree.prototype.update = function(element, valueAccessor) {};

    return Tree;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Validator = (function(_super) {
    var idCounter;

    __extends(Validator, _super);

    idCounter = 0;

    function Validator(options) {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      Validator.__super__.constructor.call(this, new Maslosoft.Ko.Balin.ValidatorOptions());
    }

    Validator.prototype.getElementValue = function(element) {
      if (element.tagName.toLowerCase() === 'input') {
        return element.value;
      }
      if (element.tagName.toLowerCase() === 'textarea') {
        return element.value;
      }
      return element.textContent || element.innerText || "";
    };

    Validator.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      var cfg, classField, className, config, configuration, handler, initialVal, manager, name, proto, validators, _i, _len;
      configuration = this.getValue(valueAccessor);
      validators = new Array;
      classField = this.options.classField;
      if (configuration.constructor === Array) {
        cfg = configuration;
      } else {
        cfg = [configuration];
      }
      for (_i = 0, _len = cfg.length; _i < _len; _i++) {
        config = cfg[_i];
        if (!config[classField]) {
          error("Parameter `" + classField + "` must be defined for validator on element:", element);
          continue;
        }
        if (typeof config[classField] !== 'function') {
          error("Parameter `" + classField + "` must be validator compatible class, binding defined on element:", element);
          continue;
        }
        proto = config[classField].prototype;
        if (typeof proto.isValid !== 'function' || typeof proto.getErrors !== 'function' || typeof proto.reset !== 'function') {
          if (typeof config[classField].prototype.constructor === 'function') {
            name = config[classField].prototype.constructor.name;
          } else {
            name = config[classField].toString();
          }
          error("Parameter `" + classField + "` (of type " + name + ") must be validator compatible class, binding defined on element:", element);
          continue;
        }
        className = config[classField];
        delete config[classField];
        validators.push(new className(config));
      }
      manager = new ValidationManager(validators, this.options);
      if (!element.id) {
        element.id = "Maslosoft-Ko-Balin-Validator-" + (idCounter++);
      }
      initialVal = this.getElementValue(element);
      handler = (function(_this) {
        return function(e) {
          var elementValue;
          if (!element) {
            return;
          }
          element = document.getElementById(element.id);
          if (!element) {
            return;
          }
          elementValue = _this.getElementValue(element);
          if (initialVal !== elementValue) {
            initialVal = elementValue;
            return manager.validate(element, elementValue);
          }
        };
      })(this);
      ko.utils.registerEventHandler(element, "keyup, input", handler);
      return ko.utils.registerEventHandler(document, "mouseup", handler);
    };

    Validator.prototype.update = function(element, valueAccessor, allBindings) {};

    return Validator;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.VideoPlaylist = (function(_super) {
    __extends(VideoPlaylist, _super);

    function VideoPlaylist() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return VideoPlaylist.__super__.constructor.apply(this, arguments);
    }

    VideoPlaylist.prototype.initVideos = null;

    VideoPlaylist.prototype.getData = function(valueAccessor) {
      var value;
      value = this.getValue(valueAccessor) || [];
      if (value.data) {
        return value.data;
      }
      return value;
    };

    VideoPlaylist.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {};

    VideoPlaylist.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var data, html, options, title, titleField, url, urlField, video, _i, _len;
      data = this.getData(valueAccessor);
      options = this.getValue(valueAccessor || {});
      urlField = options.urlField || 'url';
      titleField = options.urlField || 'title';
      html = [];
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        video = data[_i];
        url = video[urlField];
        title = video[titleField];
        if (this.isVideoUrl(url)) {
          html.push("<a href='" + url + "'>" + title + "</a>");
        }
      }
      element.innerHTML = html.join("\n");
      if (html.length) {
        ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', true);
        return new Maslosoft.Playlist(element);
      } else {
        return ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', false);
      }
    };

    return VideoPlaylist;

  })(this.Maslosoft.Ko.Balin.Video);

  this.Maslosoft.Ko.Balin.VideoThumb = (function(_super) {
    __extends(VideoThumb, _super);

    function VideoThumb() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return VideoThumb.__super__.constructor.apply(this, arguments);
    }

    VideoThumb.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {};

    VideoThumb.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var url;
      url = this.getValue(valueAccessor);
      return this.setThumb(url, element);
    };

    return VideoThumb;

  })(this.Maslosoft.Ko.Balin.Video);

  this.Maslosoft.Ko.Balin.WidgetAction = (function(_super) {
    __extends(WidgetAction, _super);

    function WidgetAction() {
      this.update = __bind(this.update, this);
      return WidgetAction.__super__.constructor.apply(this, arguments);
    }

    WidgetAction.prototype.update = function(element, valueAccessor, allBindings) {
      var data, href;
      data = this.getData(element, valueAccessor, allBindings, 'action');
      href = this.createUrl(data.id, data.action, data.params, '?');
      element.setAttribute('href', href);
      return this.setRel(element);
    };

    return WidgetAction;

  })(this.Maslosoft.Ko.Balin.WidgetUrl);

  this.Maslosoft.Ko.Balin.WidgetActivity = (function(_super) {
    __extends(WidgetActivity, _super);

    function WidgetActivity() {
      this.update = __bind(this.update, this);
      return WidgetActivity.__super__.constructor.apply(this, arguments);
    }

    WidgetActivity.prototype.update = function(element, valueAccessor, allBindings) {
      var data, href;
      data = this.getData(element, valueAccessor, allBindings, 'activity');
      href = this.createUrl(data.id, data.activity, data.params, '#');
      element.setAttribute('href', href);
      return this.setRel(element);
    };

    return WidgetActivity;

  })(this.Maslosoft.Ko.Balin.WidgetUrl);

  TreeDnd = (function() {
    var t;

    TreeDnd.prototype.autoExpandMS = 400;

    TreeDnd.prototype.focusOnClick = false;

    TreeDnd.prototype.preventVoidMoves = true;

    TreeDnd.prototype.preventRecursiveMoves = true;

    TreeDnd.prototype.tree = null;

    TreeDnd.prototype.finder = null;

    TreeDnd.prototype.draggable = null;

    TreeDnd.prototype.events = null;

    TreeDnd.el = null;

    t = function(node) {
      var childNode, children, _i, _len, _ref;
      return;
      log("Node: " + node.title);
      children = [];
      if (node.children && node.children.length > 0) {
        _ref = node.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          childNode = _ref[_i];
          children.push(childNode.title);
        }
        return log("Children: " + (children.join(',')));
      }
    };

    function TreeDnd(initialTree, element, events, options) {
      this.events = events;
      this.dragDrop = __bind(this.dragDrop, this);
      this.dragEnd = __bind(this.dragEnd, this);
      this.draggable = {};
      this.draggable.scroll = false;
      this.tree = {};
      this.tree = initialTree;
      this.finder = new TreeNodeFinder(this.tree);
      this.el = jQuery(element);
    }

    TreeDnd.prototype.dragStart = function(node, data) {
      return true;
    };

    TreeDnd.prototype.dragEnter = function(node, data) {
      return true;
    };

    TreeDnd.prototype.dragEnd = function(node, data) {
      log('drag end...');
      return true;
    };

    TreeDnd.prototype.dragDrop = function(node, data) {
      var ctx, current, dragged, handler, hitMode, index, parent, target, targetParent;
      hitMode = data.hitMode;
      dragged = data.draggable.element[0];
      this.events.drop(node, data);
      if (!data.otherNode) {
        ctx = ko.contextFor(dragged);
        current = this.events.getNode(ctx.$data);
      } else {
        parent = this.finder.find(data.otherNode.parent.data.id);
        current = this.events.getNode(this.finder.find(data.otherNode.data.id));
        if (!this.el.is(dragged)) {
          log('From other instance...');
          data = ko.dataFor(dragged);
          log(data);
          setTimeout(handler, 0);
        }
      }
      target = this.finder.find(node.data.id);
      targetParent = this.finder.find(node.parent.data.id);
      if (parent) {
        parent.children.remove(current);
      }
      this.tree.children.remove(current);
      if (targetParent) {
        targetParent.children.remove(current);
      }
      if (hitMode === 'over') {
        target.children.push(current);
      }
      if (hitMode === 'before') {
        if (targetParent) {
          index = targetParent.children.indexOf(target);
          targetParent.children.splice(index, 0, current);
        } else {
          index = this.tree.children.indexOf(target);
          this.tree.children.splice(index, 0, current);
        }
      }
      if (hitMode === 'after') {
        if (targetParent) {
          targetParent.children.push(current);
        } else {
          this.tree.children.push(current);
        }
      }
      handler = (function(_this) {
        return function(e) {
          log(e);
          _this.el.fancytree('option', 'source', _this.tree.children);
          _this.el.fancytree('getRootNode').visit(function(node) {
            return node.setExpanded(true);
          });
          _this.el.focus();
          return log('update tree..', _this.el);
        };
      })(this);
      setTimeout(handler, 0);
      return true;
    };

    return TreeDnd;

  })();

  TreeDrag = (function() {
    var t;

    TreeDrag.prototype.focusOnClick = false;

    TreeDrag.prototype.tree = null;

    TreeDrag.prototype.finder = null;

    TreeDrag.prototype.draggable = null;

    TreeDrag.el = null;

    t = function(node) {
      var childNode, children, _i, _len, _ref;
      return;
      log("Node: " + node.title);
      children = [];
      if (node.children && node.children.length > 0) {
        _ref = node.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          childNode = _ref[_i];
          children.push(childNode.title);
        }
        return log("Children: " + (children.join(',')));
      }
    };

    function TreeDrag(initialTree, element, events, options) {
      this.dragDrop = __bind(this.dragDrop, this);
      this.dragEnd = __bind(this.dragEnd, this);
      this.draggable = {};
      this.draggable.scroll = false;
      this.tree = {};
      this.tree = initialTree;
      this.finder = new TreeNodeFinder(this.tree);
      this.el = jQuery(element);
    }

    TreeDrag.prototype.dragStart = function(node, data) {
      return true;
    };

    TreeDrag.prototype.dragEnter = function(node, data) {
      return false;
    };

    TreeDrag.prototype.dragEnd = function(node, data) {
      log('drag end...');
      return true;
    };

    TreeDrag.prototype.dragDrop = function(node, data) {
      var ctx, current, dragged, handler, hitMode, index, parent, target, targetParent;
      return false;
      hitMode = data.hitMode;
      dragged = data.draggable.element[0];
      if (!data.otherNode) {
        ctx = ko.contextFor(dragged);
        current = ctx.$data;
      } else {
        parent = this.finder.find(data.otherNode.parent.data.id);
        current = this.finder.find(data.otherNode.data.id);
        if (!this.el.is(dragged)) {
          log('From other instance...');
          data = ko.dataFor(dragged);
          log(data);
          setTimeout(handler, 0);
        }
      }
      target = this.finder.find(node.data.id);
      targetParent = this.finder.find(node.parent.data.id);
      if (parent) {
        parent.children.remove(current);
      }
      this.tree.children.remove(current);
      if (targetParent) {
        targetParent.children.remove(current);
      }
      if (hitMode === 'over') {
        target.children.push(current);
      }
      if (hitMode === 'before') {
        if (targetParent) {
          index = targetParent.children.indexOf(target);
          targetParent.children.splice(index, 0, current);
        } else {
          index = this.tree.children.indexOf(target);
          this.tree.children.splice(index, 0, current);
        }
      }
      if (hitMode === 'after') {
        if (targetParent) {
          targetParent.children.push(current);
        } else {
          this.tree.children.push(current);
        }
      }
      handler = (function(_this) {
        return function(e) {
          log(e);
          _this.el.fancytree('option', 'source', _this.tree.children);
          _this.el.fancytree('getRootNode').visit(function(node) {
            return node.setExpanded(true);
          });
          _this.el.focus();
          return log('update tree..', _this.el);
        };
      })(this);
      setTimeout(handler, 0);
      return true;
    };

    return TreeDrag;

  })();

  TreeEvents = (function() {
    var doEvent, finder, stop;

    TreeEvents.prototype.events = null;

    TreeEvents.prototype.dropEvent = null;

    TreeEvents.prototype.options = null;

    finder = null;

    doEvent = function(data) {
      if (typeof data.targetType === 'undefined') {
        return true;
      }
      if (data.targetType === 'title') {
        return true;
      }
      if (data.targetType === 'icon') {
        return true;
      }
    };

    stop = function(event) {
      return event.stopPropagation();
    };

    function TreeEvents(initialTree, events, options) {
      this.events = events;
      this.options = options;
      this.handle = __bind(this.handle, this);
      this.getNode = __bind(this.getNode, this);
      this.drop = __bind(this.drop, this);
      finder = new TreeNodeFinder(initialTree);
      this.handle('click');
      this.handle('dblclick');
      this.handle('activate');
      this.handle('deactivate');
    }

    TreeEvents.prototype.drop = function(node, data) {
      log("Drop...");
      log(this.events);
      if (this.events.drop) {
        this.dropEvent = new this.events.drop(node, data);
        return log(this.dropEvent);
      }
    };

    TreeEvents.prototype.getNode = function(node) {
      log("Tree event drop...");
      log(this.dropEvent);
      if (this.dropEvent && this.dropEvent.getNode) {
        return this.dropEvent.getNode(node);
      } else {
        return node;
      }
    };

    TreeEvents.prototype.handle = function(type) {
      if (this.events[type]) {
        return this.options[type] = (function(_this) {
          return function(event, data) {
            var model;
            if (doEvent(data)) {
              model = finder.find(data.node.data.id);
              _this.events[type](model, data, event);
              return stop(event);
            }
          };
        })(this);
      }
    };

    return TreeEvents;

  })();

  TreeNodeCache = (function() {
    var nodes;

    nodes = {};

    function TreeNodeCache() {}

    TreeNodeCache.prototype.get = function(id) {
      if (typeof nodes[id] === 'undefined') {
        return false;
      }
      return nodes[id];
    };

    TreeNodeCache.prototype.set = function(id, val) {
      return nodes[id] = val;
    };

    return TreeNodeCache;

  })();

  TreeNodeFinder = (function() {
    var cache, findNode, trees;

    cache = new TreeNodeCache;

    trees = [];

    function TreeNodeFinder(initialTree) {
      trees.push(initialTree);
    }

    findNode = function(node, id) {
      var child, found, foundNode, _i, _len, _ref;
      if (typeof id === 'undefined') {
        return false;
      }
      if (found = cache.get(id)) {
        return found;
      }
      if (node.id === id) {
        return node;
      }
      if (node._id === id) {
        return node;
      }
      if (node.children && node.children.length > 0) {
        _ref = node.children;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          child = _ref[_i];
          foundNode = findNode(child, id);
          if (foundNode !== false) {
            cache.set(id, foundNode);
            return foundNode;
          }
        }
      }
      return false;
    };

    TreeNodeFinder.prototype.find = function(id) {
      var node, tree, _i, _len;
      for (_i = 0, _len = trees.length; _i < _len; _i++) {
        tree = trees[_i];
        node = findNode(tree, id);
        if (node) {
          return node;
        }
      }
      return false;
    };

    return TreeNodeFinder;

  })();

  TreeNodeRenderer = (function() {
    var finder;

    TreeNodeRenderer.prototype.icon = '';

    TreeNodeRenderer.prototype.folderIcon = '';

    TreeNodeRenderer.prototype.renderer = null;

    finder = null;

    function TreeNodeRenderer(tree, options, icon, folderIcon) {
      this.icon = icon;
      this.folderIcon = folderIcon;
      this.render = __bind(this.render, this);
      finder = new TreeNodeFinder(tree);
    }

    TreeNodeRenderer.prototype.setRenderer = function(renderer) {
      this.renderer = renderer;
      if (typeof this.renderer.render !== 'function') {
        return console.error("Renderer must have function `render`");
      }
    };

    TreeNodeRenderer.prototype.render = function(event, data) {
      var html, icon, index, model, node, span, val;
      node = data.node;
      for (index in data) {
        val = data[index];
        if (index === 'originalEvent') {
          return;
        }
      }
      span = jQuery(node.span).find("> span.fancytree-title");
      if (this.renderer && this.renderer.render) {
        model = finder.find(node.data.id);
        this.renderer.render(model, span);
      }
      if (this.icon || this.folderIcon) {
        html = span.html();
        if (this.folderIcon && node.children && node.children.length) {
          icon = this.folderIcon;
        } else {
          icon = this.icon;
        }
        return span.html("<i class='node-title-icon' style='background-image:url(" + icon + ")'></i> " + html);
      }
    };

    return TreeNodeRenderer;

  })();

  ValidationManager = (function() {
    var toggle;

    ValidationManager.prototype.element = null;

    ValidationManager.prototype.parent = null;

    ValidationManager.prototype.errors = null;

    ValidationManager.prototype.warnings = null;

    toggle = ko.utils.toggleDomNodeCssClass;

    function ValidationManager(validators, options) {
      this.validators = validators;
      this.options = options;
      this.adviseOne = __bind(this.adviseOne, this);
      this.validateOne = __bind(this.validateOne, this);
      this.setElement = __bind(this.setElement, this);
      this.validate = __bind(this.validate, this);
    }

    ValidationManager.prototype.validate = function(element, value) {
      var validator, _i, _j, _len, _len1, _ref, _ref1;
      this.setElement(element);
      _ref = this.validators;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        validator = _ref[_i];
        if (!this.validateOne(validator, value)) {
          return false;
        }
      }
      _ref1 = this.validators;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        validator = _ref1[_j];
        if (typeof validator.getWarnings === 'function') {
          this.adviseOne(validator, value);
        }
      }
      return true;
    };

    ValidationManager.prototype.setElement = function(element) {
      this.element = element;
      this.parent = jQuery(this.element).parents('.form-group')[0];
      this.errors = this.parent.querySelector(this.options.errorMessages);
      this.warnings = this.parent.querySelector(this.options.warningMessages);
      return this;
    };

    ValidationManager.prototype.validateOne = function(validator, value) {
      var element, errors, isValid, messages, parent, warnings;
      element = this.element;
      parent = this.parent;
      errors = this.errors;
      warnings = this.warnings;
      messages = new Array;
      validator.reset();
      isValid = false;
      if (validator.isValid(value)) {
        if (this.options.inputError) {
          toggle(element, this.options.inputError, false);
        }
        if (this.options.inputSuccess) {
          toggle(element, this.options.inputSuccess, true);
        }
        if (parent) {
          if (this.options.parentError) {
            toggle(parent, this.options.parentError, false);
          }
          if (this.options.parentSuccess) {
            toggle(parent, this.options.parentSuccess, true);
          }
        }
        if (errors) {
          errors.innerHTML = '';
        }
        isValid = true;
      } else {
        messages = validator.getErrors();
        if (this.options.inputError) {
          toggle(element, this.options.inputError, true);
        }
        if (this.options.inputSuccess) {
          toggle(element, this.options.inputSuccess, false);
        }
        if (parent) {
          if (this.options.parentError) {
            toggle(parent, this.options.parentError, true);
          }
          if (this.options.parentSuccess) {
            toggle(parent, this.options.parentSuccess, false);
          }
        }
        if (errors && messages) {
          errors.innerHTML = messages.join('<br />');
        }
        isValid = false;
      }
      if (this.options.inputWarning) {
        toggle(element, this.options.inputWarning, false);
      }
      if (parent) {
        if (this.options.parentWarning) {
          toggle(parent, this.options.parentWarning, false);
        }
      }
      if (warnings) {
        warnings.innerHTML = '';
      }
      return isValid;
    };

    ValidationManager.prototype.adviseOne = function(validator, value) {
      var element, errors, messages, parent, warnings;
      element = this.element;
      parent = this.parent;
      errors = this.errors;
      warnings = this.warnings;
      messages = validator.getWarnings();
      if (messages.length) {
        if (this.options.inputWarning) {
          toggle(element, this.options.inputWarning, true);
        }
        if (this.options.inputSuccess) {
          toggle(element, this.options.inputSuccess, false);
        }
        if (parent) {
          if (this.options.parentWarning) {
            toggle(parent, this.options.parentWarning, true);
          }
          if (this.options.parentSuccess) {
            toggle(parent, this.options.parentSuccess, false);
          }
        }
        if (warnings) {
          warnings.innerHTML = messages.join('<br />');
        }
      }
      return this;
    };

    return ValidationManager;

  })();

  this.Maslosoft.Ko.getType = function(type) {
    if (x && typeof x === 'object') {
      if (x.constructor === Date) {
        return 'date';
      }
      if (x.constructor === Array) {
        return 'array';
      }
    }
    return typeof x;
  };

  this.Maslosoft.Ko.objByName = function(name, context) {
    var args, func, i, n, ns, part, _i, _len;
    if (context == null) {
      context = window;
    }
    args = Array.prototype.slice.call(arguments, 2);
    ns = name.split(".");
    func = context;
    part = [];
    for (i = _i = 0, _len = ns.length; _i < _len; i = ++_i) {
      n = ns[i];
      part.push(n);
      if (typeof func[n] === 'undefined') {
        throw new Error("Name part `" + (part.join('.')) + "` not found while accesing " + name);
      }
      func = func[n];
    }
    return func;
  };

  this.Maslosoft.Ko.Track = (function() {
    function Track() {
      this.fromJs = __bind(this.fromJs, this);
      this.factory = __bind(this.factory, this);
    }

    Track.prototype.factory = function(data) {
      var Error, className, index, model, name, ref, value, _i, _len;
      if (!data) {
        return data;
      }
      if (data._class) {
        className = data._class.replace(/\\/g, '.');
        try {
          ref = Maslosoft.Ko.objByName(className);
        } catch (_error) {
          Error = _error;
          console.warn("Could not resolve class name `" + className + "`");
        }
        if (ref) {
          return new ref(data);
        } else {
          console.warn("Class `" + className + "` not found, using default object");
          console.debug(data);
        }
      }
      if (typeof data === 'object') {
        data = ko.track(data, {
          deep: true
        });
        if (Array.isArray(data)) {
          for (index = _i = 0, _len = data.length; _i < _len; index = ++_i) {
            model = data[index];
            data[index] = this.factory(model);
          }
        } else {
          for (name in data) {
            value = data[name];
            data[name] = this.factory(value);
          }
        }
      }
      return data;
    };

    Track.prototype.fromJs = function(model, jsData) {
      var name, value, _results;
      _results = [];
      for (name in jsData) {
        value = jsData[name];
        if (typeof value === 'object') {
          if (model[name]) {
            _results.push(this.fromJs(model[name], value));
          } else {
            _results.push(model[name] = this.factory(value));
          }
        } else {
          _results.push(model[name] = value);
        }
      }
      return _results;
    };

    return Track;

  })();

  ko.tracker = new this.Maslosoft.Ko.Track;

  if (!window.Proxy) {
    console.warn('Your browser does not support Proxy, will not work properly in some cases...');
    window.Proxy = (function() {
      function Proxy() {}

      return Proxy;

    })();
  }

  ModelProxyHandler = (function() {
    function ModelProxyHandler(parent, field) {
      this.parent = parent;
      this.field = field;
    }

    ModelProxyHandler.prototype.set = function(target, name, value, receiver) {
      var after, before, changed;
      changed = false;
      if (target[name] !== value) {
        changed = true;
      }
      before = Object.keys(target).length;
      target[name] = value;
      after = Object.keys(target).length;
      if (before !== after) {
        changed = true;
      }
      if (changed) {
        ko.valueHasMutated(this.parent, this.field);
      }
      return true;
    };

    ModelProxyHandler.prototype.deleteProperty = function(target, name) {
      delete target[name];
      ko.valueHasMutated(this.parent, this.field);
      return true;
    };

    return ModelProxyHandler;

  })();

  if (WeakMap) {
    initMap = new WeakMap();
  } else {
    initMap = new Map();
  }

  this.Maslosoft.Ko.Balin.Model = (function() {
    function Model(data) {
      var initialized, name, value;
      if (data == null) {
        data = null;
      }
      initialized = initMap.get(this);
      for (name in this) {
        value = this[name];
        if (isPlainObject(this[name])) {
          this[name] = {};
        }
        if (Array.isArray(this[name])) {
          this[name] = [];
        }
      }
      if (!initialized) {
        initMap.set(this, true);
        for (name in this) {
          value = this[name];
          this[name] = ko.tracker.factory(value);
          if (isPlainObject(this[name])) {
            this[name] = new Proxy(this[name], new ModelProxyHandler(this, name));
          }
        }
      }
      for (name in data) {
        value = data[name];
        this[name] = ko.tracker.factory(value);
      }
      for (name in this) {
        value = this[name];
        if (isPlainObject(this[name])) {
          this[name] = new Proxy(this[name], new ModelProxyHandler(this, name));
        }
      }
      ko.track(this, {
        deep: true
      });
    }

    return Model;

  })();

  this.Maslosoft.Ko.Balin.registerDefaults();

  ko.punches.enableAll();

}).call(this);

//# sourceMappingURL=ko.balin.js.map
