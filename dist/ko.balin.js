(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (!this.Maslosoft) {
    this.Maslosoft = {};
  }

  if (!this.Maslosoft.Ko) {
    this.Maslosoft.Ko = {};
  }

  if (!this.Maslosoft.Ko.Balin) {
    this.Maslosoft.Ko.Balin = {};
  }

  this.Maslosoft.Ko.Balin.register = function(name, handler) {
    ko.bindingHandlers[name] = handler;
    if (handler.writable) {
      return ko.expressionRewriting.twoWayBindings[name] = true;
    }
  };

  this.Maslosoft.Ko.Balin.registerDefaults = function(handlers) {
    var config, index, value, _results, _results1;
    if (handlers == null) {
      handlers = null;
    }
    config = {
      fancytree: Maslosoft.Ko.Balin.Fancytree,
      fileSizeFormatter: Maslosoft.Ko.Balin.FileSizeFormatter,
      href: Maslosoft.Ko.Balin.Href,
      htmlValue: Maslosoft.Ko.Balin.HtmlValue,
      src: Maslosoft.Ko.Balin.Src,
      textValue: Maslosoft.Ko.Balin.TextValue,
      selected: Maslosoft.Ko.Balin.Selected
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

    Base.prototype.options = null;

    function Base(options) {
      this.options = options != null ? options : {};
      this.getValue = __bind(this.getValue, this);
    }

    Base.prototype.getValue = function(valueAccessor, defaults) {
      var value;
      if (defaults == null) {
        defaults = '';
      }
      value = ko.unwrap(valueAccessor());
      if (this.options.valueField) {
        if (this.options.ec5) {
          value = value[this.options.valueField];
        } else {
          value = value[this.options.valueField]();
        }
      }
      return value || defaults;
    };

    Base.prototype.setValue = function(valueAccessor, value) {};

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

  this.Maslosoft.Ko.Balin.DateOptions = (function(_super) {
    __extends(DateOptions, _super);

    function DateOptions() {
      return DateOptions.__super__.constructor.apply(this, arguments);
    }

    DateOptions.prototype.sourceFormat = 'unix';

    DateOptions.prototype.displayFormat = 'YYYY-MM-DD';

    return DateOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.DateTimeOptions = (function(_super) {
    __extends(DateTimeOptions, _super);

    function DateTimeOptions() {
      return DateTimeOptions.__super__.constructor.apply(this, arguments);
    }

    DateTimeOptions.prototype.sourceFormat = 'unix';

    DateTimeOptions.prototype.displayFormat = 'YYYY-MM-DD hh:mm';

    return DateTimeOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.TimeOptions = (function(_super) {
    __extends(TimeOptions, _super);

    function TimeOptions() {
      return TimeOptions.__super__.constructor.apply(this, arguments);
    }

    TimeOptions.prototype.sourceFormat = 'unix';

    TimeOptions.prototype.displayFormat = 'hh:mm';

    return TimeOptions;

  })(this.Maslosoft.Ko.Balin.Options);

  this.Maslosoft.Ko.Balin.DateTime = (function(_super) {
    __extends(DateTime, _super);

    function DateTime(options) {
      this.options = new this.Maslosoft.Ko.Balin.DateTimeOptions(options);
    }

    return DateTime;

  })(this.Maslosoft.Ko.Balin.Base);


  /*
  One-way date/time formatter
   */

  this.Maslosoft.Ko.Balin.MomentFormatter = (function(_super) {
    __extends(MomentFormatter, _super);

    function MomentFormatter() {
      this.update = __bind(this.update, this);
      this.init = __bind(this.init, this);
      return MomentFormatter.__super__.constructor.apply(this, arguments);
    }

    MomentFormatter.prototype.init = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      moment.lang(this.options.lang);
    };

    MomentFormatter.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value;
      value = this.getValue(valueAccessor);
      element.innerHTML = moment[this.sourceformat](value).format(this.displayformat);
    };

    return MomentFormatter;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.EnumFormatter = (function() {
    function EnumFormatter() {}

    return EnumFormatter;

  })();

  this.Maslosoft.Ko.Balin.Fancytree = (function(_super) {
    __extends(Fancytree, _super);

    function Fancytree() {
      this.update = __bind(this.update, this);
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
      var options;
      options = valueAccessor().options || {};
      options.source = this.getData(valueAccessor);
      return jQuery(element).fancytree(options);
    };

    Fancytree.prototype.update = function(element, valueAccessor, allBindingsAccessor, viewModel) {
      var config, handler;
      config = this.getValue(valueAccessor);
      element = jQuery(element);
      handler = (function(_this) {
        return function() {
          if (!element.find('.ui-fancytree').length) {
            return;
          }
          element.fancytree('option', 'source', _this.getData(valueAccessor));
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
      var handler;
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
      ko.utils.registerEventHandler(element, "keyup, input", handler);
      ko.utils.registerEventHandler(document, "mouseup", handler);
    };

    HtmlValue.prototype.update = function(element, valueAccessor) {
      var value;
      value = this.getValue(valueAccessor);
      if (this.getElementValue(element) !== value) {
        this.setElementValue(element, value);
      }
    };

    return HtmlValue;

  })(this.Maslosoft.Ko.Balin.Base);

  this.Maslosoft.Ko.Balin.Selected = (function(_super) {
    __extends(Selected, _super);

    function Selected() {
      this.update = __bind(this.update, this);
      return Selected.__super__.constructor.apply(this, arguments);
    }

    Selected.prototype.writable = false;

    Selected.prototype.className = 'selected';

    Selected.prototype.update = function(element, valueAccessor) {
      var value;
      value = this.getValue(valueAccessor);
      if (value) {
        ko.utils.toggleDomNodeCssClass(element, this.className, true);
      } else {
        ko.utils.toggleDomNodeCssClass(element, this.className, false);
      }
    };

    return Selected;

  })(this.Maslosoft.Ko.Balin.Base);

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
      this.factory = __bind(this.factory, this);
    }

    Track.prototype.factory = function(data) {
      var className, name, ref, value;
      if (!data) {
        return data;
      }
      if (data._class) {
        className = data._class.replace(/\\/g, '.');
        ref = Maslosoft.Ko.objByName(className);
        if (ref) {
          return new ref(data);
        } else {
          console.warn("Class `" + className + "` not found, using default object");
          console.debug(data);
        }
      }
      if (typeof data === 'object') {
        for (name in data) {
          value = data[name];
          data[name] = this.factory(value);
        }
        data = ko.track(data);
      }
      return data;
    };

    return Track;

  })();

  ko.tracker = new this.Maslosoft.Ko.Track;

  this.Maslosoft.Ko.Balin.Model = (function() {
    function Model(data) {
      var name, value;
      if (data == null) {
        data = null;
      }
      for (name in this) {
        value = this[name];
        if (data && typeof data[name] !== 'undefined') {
          this[name] = ko.tracker.factory(data[name]);
        } else {
          this[name] = ko.tracker.factory(value);
        }
      }
      ko.track(this);
    }

    return Model;

  })();

}).call(this);

//# sourceMappingURL=ko.balin.js.map
