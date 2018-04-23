(function() {
  "use strict";
  var ModelProxyHandler, PluginsManager, TreeDnd, TreeDrag, TreeEvents, TreeNodeCache, TreeNodeFinder, TreeNodeRenderer, ValidationManager, assert, entityMap, error, escapeHtml, escapeRegExp, initMap, isPlainObject, log, setRefByName, warn,
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

  setRefByName = function(name, value, context) {
    var args, func, i, n, ns, _i, _len;
    if (context == null) {
      context = window;
    }
    args = Array.prototype.slice.call(arguments, 2);
    ns = name.split(".");
    func = context;
    for (i = _i = 0, _len = ns.length; _i < _len; i = ++_i) {
      n = ns[i];
      console.log(i);
      if (i === ns.length - 1) {
        console.log(n);
        func[n] = value;
      }
      func = func[n];
    }
    return func;
  };

  escapeRegExp = function(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  };

  entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;'
  };

  escapeHtml = function(string) {
    return String(string).replace(/[&<>"'`=\/]/g, function(s) {
      return entityMap[s];
    });
  };

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

  if (!this.Maslosoft.Binder) {
    this.Maslosoft.Binder = {};
  }

  if (!this.Maslosoft.Binder.Helpers) {
    this.Maslosoft.Binder.Helpers = {};
  }

  if (!this.Maslosoft.Binder.Widgets) {
    this.Maslosoft.Binder.Widgets = {};
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

  this.Maslosoft.Binder.register = function(name, handler) {
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

  this.Maslosoft.Binder.registerDefaults = function(handlers) {
    var config, index, value, _results, _results1;
    if (handlers == null) {
      handlers = null;
    }
    config = {
      acl: Maslosoft.Binder.Acl,
      active: Maslosoft.Binder.Active,
      action: Maslosoft.Binder.WidgetAction,
      activity: Maslosoft.Binder.WidgetActivity,
      asset: Maslosoft.Binder.Asset,
      cssClasses: Maslosoft.Binder.CssClasses,
      cssColumnSizes: Maslosoft.Binder.CssColumnSizes,
      cssColumns: Maslosoft.Binder.CssColumns,
      data: Maslosoft.Binder.Data,
      dateFormatter: Maslosoft.Binder.DateFormatter,
      datePicker: Maslosoft.Binder.DatePicker,
      datePickerPickaDate: Maslosoft.Binder.PickaDate,
      dateTimeFormatter: Maslosoft.Binder.DateTimeFormatter,
      decimalFormatter: Maslosoft.Binder.DecimalFormatter,
      disabled: Maslosoft.Binder.Disabled,
      enumCssClassFormatter: Maslosoft.Binder.EnumCssClassFormatter,
      enumFormatter: Maslosoft.Binder.EnumFormatter,
      "eval": Maslosoft.Binder.Eval,
      fancytree: Maslosoft.Binder.Fancytree,
      fileSizeFormatter: Maslosoft.Binder.FileSizeFormatter,
      hidden: Maslosoft.Binder.Hidden,
      href: Maslosoft.Binder.Href,
      html: Maslosoft.Binder.Html,
      htmlTree: Maslosoft.Binder.HtmlTree,
      htmlValue: Maslosoft.Binder.HtmlValue,
      icon: Maslosoft.Binder.Icon,
      log: Maslosoft.Binder.Log,
      model: Maslosoft.Binder.DataModel,
      ref: Maslosoft.Binder.Widget,
      src: Maslosoft.Binder.Src,
      tags: Maslosoft.Binder.Tags,
      text: Maslosoft.Binder.Text,
      textValue: Maslosoft.Binder.TextValue,
      textValueHlJs: Maslosoft.Binder.TextValueHLJS,
      timeAgoFormatter: Maslosoft.Binder.TimeAgoFormatter,
      timeFormatter: Maslosoft.Binder.TimeFormatter,
      timePicker: Maslosoft.Binder.TimePicker,
      tooltip: Maslosoft.Binder.Tooltip,
      treegrid: Maslosoft.Binder.TreeGrid,
      treegridnode: Maslosoft.Binder.TreeGridNode,
      selected: Maslosoft.Binder.Selected,
      select2: Maslosoft.Binder.Select2,
      validator: Maslosoft.Binder.Validator,
      videoPlaylist: Maslosoft.Binder.VideoPlaylist,
      videoThumb: Maslosoft.Binder.VideoThumb,
      widget: Maslosoft.Binder.Widget
    };
    if (handlers !== null) {
      _results = [];
      for (index in handlers) {
        value = handlers[index];
        _results.push(Maslosoft.Binder.register(value, new config[value]));
      }
      return _results;
    } else {
      _results1 = [];
      for (index in config) {
        value = config[index];
        _results1.push(Maslosoft.Binder.register(index, new value));
      }
      return _results1;
    }
  };

  this.Maslosoft.Binder.registerEvents = function(handlers) {
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
        _results.push(Maslosoft.Binder.makeEventHandlerShortcut(value));
      }
      return _results;
    } else {
      _results1 = [];
      for (index in config) {
        value = config[index];
        _results1.push(Maslosoft.Binder.makeEventHandlerShortcut(value));
      }
      return _results1;
    }
  };

  this.Maslosoft.Binder.makeEventHandlerShortcut = function(eventName) {
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

  this.Maslosoft.Binder.Base = (function() {
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

  this.Maslosoft.Binder.Options = (function() {
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

  this.Maslosoft.Binder.CssOptions = (function(_super) {
    __extends(CssOptions, _super);

    function CssOptions() {
      return CssOptions.__super__.constructor.apply(this, arguments);
    }

    CssOptions.prototype.className = 'active';

    return CssOptions;

  })(this.Maslosoft.Binder.Options);

  this.Maslosoft.Binder.DateOptions = (function(_super) {
    __extends(DateOptions, _super);

    function DateOptions() {
      return DateOptions.__super__.constructor.apply(this, arguments);
    }

    DateOptions.prototype.lang = 'en';

    DateOptions.prototype.sourceFormat = 'unix';

    DateOptions.prototype.displayFormat = 'YYYY-MM-DD';

    return DateOptions;

  })(this.Maslosoft.Binder.Options);

  this.Maslosoft.Binder.DateTimeOptions = (function(_super) {
    __extends(DateTimeOptions, _super);

    function DateTimeOptions() {
      return DateTimeOptions.__super__.constructor.apply(this, arguments);
    }

    DateTimeOptions.prototype.lang = 'en';

    DateTimeOptions.prototype.sourceFormat = 'unix';

    DateTimeOptions.prototype.displayFormat = 'YYYY-MM-DD hh:mm';

    return DateTimeOptions;

  })(this.Maslosoft.Binder.Options);

  this.Maslosoft.Binder.TimeAgoOptions = (function(_super) {
    __extends(TimeAgoOptions, _super);

    function TimeAgoOptions() {
      return TimeAgoOptions.__super__.constructor.apply(this, arguments);
    }

    TimeAgoOptions.prototype.lang = 'en';

    TimeAgoOptions.prototype.sourceFormat = 'unix';

    TimeAgoOptions.prototype.displayFormat = 'hh:mm';

    return TimeAgoOptions;

  })(this.Maslosoft.Binder.Options);

  this.Maslosoft.Binder.TimeOptions = (function(_super) {
    __extends(TimeOptions, _super);

    function TimeOptions() {
      return TimeOptions.__super__.constructor.apply(this, arguments);
    }

    TimeOptions.prototype.lang = 'en';

    TimeOptions.prototype.sourceFormat = 'unix';

    TimeOptions.prototype.displayFormat = 'hh:mm';

    return TimeOptions;

  })(this.Maslosoft.Binder.Options);

  this.Maslosoft.Binder.ValidatorOptions = (function(_super) {
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

  })(this.Maslosoft.Binder.Options);

  this.Maslosoft.Binder.BaseValidator = (function() {
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

  this.Maslosoft.Binder.CssClass = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.CssColumnsBase = (function(_super) {
    __extends(CssColumnsBase, _super);

    function CssColumnsBase() {
      this.applyColumns = __bind(this.applyColumns, this);
      return CssColumnsBase.__super__.constructor.apply(this, arguments);
    }

    CssColumnsBase.prototype.writable = false;

    CssColumnsBase.prototype.applyColumns = function(element, sizes, config) {
      var name, newClasses, re, reName, size;
      newClasses = [];
      for (size in config) {
        name = config[size];
        reName = name.replace('{num}', '\\d');
        name = name.replace('{num}', '');
        re = new RegExp("(?:^|\\s)" + reName + "+(?!\\S)", 'g');
        element.className = element.className.replace(re, '');
        newClasses.push(name + sizes[size]);
      }
      jQuery(element).addClass(newClasses.join(' '));
    };

    return CssColumnsBase;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.MomentFormatter = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Picker = (function(_super) {
    __extends(Picker, _super);

    function Picker() {
      return Picker.__super__.constructor.apply(this, arguments);
    }

    return Picker;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Video = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.WidgetUrl = (function(_super) {
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
      data.params = this.getValue(data.params);
      if (typeof src === 'string') {
        data[bindingName] = src;
      }
      return data;
    };

    WidgetUrl.prototype.createUrl = function(widgetId, action, params, terminator) {
      var args, href, name, value;
      args = [];
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
      if (args.length === 0) {
        return href;
      } else {
        args = args.join(',', args);
        return "" + href + "=" + args;
      }
    };

    WidgetUrl.prototype.setRel = function(element) {
      var hasRel, isPlain, rel, relValue, rels, _i, _len;
      hasRel = false;
      isPlain = false;
      rels = [];
      rel = element.getAttribute('rel');
      if (rel) {
        rels = rel.split(' ');
        for (_i = 0, _len = rels.length; _i < _len; _i++) {
          relValue = rels[_i];
          if (relValue === 'plain') {
            isPlain = true;
          }
          if (relValue === 'virtual') {
            hasRel = true;
          }
        }
      }
      if (!hasRel && !isPlain) {
        rels.push('virtual');
      }
      return element.setAttribute('rel', rels.join(' '));
    };

    return WidgetUrl;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Acl = (function(_super) {
    var allow;

    __extends(Acl, _super);

    function Acl() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return Acl.__super__.constructor.apply(this, arguments);
    }

    allow = null;

    Acl.prototype.init = function() {
      if (!Maslosoft.Binder.Acl.allow) {
        throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions");
      }
      if (typeof Maslosoft.Binder.Acl.allow !== 'function') {
        throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions");
      }
    };

    Acl.prototype.update = function(element, valueAccessor) {
      var acl, value;
      acl = this.getValue(valueAccessor);
      value = Maslosoft.Binder.Acl.allow(acl);
      return ko.bindingHandlers.visible.update(element, function() {
        return value;
      });
    };

    return Acl;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Active = (function(_super) {
    __extends(Active, _super);

    function Active(options) {
      Active.__super__.constructor.call(this, new Maslosoft.Binder.CssOptions({
        className: 'active'
      }));
    }

    return Active;

  })(this.Maslosoft.Binder.CssClass);

  this.Maslosoft.Binder.Asset = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.CssClasses = (function(_super) {
    __extends(CssClasses, _super);

    function CssClasses() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      this.getClassList = __bind(this.getClassList, this);
      return CssClasses.__super__.constructor.apply(this, arguments);
    }

    CssClasses.prototype.getClassList = function(valueAccessor) {
      var classList, classes;
      classes = this.getValue(valueAccessor);
      if (typeof classes === 'undefined') {
        return '';
      }
      if (classes === null) {
        return '';
      }
      if (typeof classes === 'string') {
        classList = classes;
      } else {
        classList = classes.join(' ');
      }
      return classList.replace(/^\s*/, '').replace(/\s*$/, '');
    };

    CssClasses.prototype.init = function(element, valueAccessor) {
      var initialClasses;
      initialClasses = this.getClassList(valueAccessor);
      return element.setAttribute('data-css-classes', initialClasses);
    };

    CssClasses.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var classesToAdd, toRemove;
      toRemove = element.getAttribute('data-css-classes');
      ko.utils.toggleDomNodeCssClass(element, toRemove, false);
      classesToAdd = this.getClassList(valueAccessor);
      if (classesToAdd) {
        ko.utils.toggleDomNodeCssClass(element, classesToAdd, true);
      }
      return element.setAttribute('data-css-classes', classesToAdd);
    };

    return CssClasses;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.CssColumnSizes = (function(_super) {
    __extends(CssColumnSizes, _super);

    function CssColumnSizes() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return CssColumnSizes.__super__.constructor.apply(this, arguments);
    }

    CssColumnSizes.columns = {
      'xs': 'col-xs-{num}',
      'sm': 'col-sm-{num}',
      'md': 'col-md-{num}',
      'lg': 'col-lg-{num}'
    };

    CssColumnSizes.prototype.init = function(element, valueAccessor) {};

    CssColumnSizes.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var sizes;
      sizes = this.getValue(valueAccessor);
      return this.applyColumns(element, sizes, CssColumnSizes.columns);
    };

    return CssColumnSizes;

  })(this.Maslosoft.Binder.CssColumnsBase);

  this.Maslosoft.Binder.CssColumns = (function(_super) {
    __extends(CssColumns, _super);

    function CssColumns() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return CssColumns.__super__.constructor.apply(this, arguments);
    }

    CssColumns.columns = {
      'xs': 'col-xs-{num}',
      'sm': 'col-sm-{num}',
      'md': 'col-md-{num}',
      'lg': 'col-lg-{num}'
    };

    CssColumns.prototype.init = function(element, valueAccessor) {};

    CssColumns.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var cols, columns, name, size, sizes, value, _ref;
      columns = this.getValue(valueAccessor);
      sizes = {};
      _ref = CssColumns.columns;
      for (size in _ref) {
        name = _ref[size];
        value = parseInt(columns[size]);
        cols = parseInt(12 / value);
        sizes[size] = cols;
      }
      return this.applyColumns(element, sizes, CssColumns.columns);
    };

    return CssColumns;

  })(this.Maslosoft.Binder.CssColumnsBase);

  this.Maslosoft.Binder.Data = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.DataModel = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.DateFormatter = (function(_super) {
    __extends(DateFormatter, _super);

    function DateFormatter(options) {
      DateFormatter.__super__.constructor.call(this, new Maslosoft.Binder.DateOptions(options));
    }

    return DateFormatter;

  })(this.Maslosoft.Binder.MomentFormatter);


  /*
  Date picker
   */

  this.Maslosoft.Binder.DatePicker = (function(_super) {
    __extends(DatePicker, _super);

    function DatePicker(options) {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      this.getModelValue = __bind(this.getModelValue, this);
      this.getDisplayValue = __bind(this.getDisplayValue, this);
      this.updateModel = __bind(this.updateModel, this);
      DatePicker.__super__.constructor.call(this, new Maslosoft.Binder.DateOptions(options));
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

  })(this.Maslosoft.Binder.Picker);


  /*
  One-way date/time formatter
   */

  this.Maslosoft.Binder.DateTimeFormatter = (function(_super) {
    __extends(DateTimeFormatter, _super);

    function DateTimeFormatter(options) {
      DateTimeFormatter.__super__.constructor.call(this, new Maslosoft.Binder.DateTimeOptions(options));
    }

    return DateTimeFormatter;

  })(this.Maslosoft.Binder.MomentFormatter);

  this.Maslosoft.Binder.DecimalFormatter = (function(_super) {
    __extends(DecimalFormatter, _super);

    function DecimalFormatter() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return DecimalFormatter.__super__.constructor.apply(this, arguments);
    }

    DecimalFormatter.prototype.precision = 2;

    DecimalFormatter.prototype.decimalSeparator = ',';

    DecimalFormatter.prototype.thousandSeparator = ' ';

    DecimalFormatter.prototype.suffix = '';

    DecimalFormatter.prototype.prefix = '';

    DecimalFormatter.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel) {};

    DecimalFormatter.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var bound, config, format, formatted, name, names, value, _i, _len;
      value = this.getValue(valueAccessor) || 0;
      value = parseFloat(value);
      config = {};
      names = ['precision', 'decimalSeparator', 'thousandSeparator', 'suffix', 'prefix'];
      for (_i = 0, _len = names.length; _i < _len; _i++) {
        name = names[_i];
        config[name] = this[name];
        bound = allBindingsAccessor.get(name);
        if (typeof bound !== 'undefined') {
          config[name] = this.getValue(bound);
        }
      }

      /*
      		 * Number.prototype.format(n, x, s, c)
      		 * @see http://stackoverflow.com/a/14428340/5444623
      		 * @param float   number: number to format
      		 * @param integer n: length of decimal
      		 * @param integer x: length of whole part
      		 * @param mixed   s: sections delimiter
      		 * @param mixed   c: decimal delimiter
       */
      format = function(number, n, x, s, c) {
        var num, re;
        if (n == null) {
          n = 2;
        }
        if (x == null) {
          x = 3;
        }
        if (s == null) {
          s = ' ';
        }
        if (c == null) {
          c = ',';
        }
        re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
        num = number.toFixed(Math.max(0, ~~n));
        return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
      };
      formatted = format(value, config.precision, 3, config.thousandSeparator, config.decimalSeparator);
      return element.innerHTML = config.prefix + formatted + config.suffix;
    };

    return DecimalFormatter;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Disabled = (function(_super) {
    __extends(Disabled, _super);

    function Disabled(options) {
      Disabled.__super__.constructor.call(this, new Maslosoft.Binder.CssOptions({
        className: 'disabled'
      }));
    }

    return Disabled;

  })(this.Maslosoft.Binder.CssClass);

  this.Maslosoft.Binder.EnumCssClassFormatter = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.EnumFormatter = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Eval = (function(_super) {
    __extends(Eval, _super);

    function Eval() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return Eval.__super__.constructor.apply(this, arguments);
    }

    Eval.prototype.init = function(element, valueAccessor) {
      var allowBindings;
      allowBindings = this.getValue(valueAccessor);
      console.log(allowBindings);
      return {
        controlsDescendantBindings: !allowBindings
      };
    };

    Eval.prototype.update = function(element, valueAccessor) {
      var allowBindings;
      allowBindings = this.getValue(valueAccessor);
      console.log(allowBindings);
      return {
        controlsDescendantBindings: !allowBindings
      };
    };

    return Eval;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Fancytree = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.FileSizeFormatter = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.GMap = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Hidden = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Href = (function(_super) {
    var bustLinks;

    __extends(Href, _super);

    function Href() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return Href.__super__.constructor.apply(this, arguments);
    }

    bustLinks = function(element) {
      var defer;
      defer = function() {
        var $il, innerLink, _i, _len, _ref, _results;
        _ref = jQuery(element).find('a');
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          innerLink = _ref[_i];
          $il = jQuery(innerLink);
          _results.push($il.replaceWith($il.contents()));
        }
        return _results;
      };
      return setTimeout(defer, 0);
    };

    Href.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      var stopPropagation;
      if (!element.href) {
        element.setAttribute('href', '');
      }
      if (element.tagName.toLowerCase() !== 'a') {
        console.warn('href binding should be used only on `a` tags');
      }
      bustLinks(element);
      stopPropagation = allBindingsAccessor.get('stopPropagation') || false;
      if (stopPropagation) {
        return ko.utils.registerEventHandler(element, "click", function(e) {
          return e.stopPropagation();
        });
      }
    };

    Href.prototype.update = function(element, valueAccessor, allBindings) {
      var href, target;
      bustLinks(element);
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Html = (function(_super) {
    __extends(Html, _super);

    function Html() {
      this.update = __bind(this.update, this);
      return Html.__super__.constructor.apply(this, arguments);
    }

    Html.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      return {
        'controlsDescendantBindings': true
      };
    };

    Html.prototype.update = function(element, valueAccessor, allBindings, context) {
      var configuration, pm, value;
      value = this.getValue(valueAccessor);
      configuration = this.getValue(allBindings).plugins;
      pm = new PluginsManager(element);
      pm.from(configuration);
      value = pm.getElementValue(element, value);
      return ko.utils.setHtml(element, value);
    };

    return Html;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.HtmlTree = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.HtmlValue = (function(_super) {
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
      var configuration, deferHandler, dispose, handler, pm;
      element.setAttribute('contenteditable', true);
      if (!element.id) {
        element.id = "Maslosoft-Ko-Binder-HtmlValue-" + (idCounter++);
      }
      configuration = this.getValue(allBindingsAccessor).plugins;
      pm = new PluginsManager(element);
      pm.from(configuration);
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
            elementValue = pm.getModelValue(element, elementValue);
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
      jQuery(element).on("keyup, input", handler);
      jQuery(document).on("mouseup", deferHandler);
      dispose = function(toDispose) {
        jQuery(toDispose).off("keyup, input", handler);
        return jQuery(document).off("mouseup", deferHandler);
      };
      ko.utils.domNodeDisposal.addDisposeCallback(element, dispose);
    };

    HtmlValue.prototype.update = function(element, valueAccessor, allBindings) {
      var configuration, pm, value;
      value = this.getValue(valueAccessor);
      configuration = this.getValue(allBindings).plugins;
      pm = new PluginsManager(element);
      pm.from(configuration);
      value = pm.getElementValue(element, value);
      if (this.getElementValue(element) !== value) {
        this.setElementValue(element, value);
      }
    };

    return HtmlValue;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Icon = (function(_super) {
    __extends(Icon, _super);

    function Icon() {
      this.update = __bind(this.update, this);
      return Icon.__super__.constructor.apply(this, arguments);
    }

    Icon.prototype.update = function(element, valueAccessor, allBindings) {
      var $element, date, defaultSize, extra, fixedSize, iconField, isImage, isSvg, matched, model, nameSuffix, regex, size, src;
      $element = $(element);
      model = this.getValue(valueAccessor);
      extra = this.getValue(allBindings);
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
      isSvg = false;
      if (src.match(/\.(svg)$/)) {
        isSvg = true;
      }
      nameSuffix = '';
      if (src.match(/\.(jpg|jped|gif|png|svg)$/)) {
        matched = src.match(/[^\/]*?\.(jpg|jped|gif|png|svg)$/);
        nameSuffix = matched[0];
        src = src.replace(/[^\/]*?\.(jpg|jped|gif|png|svg)$/, "");
      }
      if (!nameSuffix && model.filename) {
        nameSuffix = model.filename;
      }
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
      if (isSvg) {
        isImage = false;
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
          date = null;
          if (model.updateDate.sec) {
            date = model.updateDate.sec;
          } else {
            date = model.updateDate;
          }
          if (typeof date === 'number') {
            src = src + date;
          }
          if (typeof date === 'string') {
            src = src + date;
          }
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
      if (src.match(/\/$/)) {
        src = src + nameSuffix;
      } else {
        src = src + '/' + nameSuffix;
      }
      if (extra.cachebusting) {
        src = src + '?' + new Date().getTime();
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Log = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);


  /*
  Date picker
  NOTE: Not recommended, as Pick A Date is not maintanted
   */

  this.Maslosoft.Binder.PickaDate = (function(_super) {
    __extends(PickaDate, _super);

    function PickaDate(options) {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      this.getModelValue = __bind(this.getModelValue, this);
      this.getDisplayValue = __bind(this.getDisplayValue, this);
      this.updateModel = __bind(this.updateModel, this);
      PickaDate.__super__.constructor.call(this, new Maslosoft.Binder.DateOptions(options));
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

  })(this.Maslosoft.Binder.Picker);


  /*
  Select2
   */

  this.Maslosoft.Binder.Select2 = (function(_super) {
    var bindingName, dataBindingName, init, triggerChangeQuietly;

    __extends(Select2, _super);

    function Select2() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return Select2.__super__.constructor.apply(this, arguments);
    }

    bindingName = 'select2';

    dataBindingName = "" + bindingName + "Data";

    triggerChangeQuietly = function(element, binding) {
      var isObservable, originalEqualityComparer;
      isObservable = ko.isObservable(binding);
      originalEqualityComparer = void 0;
      if (isObservable) {
        originalEqualityComparer = binding.equalityComparer;
        binding.equalityComparer = function() {
          return true;
        };
      }
      $(element).trigger('change');
      if (isObservable) {
        binding.equalityComparer = originalEqualityComparer;
      }
    };

    init = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var allBindings, bindingValue, dataChangeHandler, ignoreChange, subscription;
      bindingValue = ko.unwrap(valueAccessor());
      allBindings = allBindingsAccessor();
      ignoreChange = false;
      dataChangeHandler = null;
      subscription = null;
      $(element).on('select2:selecting select2:unselecting', function() {
        ignoreChange = true;
      });
      $(element).on('select2:select select2:unselect', function() {
        ignoreChange = false;
      });
      if (ko.isObservable(allBindings.value)) {
        subscription = allBindings.value.subscribe(function(value) {
          if (ignoreChange) {
            return;
          }
          triggerChangeQuietly(element, this._target || this.target);
        });
      } else if (ko.isObservable(allBindings.selectedOptions)) {
        subscription = allBindings.selectedOptions.subscribe(function(value) {
          if (ignoreChange) {
            return;
          }
          triggerChangeQuietly(element, this._target || this.target);
        });
      }
      if (ko.isWriteableObservable(allBindings[dataBindingName])) {
        dataChangeHandler = function() {
          if (!$(element).data('select2')) {
            return;
          }
          allBindings[dataBindingName]($(element).select2('data'));
        };
        $(element).on('change', dataChangeHandler);
      }
      $(element).select2(bindingValue);
      if (allBindings.selectedOptions) {
        $(element).val(allBindings.selectedOptions).trigger('change');
      }
      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
        $(element).select2('destroy');
        if (dataChangeHandler !== null) {
          $(element).off('change', dataChangeHandler);
        }
        if (subscription !== null) {
          subscription.dispose();
        }
      });
    };

    Select2.prototype.init = function() {
      var args, to;
      args = arguments;
      to = function() {
        return init.apply(null, args);
      };
      return setTimeout(to, 0);
    };

    Select2.prototype.update = function(element, valueAccessor, allBindingsAccessor) {
      var copy, value;
      return;
      value = this.getValue(valueAccessor);
      if (element.value !== value.data) {
        copy = JSON.parse(JSON.stringify(value.data));
        $(element).val(copy);
        return console.log("Update what?", element, value);
      }
    };

    return Select2;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Selected = (function(_super) {
    __extends(Selected, _super);

    function Selected(options) {
      Selected.__super__.constructor.call(this, new Maslosoft.Binder.CssOptions({
        className: 'selected'
      }));
    }

    return Selected;

  })(this.Maslosoft.Binder.CssClass);

  this.Maslosoft.Binder.Src = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);


  /*
  Select2
   */

  this.Maslosoft.Binder.Tags = (function(_super) {
    var dropdownKillStyles, once;

    __extends(Tags, _super);

    function Tags() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      this.setTags = __bind(this.setTags, this);
      return Tags.__super__.constructor.apply(this, arguments);
    }

    dropdownKillStyles = '<style>\n	body.kill-all-select2-dropdowns .select2-dropdown {\n		display: none !important;\n	}\n	body.kill-all-select2-dropdowns .select2-container--default.select2-container--open.select2-container--below .select2-selection--single, .select2-container--default.select2-container--open.select2-container--below .select2-selection--multiple\n	{\n		border-bottom-left-radius: 4px;\n		border-bottom-right-radius: 4px;\n	}\n	.select2-container--default.select2-container--focus .select2-selection--multiple {\n		border-color: #66afe9;\n		outline: 0;\n		-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);\n		box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);\n	}\n</style>';

    once = true;

    Tags.prototype.setTags = function(el, tags) {
      var index, opt, options, tag, _i, _len, _results;
      options = el.find('option');
      if (options.length) {
        options.remove();
      }
      _results = [];
      for (index = _i = 0, _len = tags.length; _i < _len; index = ++_i) {
        tag = tags[index];
        opt = jQuery("<option selected='true'></option>");
        opt.val(tag);
        opt.text(tag);
        _results.push(el.append(opt));
      }
      return _results;
    };

    Tags.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
      var build, config, copy, data, dropDownKill, el, handler, updateCSS, value;
      if (element.tagName.toLowerCase() !== 'select') {
        throw new Error("Tags binding must be placed on `select` element");
      }
      if (once) {
        jQuery(dropdownKillStyles).appendTo('head');
        once = false;
      }
      data = this.getValue(valueAccessor);
      if (data.data) {
        value = data.data;
      } else {
        value = data;
      }
      copy = JSON.parse(JSON.stringify(value));
      el = jQuery(element);
      el.data('tags', true);
      el.attr('multiple', true);
      this.setTags(el, copy);
      config = {
        placeholder: data.placeholder,
        tags: true,
        tokenSeparators: [',', ' ']
      };
      updateCSS = function() {
        var input;
        if (data.inputCss) {
          input = el.parent().find('.select2-search__field');
          input.addClass(data.inputCss);
          return input.attr('placeholder', data.placeholder);
        }
      };
      if (data.tagCss) {
        config.templateSelection = function(selection, element) {
          element.removeClass('select2-selection__choice');
          element.addClass(data.tagCss);
          if (selection.selected) {
            return jQuery("<span>" + selection.text + "</span>");
          } else {
            return jQuery("<span>" + selection.text + "</span>");
          }
        };
      }
      handler = (function(_this) {
        return function() {
          var elementValue, index, tag, _i, _len;
          if (value.removeAll) {
            value.removeAll();
          } else {
            value = [];
          }
          elementValue = el.val();
          if (elementValue) {
            for (index = _i = 0, _len = elementValue.length; _i < _len; index = ++_i) {
              tag = elementValue[index];
              tag = tag.replace(',', '').replace(' ', '').trim();
              if (!tag) {
                continue;
              }
              value.push(tag);
            }
          }
          return updateCSS();
        };
      })(this);
      dropDownKill = (function(_this) {
        return function(e) {
          var haveTags;
          haveTags = jQuery(e.target).data();
          if (haveTags) {
            return jQuery('body').toggleClass('kill-all-select2-dropdowns', e.type === 'select2:opening');
          }
        };
      })(this);
      build = (function(_this) {
        return function() {
          el.select2(config);
          updateCSS();
          el.on('change', handler);
          el.on('select2:select select2:unselect', handler);
          el.on('select2:opening select2:close', dropDownKill);
          return ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            el.select2('destroy');
            if (handler !== null) {
              el.off('change', handler);
              return el.off('select2:select select2:unselect', handler);
            }
          });
        };
      })(this);
      return setTimeout(build, 0);
    };

    Tags.prototype.update = function(element, valueAccessor, allBindingsAccessor) {
      var copy, data, el, maybeSet, value;
      data = this.getValue(valueAccessor);
      if (data.data) {
        value = data.data;
      } else {
        value = data;
      }
      copy = JSON.parse(JSON.stringify(value));
      el = jQuery(element);
      maybeSet = (function(_this) {
        return function() {
          var elementTags, modelTags;
          if (el.val() === null) {
            elementTags = '';
          } else {
            elementTags = el.val().join(',').replace(/(,+)/g, ',').replace(/(\s+)/g, ' ');
          }
          modelTags = value.join(',');
          if (elementTags !== modelTags) {
            return _this.setTags(el, copy);
          }
        };
      })(this);
      return setTimeout(maybeSet, 0);
    };

    return Tags;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Text = (function(_super) {
    __extends(Text, _super);

    function Text() {
      this.update = __bind(this.update, this);
      return Text.__super__.constructor.apply(this, arguments);
    }

    Text.prototype.init = function(element, valueAccessor, allBindingsAccessor, context) {
      return {
        'controlsDescendantBindings': true
      };
    };

    Text.prototype.update = function(element, valueAccessor, allBindings, context) {
      var configuration, pm, value;
      value = escapeHtml(this.getValue(valueAccessor));
      configuration = this.getValue(allBindings).plugins;
      pm = new PluginsManager(element);
      pm.from(configuration);
      value = pm.getElementValue(element, value);
      return ko.utils.setHtml(element, value);
    };

    return Text;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.TextValue = (function(_super) {
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

  })(this.Maslosoft.Binder.HtmlValue);

  this.Maslosoft.Binder.TextValueHLJS = (function(_super) {
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

  })(this.Maslosoft.Binder.HtmlValue);

  this.Maslosoft.Binder.TimeAgoFormatter = (function(_super) {
    __extends(TimeAgoFormatter, _super);

    function TimeAgoFormatter(options) {
      this.update = __bind(this.update, this);
      TimeAgoFormatter.__super__.constructor.call(this, new Maslosoft.Binder.TimeAgoOptions(options));
    }

    TimeAgoFormatter.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value;
      value = this.getValue(valueAccessor);
      element.innerHTML = moment[this.options.sourceFormat](value).fromNow();
    };

    return TimeAgoFormatter;

  })(this.Maslosoft.Binder.MomentFormatter);

  this.Maslosoft.Binder.TimeFormatter = (function(_super) {
    __extends(TimeFormatter, _super);

    function TimeFormatter(options) {
      TimeFormatter.__super__.constructor.call(this, new Maslosoft.Binder.TimeOptions(options));
    }

    return TimeFormatter;

  })(this.Maslosoft.Binder.MomentFormatter);


  /*
  Time picker
   */

  this.Maslosoft.Binder.TimePicker = (function(_super) {
    __extends(TimePicker, _super);

    function TimePicker() {
      return TimePicker.__super__.constructor.apply(this, arguments);
    }

    return TimePicker;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Tooltip = (function(_super) {
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Tree = (function(_super) {
    __extends(Tree, _super);

    function Tree() {
      this.update = __bind(this.update, this);
      return Tree.__super__.constructor.apply(this, arguments);
    }

    Tree.prototype.update = function(element, valueAccessor) {};

    return Tree;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.TreeGrid = (function(_super) {
    var makeValueAccessor;

    __extends(TreeGrid, _super);

    function TreeGrid() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return TreeGrid.__super__.constructor.apply(this, arguments);
    }

    makeValueAccessor = function(element, valueAccessor, bindingContext, widget) {
      return function() {
        var data, depth, depths, modelValue, unwrapRecursive, unwrappedValue;
        modelValue = valueAccessor();
        unwrappedValue = ko.utils.peekObservable(modelValue);
        if (!unwrappedValue || typeof unwrappedValue.length === 'number') {
          return {
            'foreach': modelValue,
            'templateEngine': ko.nativeTemplateEngine.instance
          };
        }
        data = ko.observableArray([]);
        depths = ko.observableArray([]);
        depth = -1;
        unwrapRecursive = function(items) {
          var extras, hasChilds, item, _i, _len, _results;
          depth++;
          _results = [];
          for (_i = 0, _len = items.length; _i < _len; _i++) {
            item = items[_i];
            hasChilds = item.children && item.children.length && item.children.length > 0;
            extras = {
              depth: depth,
              hasChilds: hasChilds
            };
            item._treeGrid = ko.tracker.factory(extras);
            data.push(item);
            depths.push(depth);
            if (hasChilds) {
              unwrapRecursive(item.children);
              _results.push(depth--);
            } else {
              _results.push(void 0);
            }
          }
          return _results;
        };
        if (unwrappedValue['data']['children']) {
          unwrapRecursive(unwrappedValue['data']['children']);
        } else {
          unwrapRecursive(unwrappedValue['data']);
        }
        if (bindingContext) {
          bindingContext.tree = unwrappedValue['data'];
          bindingContext.data = data;
          bindingContext.widget = widget;
        }
        ko.utils.unwrapObservable(modelValue);
        return {
          'foreach': data,
          'depths': depths,
          'as': unwrappedValue['as'],
          'includeDestroyed': unwrappedValue['includeDestroyed'],
          'afterAdd': unwrappedValue['afterAdd'],
          'beforeRemove': unwrappedValue['beforeRemove'],
          'afterRender': unwrappedValue['afterRender'],
          'beforeMove': unwrappedValue['beforeMove'],
          'afterMove': unwrappedValue['afterMove'],
          'templateEngine': ko.nativeTemplateEngine.instance
        };
      };
    };

    TreeGrid.prototype.init = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var activeClass, activeClassHandler, dispose, table, value, widget;
      value = this.getValue(valueAccessor);
      activeClass = value.activeClass;
      table = jQuery(element);
      if (activeClass) {
        activeClassHandler = function(e) {
          table.find('tr').removeClass(activeClass);
          jQuery(e.currentTarget).addClass(activeClass);
          return true;
        };
        table.on('click', 'tr', activeClassHandler);
        dispose = function(toDispose) {
          return jQuery(toDispose).off("click", 'tr', activeClassHandler);
        };
        ko.utils.domNodeDisposal.addDisposeCallback(element, dispose);
      }
      widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView(element, valueAccessor);
      ko.bindingHandlers['template']['init'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
      return {
        controlsDescendantBindings: true
      };
    };

    TreeGrid.prototype.update = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var widget;
      widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView(element, valueAccessor, 'update');
      return ko.bindingHandlers['template']['update'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
    };

    return TreeGrid;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.TreeGridNode = (function(_super) {
    __extends(TreeGridNode, _super);

    function TreeGridNode() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return TreeGridNode.__super__.constructor.apply(this, arguments);
    }

    TreeGridNode.prototype.init = function(element, valueAccessor, allBindings, viewModel, bindingContext) {};

    TreeGridNode.prototype.update = function(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var config, data, depth, expanders, extras, folderIcon, html, nodeIcon;
      ko.utils.toggleDomNodeCssClass(element, 'tree-grid-drag-handle', true);
      html = [];
      data = this.getValue(valueAccessor);
      extras = data._treeGrid;
      config = bindingContext.widget.config;
      nodeIcon = config.nodeIcon;
      folderIcon = config.folderIcon;
      if (folderIcon && extras.hasChilds) {
        nodeIcon = folderIcon;
      }
      depth = extras.depth;
      expanders = [];
      expanders.push("<div class='collapsed' style='display:none;transform: rotate(-90deg);'>&#128899;</div>");
      expanders.push("<div class='expanded' style='transform: rotate(-45deg);'>&#128899;</div>");
      html.push("<a class='expander' style='cursor:pointer;text-decoration:none;width:1em;margin-left:" + depth + "em;display:inline-block;'>" + (expanders.join('')) + "</a>");
      depth = extras.depth + 1;
      html.push("<i class='no-expander' style='margin-left:" + depth + "em;display:inline-block;'></i>");
      html.push("<img src='" + nodeIcon + "' style='width: 1em;height:1em;margin-top: -.3em;display: inline-block;'/>");
      return element.innerHTML = html.join('') + element.innerHTML;
    };

    return TreeGridNode;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.Validator = (function(_super) {
    var idCounter;

    __extends(Validator, _super);

    idCounter = 0;

    function Validator(options) {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      Validator.__super__.constructor.call(this, new Maslosoft.Binder.ValidatorOptions());
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
      var classField, configuration, handler, initialVal, manager, pm, validators;
      configuration = this.getValue(valueAccessor);
      classField = this.options.classField;
      pm = new PluginsManager(element, classField);
      validators = pm.from(configuration);
      manager = new ValidationManager(validators, this.options);
      manager.init(element);
      if (!element.id) {
        element.id = "Maslosoft-Ko-Binder-Validator-" + (idCounter++);
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

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.VideoPlaylist = (function(_super) {
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

  })(this.Maslosoft.Binder.Video);

  this.Maslosoft.Binder.VideoThumb = (function(_super) {
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

  })(this.Maslosoft.Binder.Video);

  this.Maslosoft.Binder.Widget = (function(_super) {
    __extends(Widget, _super);

    function Widget() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return Widget.__super__.constructor.apply(this, arguments);
    }

    Widget.prototype.init = function(element, valueAccessor, allBindings, context) {
      var Error, className, name, params, ref, value, widget;
      className = this.getValue(valueAccessor);
      ref = allBindings.get('ref');
      if (typeof ref === 'string' || !ref) {
        if (typeof className !== 'function') {
          return;
        }
        if (typeof className.constructor !== 'function') {
          return;
        }
        try {
          widget = new className;
        } catch (_error) {
          Error = _error;
          return;
        }
        if (ref) {
          setRefByName(ref, widget);
        }
        if (ref) {
          ref = widget;
        }
      } else {
        if (typeof ref === 'object') {
          widget = ref;
        }
      }
      params = allBindings.get('params');
      if (params) {
        for (name in params) {
          value = params[name];
          widget[name] = value;
        }
      }
      if (typeof widget.init === 'function') {
        widget.init(element);
      }
      if (typeof widget.dispose === 'function') {
        return ko.utils.domNodeDisposal.addDisposeCallback(element, widget.dispose);
      }
    };

    Widget.prototype.update = function(element, valueAccessor) {};

    return Widget;

  })(this.Maslosoft.Binder.Base);

  this.Maslosoft.Binder.WidgetAction = (function(_super) {
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

  })(this.Maslosoft.Binder.WidgetUrl);

  this.Maslosoft.Binder.WidgetActivity = (function(_super) {
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

  })(this.Maslosoft.Binder.WidgetUrl);

  PluginsManager = (function() {
    PluginsManager.prototype.classField = '_class';

    PluginsManager.prototype.element = null;

    PluginsManager.prototype.plugins = null;

    function PluginsManager(element, classField) {
      this.element = element != null ? element : null;
      this.classField = classField != null ? classField : '_class';
      this.getModelValue = __bind(this.getModelValue, this);
      this.getElementValue = __bind(this.getElementValue, this);
      this.plugins = new Array;
    }

    PluginsManager.prototype.from = function(configuration) {
      var cfg, classField, className, config, element, index, plugin, value, _i, _len;
      element = this.element;
      classField = this.classField;
      this.plugins = new Array;
      if (ko.isObservable(configuration)) {
        configuration = ko.unwrap(configuration);
      }
      if (!configuration) {
        return this.plugins;
      }
      if (configuration.constructor === Array) {
        cfg = configuration;
      } else {
        cfg = [configuration];
      }
      for (_i = 0, _len = cfg.length; _i < _len; _i++) {
        config = cfg[_i];
        if (!config[classField]) {
          error("Parameter `" + classField + "` must be defined for plugin on element:", element);
          continue;
        }
        if (typeof config[classField] !== 'function') {
          error("Parameter `" + classField + "` must be plugin compatible class, binding defined on element:", element);
          continue;
        }
        className = config[classField];
        delete config[classField];
        plugin = new className;
        for (index in config) {
          value = config[index];
          plugin[index] = null;
          plugin[index] = value;
        }
        this.plugins.push(plugin);
        return this.plugins;
      }
    };

    PluginsManager.prototype.getElementValue = function(element, value) {
      var plugin, _i, _len, _ref;
      _ref = this.plugins;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        plugin = _ref[_i];
        if (typeof plugin.getElementValue === 'function') {
          value = plugin.getElementValue(element, value);
        }
      }
      return value;
    };

    PluginsManager.prototype.getModelValue = function(element, value) {
      var plugin, _i, _len, _ref;
      _ref = this.plugins;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        plugin = _ref[_i];
        if (typeof plugin.getModelValue === 'function') {
          value = plugin.getModelValue(element, value);
        }
      }
      return value;
    };

    return PluginsManager;

  })();

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
    var hide, show, toggle;

    ValidationManager.prototype.element = null;

    ValidationManager.prototype.parent = null;

    ValidationManager.prototype.errors = null;

    ValidationManager.prototype.warnings = null;

    toggle = ko.utils.toggleDomNodeCssClass;

    hide = function(element) {
      return ko.utils.toggleDomNodeCssClass(element, 'hide', true);
    };

    show = function(element) {
      return ko.utils.toggleDomNodeCssClass(element, 'hide', false);
    };

    function ValidationManager(validators, options) {
      this.validators = validators;
      this.options = options;
      this.adviseOne = __bind(this.adviseOne, this);
      this.validateOne = __bind(this.validateOne, this);
      this.init = __bind(this.init, this);
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
      hide(this.errors);
      hide(this.warnings);
      return this;
    };

    ValidationManager.prototype.init = function(element) {
      return this.setElement(element);
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
          hide(errors);
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
          show(errors);
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
        hide(warnings);
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
          show(warnings);
          warnings.innerHTML = messages.join('<br />');
        }
      }
      return this;
    };

    return ValidationManager;

  })();

  if (!this.Maslosoft.Binder.Widgets.TreeGrid) {
    this.Maslosoft.Binder.Widgets.TreeGrid = {};
  }

  Maslosoft.Binder.Widgets.TreeGrid.Dnd = (function() {
    var didDrop, dragged, draggedOver, hitMode, indicator, prevHitMode;

    Dnd.prototype.grid = null;

    Dnd.prototype.helper = null;

    indicator = null;

    draggedOver = null;

    dragged = null;

    hitMode = null;

    prevHitMode = null;

    didDrop = false;

    function Dnd(grid) {
      var defer;
      this.grid = grid;
      this.dragHelper = __bind(this.dragHelper, this);
      this.clear = __bind(this.clear, this);
      this.move = __bind(this.move, this);
      this.dragOver = __bind(this.dragOver, this);
      this.over = __bind(this.over, this);
      this.drop = __bind(this.drop, this);
      this.stop = __bind(this.stop, this);
      this.drag = __bind(this.drag, this);
      this.dragStart = __bind(this.dragStart, this);
      if (!this.grid.config.dnd) {
        return;
      }
      if (this.grid.context === 'init') {
        ko.utils.domNodeDisposal.addDisposeCallback(this.grid.element.get(0), function() {
          var e;
          try {
            if (this.grid.element) {
              this.grid.element.draggable("destroy");
              return this.grid.element.droppable("destroy");
            }
          } catch (_error) {
            e = _error;
            return console.log(e.message);
          }
        });
        this.grid.element.on('mousemove', '> tr', this.move);
      }
      if (!indicator) {
        indicator = new Maslosoft.Binder.Widgets.TreeGrid.DropIndicator(this.grid);
      }
      defer = (function(_this) {
        return function() {
          var draggableOptions, droppableOptions;
          draggableOptions = {
            handle: '.tree-grid-drag-handle',
            cancel: '.expander, input, *[contenteditable], .no-drag',
            revert: false,
            cursor: 'pointer',
            cursorAt: {
              top: 5,
              left: 5
            },
            start: _this.dragStart,
            drag: _this.drag,
            stop: _this.stop,
            helper: _this.dragHelper
          };
          droppableOptions = {
            tolerance: "pointer",
            drop: _this.drop,
            over: _this.over
          };
          _this.grid.element.find('> tr').draggable(draggableOptions);
          return _this.grid.element.find('> tr').droppable(droppableOptions);
        };
      })(this);
      setTimeout(defer, 0);
    }

    Dnd.prototype.dragStart = function(e) {
      return dragged = e.target;
    };

    Dnd.prototype.drag = function(e, helper) {};

    Dnd.prototype.stop = function(e, ui) {
      if (!didDrop) {
        return this.drop(e, ui);
      }
    };

    Dnd.prototype.drop = function(e, ui) {
      var current, dropDelay, over, overParent, parentChilds, root;
      didDrop = true;
      if (!dragged) {
        return this.clear();
      }
      if (!draggedOver) {
        return this.clear();
      }
      if (!draggedOver.get(0)) {
        return this.clear();
      }
      current = ko.dataFor(dragged);
      over = ko.dataFor(draggedOver.get(0));
      if (!this.grid.canDrop(dragged, draggedOver, hitMode)) {
        return this.clear();
      }
      this.grid.freeze();
      overParent = this.grid.getParent(over);
      root = this.grid.getRoot();
      if (overParent.children) {
        parentChilds = overParent.children;
      } else {
        parentChilds = overParent;
      }
      dropDelay = (function(_this) {
        return function() {
          var index;
          _this.grid.remove(current);
          if (hitMode === 'over') {
            over.children.push(current);
          }
          if (hitMode === 'before') {
            index = parentChilds.indexOf(over);
            parentChilds.splice(index, 0, current);
          }
          if (hitMode === 'after') {
            if (over.children.length) {
              parentChilds.splice(0, 0, current);
            } else {
              parentChilds.push(current);
            }
          }
          if (hitMode === 'last') {
            if (root.children) {
              root.children.push(current);
            } else {
              root.push(current);
            }
          }
          return _this.clear();
        };
      })(this);
      return dropDelay();
    };

    Dnd.prototype.over = function(e) {
      if (e.target.tagName.toLowerCase() === 'tr') {
        if (draggedOver !== e.target) {
          draggedOver = jQuery(e.target);
          return this.dragOver(e);
        }
      }
    };

    Dnd.prototype.dragOver = function(e) {
      if (indicator) {
        return indicator.precise.over(dragged, draggedOver, hitMode, indicator);
      }
    };

    Dnd.prototype.move = function(e) {
      var offset, pos, rel;
      if (dragged) {
        if (e.currentTarget === dragged) {
          if (!draggedOver || dragged !== draggedOver.get(0)) {
            e.target = dragged;
            this.over(e);
          }
        }
      }
      if (draggedOver) {
        offset = draggedOver.offset();
        pos = {};
        pos.x = e.pageX - offset.left;
        pos.y = e.pageY - offset.top;
        rel = {};
        rel.x = pos.x / draggedOver.outerWidth(true);
        rel.y = pos.y / draggedOver.outerHeight(true);
        hitMode = 'over';
        if (rel.y > 0.65) {
          hitMode = 'after';
        }
        if (rel.y <= 0.25) {
          hitMode = 'before';
        }
        if (hitMode === 'after') {
          if (this.grid.isLast(ko.dataFor(draggedOver.get(0)))) {
            hitMode = 'last';
          }
        }
        if (prevHitMode !== hitMode) {
          prevHitMode = hitMode;
          e.target = draggedOver;
          return this.dragOver(e);
        }
      }
    };

    Dnd.prototype.clear = function() {
      this.grid.thaw();
      draggedOver = null;
      dragged = null;
      hitMode = null;
      prevHitMode = null;
      didDrop = false;
      if (this.helper) {
        this.helper.hide();
        this.helper = null;
      }
      if (indicator) {
        return indicator.hide();
      }
    };

    Dnd.prototype.dragHelper = function(e) {
      var cell, dropIndicator, item, tbody;
      tbody = jQuery(e.currentTarget).parent();
      cell = tbody.find('.tree-grid-drag-handle').parents('td').first();
      item = cell.clone();
      item.find('.expander .expanded').remove();
      item.find('.expander .collapsed').remove();
      item.find('.expander').remove();
      item.find('.no-expander').remove();
      dropIndicator = "<span class='drop-indicator'>&times;</span>";
      this.helper = jQuery("<div style='white-space:nowrap;'>" + dropIndicator + (item.html()) + "</div>");
      this.helper.css("pointer-events", "none");
      indicator.attach(this.helper.find('.drop-indicator'));
      return this.helper;
    };

    return Dnd;

  })();

  Maslosoft.Binder.Widgets.TreeGrid.DropIndicator = (function() {
    DropIndicator.precise = null;

    DropIndicator.element = null;

    function DropIndicator(grid) {
      this.grid = grid;
      this.precise = new Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator(this.grid);
    }

    DropIndicator.prototype.attach = function(element) {
      this.element = element;
      this.element.css({
        'font-size': '1.5em'
      });
      this.element.css({
        'width': '1em'
      });
      this.element.css({
        'height': '1em'
      });
      this.element.css({
        'position': 'absolute'
      });
      this.element.css({
        'left': '-.75em'
      });
      return this.element.css({
        'top': '-.35em'
      });
    };

    DropIndicator.prototype.hide = function() {
      this.element.hide();
      return this.precise.hide();
    };

    DropIndicator.prototype.show = function() {
      this.element.show();
      return this.precise.show();
    };

    DropIndicator.prototype.accept = function() {
      this.element.html('&check;');
      this.element.css({
        'color': 'green'
      });
      return this.precise.accept();
    };

    DropIndicator.prototype.deny = function() {
      this.element.html('&times;');
      this.element.css({
        'color': 'red'
      });
      return this.precise.deny();
    };

    return DropIndicator;

  })();

  Maslosoft.Binder.Widgets.TreeGrid.Events = (function() {
    Events.prototype.grid = null;

    function Events(grid, context) {
      this.grid = grid;
      if (!this.grid.config.on) {
        return;
      }
    }

    return Events;

  })();

  Maslosoft.Binder.Widgets.TreeGrid.Expanders = (function() {
    Expanders.prototype.grid = null;

    function Expanders(grid, context) {
      this.grid = grid;
      this.handler = __bind(this.handler, this);
      this.updateExpanders = __bind(this.updateExpanders, this);
      if (this.grid.config.expanders === false) {
        return;
      }
      if (this.grid.context === 'init') {
        this.grid.element.on('mousedown', '.expander', this.handler);
      }
      if (this.grid.context === 'update') {
        this.updateExpanders();
      }
    }

    Expanders.prototype.updateExpanders = function() {
      var defer, one;
      one = (function(_this) {
        return function(item, data) {
          var hasChildren;
          hasChildren = data.children && data.children.length;
          if (hasChildren) {
            item.find('.no-expander').hide();
            return item.find('.expander').show();
          } else {
            item.find('.expander').hide();
            return item.find('.no-expander').show();
          }
        };
      })(this);
      defer = (function(_this) {
        return function() {
          return _this.grid.visit(one);
        };
      })(this);
      return setTimeout(defer, 0);
    };

    Expanders.prototype.handler = function(e) {
      var current, depth, initOne, show;
      current = ko.contextFor(e.target).$data;
      depth = -1;
      show = false;
      log("clicked on expander " + current.title);
      initOne = (function(_this) {
        return function(item, data) {
          var el, itemDepth;
          itemDepth = data._treeGrid.depth;
          if (data === current) {
            depth = itemDepth;
            el = item.find('.expander');
            if (el.find('.expanded:visible').length) {
              el.find('.expanded').hide();
              el.find('.collapsed').show();
              show = false;
            } else {
              el.find('.collapsed').hide();
              el.find('.expanded').show();
              show = true;
            }
            return;
          }
          if (depth === -1) {
            return;
          }
          if (itemDepth === depth) {
            depth = -1;
            return;
          }
          if (itemDepth - 1 === depth) {
            if (show) {
              return item.show();
            } else {
              return item.hide();
            }
          }
        };
      })(this);
      return this.grid.visit(initOne);
    };

    return Expanders;

  })();

  Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator = (function() {
    var coarse, indicator, initialized, precise;

    InsertIndicator.prototype.grid = null;

    initialized = false;

    indicator = null;

    coarse = null;

    precise = null;

    function InsertIndicator(grid) {
      this.grid = grid;
      if (!initialized) {
        this.create();
        initialized = true;
      }
    }

    InsertIndicator.prototype.hide = function() {
      return indicator.hide();
    };

    InsertIndicator.prototype.show = function() {
      return indicator.show();
    };

    InsertIndicator.prototype.accept = function() {
      return indicator.css({
        color: 'green'
      });
    };

    InsertIndicator.prototype.deny = function() {
      return indicator.css({
        color: 'red'
      });
    };

    InsertIndicator.prototype.over = function(dragged, draggedOver, hitMode, accepter) {
      var left, mid, midFactor, node, nodeMid, offset, top, widthOffset;
      if (hitMode == null) {
        hitMode = 'over';
      }
      this.accept();
      accepter.accept();
      if (hitMode === 'over') {
        this.precise(false);
      } else {
        this.precise(true);
      }
      if (this.grid.canDrop(dragged, draggedOver, hitMode)) {
        this.accept();
        accepter.accept();
      } else {
        this.deny();
        accepter.deny();
      }
      node = draggedOver.find('.tree-grid-drag-handle');
      widthOffset = 0;
      midFactor = 1.5;
      offset = node.offset();
      mid = indicator.outerHeight(true) / midFactor;
      if (hitMode === 'over') {
        nodeMid = node.outerHeight(true) / midFactor;
        top = offset.top + nodeMid - mid;
      }
      if (hitMode === 'before') {
        top = offset.top - mid;
      }
      if (hitMode === 'after') {
        top = offset.top + node.outerHeight(true) - mid;
      }
      left = offset.left + widthOffset;
      indicator.css({
        left: left
      });
      indicator.css({
        top: top
      });
      return this.show();
    };

    InsertIndicator.prototype.precise = function(showPrecise) {
      if (showPrecise == null) {
        showPrecise = true;
      }
      if (showPrecise) {
        return precise.show();
      } else {
        return precise.hide();
      }
    };

    InsertIndicator.prototype.create = function() {
      indicator = jQuery('<div class="tree-grid-insert-indicator" style="display:none;position:absolute;z-index: 10000;color:green;line-height: 1em;">\n	<span class="tree-grid-insert-indicator-coarse" style="font-size: 1.5em;">\n		&#9654;\n	</span>\n	<span class="tree-grid-insert-indicator-precise" style="font-size:1.4em;">\n		&#11835;\n	</span>\n</div>');
      indicator.appendTo('body');
      coarse = indicator.find('.tree-grid-insert-indicator-coarse');
      precise = indicator.find('.tree-grid-insert-indicator-precise');
      return indicator.show();
    };

    return InsertIndicator;

  })();

  Maslosoft.Binder.Widgets.TreeGrid.TreeGridView = (function() {
    var cellsStyles;

    TreeGridView.plugins = [Maslosoft.Binder.Widgets.TreeGrid.Expanders, Maslosoft.Binder.Widgets.TreeGrid.Dnd, Maslosoft.Binder.Widgets.TreeGrid.Events];

    TreeGridView.prototype.element = null;

    TreeGridView.prototype.config = null;

    function TreeGridView(element, valueAccessor, context) {
      var plugin, _i, _len, _ref;
      if (valueAccessor == null) {
        valueAccessor = null;
      }
      this.context = context != null ? context : 'init';
      this.thaw = __bind(this.thaw, this);
      this.freeze = __bind(this.freeze, this);
      this.remove = __bind(this.remove, this);
      this.canDrop = __bind(this.canDrop, this);
      this.isLast = __bind(this.isLast, this);
      this.have = __bind(this.have, this);
      this.getContext = __bind(this.getContext, this);
      this.getRoot = __bind(this.getRoot, this);
      this.getParent = __bind(this.getParent, this);
      this.visitRecursive = __bind(this.visitRecursive, this);
      this.element = jQuery(element);
      if (valueAccessor) {
        this.config = {};
        this.config = ko.unwrap(valueAccessor());
        _ref = TreeGridView.plugins;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          plugin = _ref[_i];
          new plugin(this);
        }
      }
    }

    TreeGridView.prototype.visit = function(callback) {
      var data, item, items, _i, _len, _results;
      items = this.element.find('> tr');
      _results = [];
      for (_i = 0, _len = items.length; _i < _len; _i++) {
        item = items[_i];
        data = ko.dataFor(item);
        _results.push(callback(jQuery(item), data));
      }
      return _results;
    };

    TreeGridView.prototype.visitRecursive = function(callback, model) {
      var child, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _results, _results1;
      if (model == null) {
        model = null;
      }
      if (!model) {
        model = this.getRoot();
        callback(null, model);
        if (model.children && model.children.length) {
          _ref = model.children;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            child = _ref[_i];
            callback(model, child);
            this.visitRecursive(callback, child);
          }
        }
        if (model.length) {
          _results = [];
          for (_j = 0, _len1 = model.length; _j < _len1; _j++) {
            child = model[_j];
            callback(model, child);
            _results.push(this.visitRecursive(callback, child));
          }
          return _results;
        }
      } else {
        if (model.children && model.children.length) {
          _ref1 = model.children;
          for (_k = 0, _len2 = _ref1.length; _k < _len2; _k++) {
            child = _ref1[_k];
            callback(model, child);
            this.visitRecursive(callback, child);
          }
        }
        if (model.length) {
          _results1 = [];
          for (_l = 0, _len3 = model.length; _l < _len3; _l++) {
            child = model[_l];
            callback(model, child);
            _results1.push(this.visitRecursive(callback, child));
          }
          return _results1;
        }
      }
    };

    TreeGridView.prototype.getParent = function(model) {
      var found, one;
      found = null;
      one = function(parent, data) {
        if (data === model) {
          return found = parent;
        }
      };
      this.visitRecursive(one);
      return found;
    };

    TreeGridView.prototype.getRoot = function() {
      var ctx;
      ctx = ko.contextFor(this.element.get(0));
      return ctx.tree;
    };

    TreeGridView.prototype.getContext = function() {
      return ko.contextFor(this.element.get(0));
    };

    TreeGridView.prototype.have = function(parent, child) {
      var found, one;
      found = false;
      one = function(parent, data) {
        if (data === child) {
          return found = true;
        }
      };
      this.visitRecursive(one, parent);
      return found;
    };

    TreeGridView.prototype.isLast = function(model) {
      var last, lastRow;
      lastRow = this.element.find('> tr:last()');
      last = ko.dataFor(lastRow.get(0));
      if (model === last) {
        return true;
      }
      return false;
    };

    TreeGridView.prototype.canDrop = function(dragged, draggedOver, hitMode) {
      var current, over;
      current = ko.dataFor(dragged);
      over = ko.dataFor(draggedOver.get(0));
      if (hitMode === 'last') {
        return true;
      }
      if (hitMode === 'after') {
        return true;
      }
      if (current === over) {
        return false;
      }
      if (this.have(current, over)) {
        return false;
      }
      return true;
    };

    TreeGridView.prototype.remove = function(model) {
      var one;
      one = function(parent, data) {
        if (parent) {
          if (parent.children) {
            return parent.children.remove(model);
          } else {
            return parent.remove(model);
          }
        }
      };
      return this.visitRecursive(one);
    };

    TreeGridView.prototype.expandAll = function() {};

    TreeGridView.prototype.collapseAll = function() {};

    cellsStyles = [];

    TreeGridView.prototype.freeze = function() {
      var $cell, cell, cells, _i, _len, _results;
      cellsStyles = [];
      cells = this.element.find('> tr:first() td');
      _results = [];
      for (_i = 0, _len = cells.length; _i < _len; _i++) {
        cell = cells[_i];
        cellsStyles.push(cell.style);
        $cell = jQuery(cell);
        _results.push($cell.css('width', $cell.width() + 'px'));
      }
      return _results;
    };

    TreeGridView.prototype.thaw = function() {
      var defer;
      defer = (function(_this) {
        return function() {
          var cell, cells, index, _i, _len, _results;
          cells = _this.element.find('> tr:first-child() td');
          _results = [];
          for (index = _i = 0, _len = cells.length; _i < _len; index = ++_i) {
            cell = cells[index];
            _results.push(cell.style = cellsStyles[index]);
          }
          return _results;
        };
      })(this);
      return setTimeout(defer, 150);
    };

    return TreeGridView;

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

  this.Maslosoft.Binder.Model = (function() {
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

  this.Maslosoft.Ko.Balin = this.Maslosoft.Binder;

  this.Maslosoft.Ko.escapeRegExp = escapeRegExp;

  this.Maslosoft.Ko.escapeHtml = escapeHtml;

}).call(this);

//# sourceMappingURL=ko.binder-noinit.js.map
