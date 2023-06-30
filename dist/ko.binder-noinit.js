(function() {
  "use strict";
  /*
   * Number.prototype.format(n, x, s, c)
   * @see http://stackoverflow.com/a/14428340/5444623
   * @param float   number: number to format
   * @param integer n: length of decimal
   * @param integer x: length of whole part
   * @param mixed   s: sections delimiter
   * @param mixed   c: decimal delimiter
   */
  var ModelProxyHandler, PluginsManager, TreeDnd, TreeDrag, TreeEvents, TreeNodeCache, TreeNodeFinder, TreeNodeRenderer, ValidationManager, assert, ensureAttribute, entityMap, equals, error, escapeHtml, escapeRegExp, initMap, isPlainObject, lcfirst, log, numberFormat, preload, preloadedImages, ref1, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref2, ref20, ref21, ref22, ref23, ref24, ref25, ref26, ref27, ref28, ref29, ref3, ref30, ref31, ref32, ref33, ref34, ref35, ref36, ref37, ref38, ref39, ref4, ref40, ref41, ref42, ref43, ref44, ref45, ref5, ref6, ref7, ref8, ref9, setRefByName, stringToColour, ucfirst, warn,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

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

  warn = function(expr, element = null) {
    if (!console) {
      return;
    }
    return console.warn.apply(console, arguments);
  };

  error = function(expr, element = null) {
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

  setRefByName = function(name, value, context = window) {
    var args, func, i, j, len, n, ns;
    args = Array.prototype.slice.call(arguments, 2);
    ns = name.split(".");
    func = context;
    for (i = j = 0, len = ns.length; j < len; i = ++j) {
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
    // $& means the whole matched string
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

  
  // Compare objects for equallness.

  // Example:
  // equals({x: 2}, {x: 2}); // Returns true

  // Optionally skip properties (recursively) to compare:
  // equals({x: 2, y: false}, {x: 2, y: true}, ['y']); // Returns true
  // equals({y: false, x: 2, z: {x: 1, y: 1}}, {x: 2, y: true, z: {x: 1, y: 2}}, ['y']); // Returns true

  // @link https://stackoverflow.com/a/6713782/5444623

  equals = function(x, y, skip = []) {
    var doSkip, p;
    doSkip = function(property) {
      return skip.indexOf(property) !== -1;
    };
    // if both x and y are null or undefined and exactly the same
    if (x === y) {
      return true;
    }
    if (!(x instanceof Object) || !(y instanceof Object)) {
      return false;
    }
    // they must have the exact same prototype chain, the closest we can do is
    // test there constructor.
    if (x.constructor !== y.constructor) {
      return false;
    }
    for (p in x) {
      if (doSkip(p)) {
        continue;
      }
      if (!x.hasOwnProperty(p)) {
        continue;
      }
      if (!y.hasOwnProperty(p)) {
        return false;
      }
      // if they have the same strict value or identity then they are equal
      if (x[p] === y[p]) {
        continue;
      }
      // Numbers, Strings, Functions, Booleans must be strictly equal
      if (typeof x[p] !== 'object') {
        return false;
      }
      if (!equals(x[p], y[p], skip)) {
        return false;
      }
    }
    for (p in y) {
      if (doSkip(p)) {
        continue;
      }
      p = p;
      // allows x[ p ] to be set to undefined
      if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
        return false;
      }
    }
    return true;
  };

  
  // Generate CSS hex color based on input string

  stringToColour = function(str) {
    var colour, hash, i, value;
    hash = 0;
    i = 0;
    i = 0;
    while (i < str.length) {
      hash = str.charCodeAt(i) + (hash << 5) - hash;
      i++;
    }
    colour = '#';
    i = 0;
    while (i < 3) {
      value = hash >> i * 8 & 0xFF;
      colour += ('00' + value.toString(16)).substr(-2);
      i++;
    }
    return colour;
  };

  preloadedImages = {};

  
  // Preload image of element
  // @param element DomElement

  preload = function(element, src) {
    var image;
    if (preloadedImages[src]) {
      element.attr("src", src);
      return;
    }
    image = new Image();
    image.src = src;
    return image.onload = function() {
      image = null;
      preloadedImages[src] = true;
      return element.attr("src", src);
    };
  };

  ensureAttribute = function(element, attribute) {
    var attr;
    if (!element.hasAttribute(attribute)) {
      attr = document.createAttribute(attribute);
      attr.value = '';
      element.setAttributeNode(attr);
      element.setAttribute(attribute, '');
      return jQuery(element).attr(attribute, '');
    }
  };

  numberFormat = function(number, n = 2, x = 3, s = ' ', c = ',') {
    var num, re;
    re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')';
    num = number.toFixed(Math.max(0, ~~n));
    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  };

  lcfirst = function(str) {
    return str = str.substring(0, 1).toLocaleLowerCase() + str.substring(1);
  };

  ucfirst = function(str) {
    return str = str.substring(0, 1).toLocaleUpperCase() + str.substring(1);
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

  
  // Extra utils

  // Debounce function
  // @link https://john-dugan.com/javascript-debounce/

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

  
  // Register binding handler
  // @param string name
  // @params Maslosoft.Binder.Base handler

  this.Maslosoft.Binder.register = function(name, handler) {
    var name2;
    name2 = false;
    if (name.match(/[A-Z]/)) {
      name2 = name.toLowerCase();
    }
    // Assign two way. Not sure if necessary in current ko
    if (handler.writable) {
      if (ko.expressionRewriting && ko.expressionRewriting.twoWayBindings) {
        ko.expressionRewriting.twoWayBindings[name] = true;
        if (name2) {
          ko.expressionRewriting.twoWayBindings[name2] = true;
        }
      }
    }
    ko.bindingHandlers[name] = handler;
    // Lower-case version of binding handler for punches
    if (name2) {
      return ko.bindingHandlers[name2] = handler;
    }
  };

  //Reassign options
  //ko.bindingHandlers[name].options = JSON.parse(JSON.stringify(handler.options))

  // Register default set of binding handlers, or part of default set

  this.Maslosoft.Binder.registerDefaults = function(handlers = null) {
    var config, index, results, results1, value;
    // In alphabetical order
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
      eval: Maslosoft.Binder.Eval,
      fancytree: Maslosoft.Binder.Fancytree,
      fileSizeFormatter: Maslosoft.Binder.FileSizeFormatter,
      googlemap: Maslosoft.Binder.GoogleMap,
      hidden: Maslosoft.Binder.Hidden,
      href: Maslosoft.Binder.Href,
      html: Maslosoft.Binder.Html,
      htmlTree: Maslosoft.Binder.HtmlTree,
      htmlValue: Maslosoft.Binder.HtmlValue,
      icon: Maslosoft.Binder.Icon,
      id: Maslosoft.Binder.Id,
      log: Maslosoft.Binder.Log,
      model: Maslosoft.Binder.DataModel,
      placeholder: Maslosoft.Binder.Placeholder,
      ref: Maslosoft.Binder.Widget,
      src: Maslosoft.Binder.Src,
      tags: Maslosoft.Binder.Tags,
      text: Maslosoft.Binder.Text,
      textToBg: Maslosoft.Binder.TextToBg,
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
      results = [];
      for (index in handlers) {
        value = handlers[index];
        results.push(Maslosoft.Binder.register(value, new config[value]()));
      }
      return results;
    } else {
      results1 = [];
      for (index in config) {
        value = config[index];
        results1.push(Maslosoft.Binder.register(index, new value()));
      }
      return results1;
    }
  };

  
  // Register default set of event handlers, or part of default set

  this.Maslosoft.Binder.registerEvents = function(handlers = null) {
    var config, index, results, results1, value;
    config = {'dblclick': 'dblclick', 'mousedown': 'mousedown', 'mouseup': 'mouseup', 'mouseover': 'mouseover', 'mouseout': 'mouseout'};
    if (handlers !== null) {
      results = [];
      for (index in handlers) {
        value = handlers[index];
        results.push(Maslosoft.Binder.makeEventHandlerShortcut(value));
      }
      return results;
    } else {
      results1 = [];
      for (index in config) {
        value = config[index];
        results1.push(Maslosoft.Binder.makeEventHandlerShortcut(value));
      }
      return results1;
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

  
  // Base class for Maslosoft binding handlers

  this.Maslosoft.Binder.Base = (function() {
    class Base {
      // Class constructor
      // @param options @Maslosoft.Binder.Options

      constructor(options = {}) {
        var name, value;
        
        // Get value from model

        this.getValue = this.getValue.bind(this);
        //	Set ref to current object, not prototype
        this.options = {};
        for (name in options) {
          value = options[name];
          this.options[name] = value;
        }
      }

      getValue(valueAccessor, defaults = '') {
        var value;
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
        
        // Only use defaults when undefined
        if (typeof value === 'undefined') {
          return defaults;
        }
        return value;
      }

    };

    
    // Whenever to register binding handler as writable
    // @var boolean

    Base.prototype.writable = true;

    
    // @var @Maslosoft.Binder.Options

    Base.prototype.options = {};

    return Base;

  }).call(this);

  this.Maslosoft.Binder.Options = (function() {
    class Options {
      constructor(values = {}) {
        var index, value;
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

    };

    // Set this if need to access complex date objects
    // @var string

    Options.prototype.valueField = null;

    // Whenever to use ko ecmascript 5 plugin
    // Will autodetect if not set
    // @var boolean

    Options.prototype.ec5 = null;

    Options.prototype.afterUpdate = null;

    return Options;

  }).call(this);

  
  // Configuration class for css bindings

  this.Maslosoft.Binder.CssOptions = (function() {
    class CssOptions extends this.Maslosoft.Binder.Options {};

    CssOptions.prototype.className = 'active';

    return CssOptions;

  }).call(this);

  
  // Configuration class for date bindings

  this.Maslosoft.Binder.DateOptions = (function() {
    class DateOptions extends this.Maslosoft.Binder.Options {};

    
    // Language for locale formatting
    // @var string

    DateOptions.prototype.lang = 'en';

    // Date source format
    // @var string

    DateOptions.prototype.sourceFormat = 'unix';

    // Date display format
    // @var string

    DateOptions.prototype.displayFormat = 'YYYY-MM-DD';

    return DateOptions;

  }).call(this);

  
  // Configuration class for datetime bindings

  this.Maslosoft.Binder.DateTimeOptions = (function() {
    class DateTimeOptions extends this.Maslosoft.Binder.Options {};

    
    // Language for locale formatting
    // @var string

    DateTimeOptions.prototype.lang = 'en';

    // DateTime source format
    // @var string

    DateTimeOptions.prototype.sourceFormat = 'unix';

    // DateTime display format
    // @var string

    DateTimeOptions.prototype.displayFormat = 'YYYY-MM-DD hh:mm';

    return DateTimeOptions;

  }).call(this);

  
  // Configuration class for time bindings

  this.Maslosoft.Binder.TimeAgoOptions = (function() {
    class TimeAgoOptions extends this.Maslosoft.Binder.Options {};

    
    // Language for locale formatting
    // @var string

    TimeAgoOptions.prototype.lang = 'en';

    // Time source format
    // @var string

    TimeAgoOptions.prototype.sourceFormat = 'unix';

    // Time display format
    // @var string

    TimeAgoOptions.prototype.displayFormat = 'hh:mm';

    return TimeAgoOptions;

  }).call(this);

  
  // Configuration class for time bindings

  this.Maslosoft.Binder.TimeOptions = (function() {
    class TimeOptions extends this.Maslosoft.Binder.Options {};

    
    // Language for locale formatting
    // @var string

    TimeOptions.prototype.lang = 'en';

    // Time source format
    // @var string

    TimeOptions.prototype.sourceFormat = 'unix';

    // Time display format
    // @var string

    TimeOptions.prototype.displayFormat = 'hh:mm';

    return TimeOptions;

  }).call(this);

  
  // Configuration class for css bindings

  this.Maslosoft.Binder.ValidatorOptions = (function() {
    class ValidatorOptions extends this.Maslosoft.Binder.Options {};

    
    // Field for class name
    // @var string

    ValidatorOptions.prototype.classField = '_class';

    
    // CSS selector to find parent element
    // @var string

    ValidatorOptions.prototype.parentSelector = '.form-group';

    
    // Failed validation class name.
    // This class will be added to input if validation fails.
    // @var string

    ValidatorOptions.prototype.inputError = 'error';

    
    // Failed validation parent class name.
    // This class will be added to parent of input if validation fails.
    // @var string

    ValidatorOptions.prototype.parentError = 'has-error';

    
    // Warning validation class name.
    // This class will be added to input if validation has warnings.
    // @var string

    ValidatorOptions.prototype.inputWarning = 'warning';

    
    // Warning validation parent class name.
    // This class will be added to parent of input if validation has warnings.
    // @var string

    ValidatorOptions.prototype.parentWarning = 'has-warning';

    
    // Succeed validation class name.
    // This class will be added to input if validation succeds.
    // @var string

    ValidatorOptions.prototype.inputSuccess = 'success';

    
    // Succeed validation parent class name.
    // This class will be added to parent of input if validation succeds.
    // @var string

    ValidatorOptions.prototype.parentSuccess = 'has-success';

    
    // Selector for error messages. Will scope from input parent.
    // @var string

    ValidatorOptions.prototype.errorMessages = '.error-messages';

    
    // Selector for warning messages. Will scope from input parent.
    // @var string

    ValidatorOptions.prototype.warningMessages = '.warning-messages';

    return ValidatorOptions;

  }).call(this);

  this.Maslosoft.Binder.BaseValidator = (function() {
    class BaseValidator {
      constructor(config) {
        var index, value;
        this.reset();
        for (index in config) {
          value = config[index];
          this[index] = null;
          this[index] = value;
        }
      }

      reset() {
        // Dereference/reset
        this.messages = new Array();
        this.rawMessages = new Object();
        this.warningMessages = new Array();
        return this.rawWarningMessages = new Object();
      }

      isValid() {
        throw new Error('Validator must implement `isValid` method');
      }

      getErrors() {
        return this.messages;
      }

      getWarnings() {
        return this.warningMessages;
      }

      
      // Add error message with optional substitution params.

      // Simple example:
      // ```coffee
      // @addError('My error message')
      //	```

      // Automatic substitution with label example:
      // ```coffee
      // @addError('Attribute {attribute} message')
      //	```

      // Will add error message: 'Attribute My attribute message'

      // Substitution with params example:
      // ```coffee
      // @addError('Attribute {name} message', {name: 'John'})
      //	```

      // Will add error message: 'Attribute John message'

      addError(errorMessage, params) {
        var name, rawMessage, ref1, ref2, value;
        // Raw is required for uniquness, see method end
        rawMessage = errorMessage;
        // Apply atribute label first
        errorMessage = errorMessage.replace("{attribute}", this.label);
        ref1 = this;
        // Apply from current validator
        for (name in ref1) {
          value = ref1[name];
          errorMessage = errorMessage.replace(`{${name}}`, value);
        }
// Apply from params
        for (name in params) {
          value = params[name];
          errorMessage = errorMessage.replace(`{${name}}`, value);
        }
        ref2 = this.model;
        // Finally try to apply from model
        for (name in ref2) {
          value = ref2[name];
          errorMessage = errorMessage.replace(`{${name}}`, value);
        }
        // Ensure uniquness
        if (!this.rawMessages[rawMessage]) {
          this.messages.push(errorMessage);
          return this.rawMessages[rawMessage] = true;
        }
      }

      
      // Add warning message with optional substitution params.

      // Simple example:
      // ```coffee
      // @addWarning('My error message')
      //	```

      // Automatic substitution with label example:
      // ```coffee
      // @addWarning('Attribute {attribute} message')
      //	```

      // Will add warning message: 'Attribute My attribute message'

      // Substitution with params example:
      // ```coffee
      // @addWarning('Attribute {name} message', {name: 'John'})
      //	```

      // Will add warning message: 'Attribute John message'

      addWarning(warningMessage, params) {
        var name, rawMessage, ref1, ref2, value;
        // Raw is required for uniquness, see method end
        rawMessage = warningMessage;
        // Apply atribute label first
        warningMessage = warningMessage.replace("{attribute}", this.label);
        ref1 = this;
        // Apply from current validator
        for (name in ref1) {
          value = ref1[name];
          warningMessage = warningMessage.replace(`{${name}}`, value);
        }
// Apply from params
        for (name in params) {
          value = params[name];
          warningMessage = warningMessage.replace(`{${name}}`, value);
        }
        ref2 = this.model;
        // Finally try to apply from model
        for (name in ref2) {
          value = ref2[name];
          warningMessage = warningMessage.replace(`{${name}}`, value);
        }
        // Ensure uniquness
        if (!this.rawWarningMessages[rawMessage]) {
          this.warningMessages.push(warningMessage);
          return this.rawWarningMessages[rawMessage] = true;
        }
      }

    };

    BaseValidator.prototype.label = '';

    BaseValidator.prototype.model = null;

    BaseValidator.prototype.messages = [];

    BaseValidator.prototype.rawMessages = [];

    BaseValidator.prototype.warningMessages = [];

    BaseValidator.prototype.rawWarningMessages = [];

    return BaseValidator;

  }).call(this);

  
  // CSS class binding
  // This adds class from options if value is true

  ref1 = this.Maslosoft.Binder.CssClass = (function() {
    class CssClass extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.update = this.update.bind(this);
      }

      update(element, valueAccessor) {
        var value;
        boundMethodCheck(this, ref1);
        value = this.getValue(valueAccessor);
        if (!!value) {
          ko.utils.toggleDomNodeCssClass(element, this.options.className, true);
        } else {
          ko.utils.toggleDomNodeCssClass(element, this.options.className, false);
        }
      }

    };

    CssClass.prototype.writable = false;

    return CssClass;

  }).call(this);

  
  // CSS class binding
  // This adds class from options if value is true

  ref2 = this.Maslosoft.Binder.CssColumnsBase = (function() {
    class CssColumnsBase extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.applyColumns = this.applyColumns.bind(this);
      }

      applyColumns(element, sizes, config) {
        var name, newClasses, re, reName, size;
        boundMethodCheck(this, ref2);
        newClasses = [];
        for (size in config) {
          name = config[size];
          // Remove previously set classes
          reName = name.replace('{num}', '\\d');
          name = name.replace('{num}', '');
          re = new RegExp(`(?:^|\\s)${reName}+(?!\\S)`, 'g');
          element.className = element.className.replace(re, '');
          newClasses.push(name + sizes[size]);
        }
        jQuery(element).addClass(newClasses.join(' '));
      }

    };

    CssColumnsBase.prototype.writable = false;

    return CssColumnsBase;

  }).call(this);

  
  // Moment formatter class

  ref3 = this.Maslosoft.Binder.MomentFormatter = class MomentFormatter extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, viewModel) {
      boundMethodCheck(this, ref3);
      moment.locale(this.options.lang);
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var value;
      boundMethodCheck(this, ref3);
      value = this.getValue(valueAccessor);
      if (!value) {
        element.innerHTML = '';
        return;
      }
      element.innerHTML = moment[this.options.sourceFormat](value).format(this.options.displayFormat);
    }

  };

  
  // Base class for date/time pickers

  this.Maslosoft.Binder.Picker = class Picker extends this.Maslosoft.Binder.Base {};

  
  // Base class for video related bindings

  ref4 = this.Maslosoft.Binder.Video = (function() {
    var adapters, options;

    class Video extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        
        // Check is supported video url
        // @param url string
        // @return false|object

        this.isVideoUrl = this.isVideoUrl.bind(this);
        
        // Will set image src attribute to video thumbnail,
        // or element background-image style if it's not image
        // @param url string
        // @param element DomElement

        this.setThumb = this.setThumb.bind(this);
      }

      isVideoUrl(url) {
        var adapter, j, len;
        boundMethodCheck(this, ref4);
        for (j = 0, len = adapters.length; j < len; j++) {
          adapter = adapters[j];
          if (adapter.match(url)) {
            return adapter;
          }
        }
        return false;
      }

      setThumb(url, element) {
        var ad, adapter, thumbCallback;
        boundMethodCheck(this, ref4);
        if (adapter = this.isVideoUrl(url)) {
          thumbCallback = function(src) {
            if (element.tagName.toLowerCase() === 'img') {
              return element.src = src;
            } else {
              return jQuery(element).css('background-image', `url('${src}')`);
            }
          };
          console.log(url);
          // Init adapter
          ad = new adapter();
          ad.setUrl(url);
          return ad.setThumb(thumbCallback);
        }
      }

    };

    options = null;

    adapters = null;

    jQuery(document).ready(function() {
      // Initalize thumbnails adapters
      options = new Maslosoft.Playlist.Options();
      // Set adapters from options
      return adapters = options.adapters;
    });

    return Video;

  }).call(this);

  ref5 = this.Maslosoft.Binder.WidgetUrl = class WidgetUrl extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.createUrl = this.createUrl.bind(this);
      this.setRel = this.setRel.bind(this);
    }

    getData(element, valueAccessor, allBindings, bindingName) {
      var bindingParams, data, src;
      src = this.getValue(valueAccessor);
      data = {};
      data.id = allBindings.get('widgetId') || src.id;
      if (allBindings.get('widget')) {
        data.id = allBindings.get('widget').id;
      }
      data[bindingName] = allBindings.get(bindingName) || src[bindingName];
      // Need to check for undefined here,
      // as params might be `0` or `` or `false`
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
    }

    createUrl(widgetId, action, params, terminator) {
      var args, href, name, value;
      boundMethodCheck(this, ref5);
      args = [];
      if (typeof params === 'string' || typeof params === 'number') {
        // Skip empty strings
        if (params !== "" || typeof params === 'number') {
          args.push("" + params);
        }
      } else {
        for (name in params) {
          value = params[name];
          name = encodeURIComponent("" + name);
          value = encodeURIComponent("" + value);
          args.push(`${name}:${value}`);
        }
      }
      href = `${terminator}${widgetId}.${action}`;
      if (args.length === 0) {
        return href;
      } else {
        args = args.join(',', args);
        return `${href}=${args}`;
      }
    }

    setRel(element) {
      var hasRel, isPlain, j, len, rel, relValue, rels;
      boundMethodCheck(this, ref5);
      hasRel = false;
      isPlain = false;
      rels = [];
      rel = element.getAttribute('rel');
      if (rel) {
        rels = rel.split(' ');
        for (j = 0, len = rels.length; j < len; j++) {
          relValue = rels[j];
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
    }

  };

  
  // Acl binding
  // This adds class from options if value is true

  ref6 = this.Maslosoft.Binder.Acl = (function() {
    var allow;

    class Acl extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init() {
        boundMethodCheck(this, ref6);
        if (!Maslosoft.Binder.Acl.allow) {
          throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions");
        }
        if (typeof Maslosoft.Binder.Acl.allow !== 'function') {
          throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions");
        }
      }

      update(element, valueAccessor) {
        var acl, value;
        boundMethodCheck(this, ref6);
        acl = this.getValue(valueAccessor);
        value = Maslosoft.Binder.Acl.allow(acl);
        // Forward to visible
        return ko.bindingHandlers.visible.update(element, function() {
          return value;
        });
      }

    };

    allow = null;

    return Acl;

  }).call(this);

  
  // Disabled binding
  // This adds class from options if value is true

  this.Maslosoft.Binder.Active = class Active extends this.Maslosoft.Binder.CssClass {
    constructor(options) {
      super(new Maslosoft.Binder.CssOptions({
        className: 'active'
      }));
    }

  };

  
  // Asset binding handler

  ref7 = this.Maslosoft.Binder.Asset = class Asset extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var $element, date, extra, height, model, proportional, sec, src, url, width;
      boundMethodCheck(this, ref7);
      $element = $(element);
      // Get dimensions defined by other bindings
      width = allBindings.get('w' || allBindings.get('width' || null));
      height = allBindings.get('h' || allBindings.get('height' || null));
      // Get proportional flag if set
      proportional = allBindings.get('p' || allBindings.get('proportional' || null));
      model = this.getValue(valueAccessor);
      extra = this.getValue(allBindings);
      // Try to get timestamp
      if (model.updateDate) {
        date = model.updateDate;
        if (typeof date === 'number') {
          sec = date;
        }
        if (typeof date.sec === 'number') {
          sec = date.sec;
        }
      }
      url = model.url;
      // Create new url including width, height and if it should cropped proportionally
      src = [];
      // Add base url of asset
      src.push(url);
      // Add width
      if (width) {
        src.push(`w/${width}`);
      }
      // Add height
      if (height) {
        src.push(`h/${height}`);
      }
      // Crop to provided dimensions if not proportional
      if (proportional === false) {
        src.push("p/0");
      }
      // Add timestamp
      if (sec) {
        src.push(sec);
      }
      // Join parts of url
      src = src.join('/');
      if ($element.attr("src") !== src) {
        if (extra.preloader) {
          $element.attr('src', extra.preloader);
        }
        // Preload image
        preload($element, src);
      }
    }

  };

  
  // Enum css class handler

  ref8 = this.Maslosoft.Binder.CssClasses = class CssClasses extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.getClassList = this.getClassList.bind(this);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    getClassList(valueAccessor) {
      var classList, classes;
      boundMethodCheck(this, ref8);
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
    }

    init(element, valueAccessor) {
      var initialClasses;
      boundMethodCheck(this, ref8);
      initialClasses = this.getClassList(valueAccessor);
      return element.setAttribute('data-css-classes', initialClasses);
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var classesToAdd, toRemove;
      boundMethodCheck(this, ref8);
      toRemove = element.getAttribute('data-css-classes');
      ko.utils.toggleDomNodeCssClass(element, toRemove, false);
      classesToAdd = this.getClassList(valueAccessor);
      if (classesToAdd) {
        ko.utils.toggleDomNodeCssClass(element, classesToAdd, true);
      }
      return element.setAttribute('data-css-classes', classesToAdd);
    }

  };

  
  // Enum css class handler

  ref9 = this.Maslosoft.Binder.CssColumns = (function() {
    class CssColumns extends this.Maslosoft.Binder.CssColumnsBase {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor) {
        boundMethodCheck(this, ref9);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var cols, columns, name, ref10, size, sizes, value;
        boundMethodCheck(this, ref9);
        columns = this.getValue(valueAccessor);
        sizes = {};
        ref10 = CssColumns.columns;
        for (size in ref10) {
          name = ref10[size];
          value = parseInt(columns[size]);
          cols = parseInt(12 / value);
          sizes[size] = cols;
        }
        return this.applyColumns(element, sizes, CssColumns.columns);
      }

    };

    CssColumns.columns = {
      'xs': 'col-xs-{num}',
      'sm': 'col-sm-{num}',
      'md': 'col-md-{num}',
      'lg': 'col-lg-{num}'
    };

    return CssColumns;

  }).call(this);

  
  // Enum css class handler

  ref10 = this.Maslosoft.Binder.CssColumnSizes = (function() {
    class CssColumnSizes extends this.Maslosoft.Binder.CssColumnsBase {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor) {
        boundMethodCheck(this, ref10);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var sizes;
        boundMethodCheck(this, ref10);
        sizes = this.getValue(valueAccessor);
        return this.applyColumns(element, sizes, CssColumnSizes.columns);
      }

    };

    CssColumnSizes.columns = {
      'xs': 'col-xs-{num}',
      'sm': 'col-sm-{num}',
      'md': 'col-md-{num}',
      'lg': 'col-lg-{num}'
    };

    return CssColumnSizes;

  }).call(this);

  
  // Data binding handler

  this.Maslosoft.Binder.Data = class Data extends this.Maslosoft.Binder.Base {
    getNamespacedHandler(binding) {
      return {
        update: (element, valueAccessor) => {
          var ref11, value;
          value = this.getValue(valueAccessor);
          if ((ref11 = typeof value) !== 'string' && ref11 !== 'number') {
            value = JSON.stringify(value);
          }
          return element.setAttribute('data-' + binding, value);
        }
      };
    }

  };

  
  // Model binding handler
  // This is to bind selected model properties to data-model field

  ref11 = this.Maslosoft.Binder.DataModel = class DataModel extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var field, fields, j, len, model, modelStub, results;
      boundMethodCheck(this, ref11);
      
      // Setup binding
      model = this.getValue(valueAccessor);
      fields = allBindings.get("fields") || null;
      // Bind all fields if not set `fields` binding
      if (fields === null) {
        this.bindModel(element, model);
        return;
      }
      // Bind only selected fields
      modelStub = {};
      results = [];
      for (j = 0, len = fields.length; j < len; j++) {
        field = fields[j];
        // Filter out undefined model fields
        if (typeof model[field] === 'undefined') {
          warn(`Model field \`${field}\` is undefined on element:`, element);
        } else {
          modelStub[field] = model[field];
        }
        results.push(this.bindModel(element, modelStub));
      }
      return results;
    }

    bindModel(element, model) {
      var modelString, ref12;
      // Do not stringify scalars
      if ((ref12 = typeof value) !== 'string' && ref12 !== 'number') {
        modelString = JSON.stringify(model);
      }
      return element.setAttribute('data-model', modelString);
    }

  };

  
  // Date formatter

  this.Maslosoft.Binder.DateFormatter = class DateFormatter extends this.Maslosoft.Binder.MomentFormatter {
    constructor(options) {
      super(new Maslosoft.Binder.DateOptions(options));
    }

  };

  /*
  Date picker
  */
  ref12 = this.Maslosoft.Binder.DatePicker = class DatePicker extends this.Maslosoft.Binder.Picker {
    constructor(options) {
      super(new Maslosoft.Binder.DateOptions(options));
      this.updateModel = this.updateModel.bind(this);
      
      // Get display value from model value according to formatting options
      // @param string|int value
      // @return string|int

      this.getDisplayValue = this.getDisplayValue.bind(this);
      
      // Get model value from model value according to formatting options
      // @param string|int value
      // @return string|int

      this.getModelValue = this.getModelValue.bind(this);
      
      // Initialize datepicker

      this.init = this.init.bind(this);
      
      // Update input after model change

      this.update = this.update.bind(this);
    }

    getData(valueAccessor) {
      var value;
      if (!valueAccessor) {
        return '';
      }
      // Verbose syntax, at least {data: data}
      value = this.getValue(valueAccessor) || [];
      if (value.data) {
        return value.data;
      }
      return value;
    }

    getOptions(allBindingsAccessor) {
      var config, name, options, value;
      options = {
        lang: this.options.lang,
        sourceFormat: this.options.sourceFormat,
        displayFormat: this.options.displayFormat,
        // Format of pickadate is not compatible of this of moment
        format: this.options.displayFormat.toLowerCase(),
        forceParse: false,
        todayHighlight: true,
        showOnFocus: false
      };
      config = allBindingsAccessor.get('dateOptions') || [];
      
      // Only in long notation set options
      if (config) {
        for (name in config) {
          value = config[name];
          // Skip data
          if (name === 'data') {
            continue;
          }
          // Skip template
          if (name === 'template') {
            continue;
          }
          // Special treatment for display format
          if (name === 'format') {
            options.displayFormat = value.toUpperCase();
          }
          options[name] = value;
        }
      }
      return options;
    }

    updateModel(element, valueAccessor, allBindings) {
      var accessor, elementValue, modelValue, options;
      boundMethodCheck(this, ref12);
      options = this.getOptions(allBindings);
      modelValue = this.getData(valueAccessor);
      elementValue = this.getModelValue(element.value, options);
      accessor = valueAccessor();
      // Update only if changed
      if (modelValue !== elementValue) {
        if (accessor && accessor.data) {
          return ko.expressionRewriting.writeValueToProperty(ko.unwrap(valueAccessor()).data, allBindings, 'datePicker.data', elementValue);
        } else {
          return ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue);
        }
      }
    }

    getDisplayValue(value, options) {
      var inputValue;
      boundMethodCheck(this, ref12);
      //console.log value
      if (!value) {
        return '';
      }
      if (value && value.length === 0) {
        return '';
      }
      if (options.sourceFormat === 'unix') {
        inputValue = moment.unix(value).format(options.displayFormat);
      } else {
        inputValue = moment(value, options.sourceFormat).format(options.displayFormat);
      }
      return inputValue;
    }

    getModelValue(value, options) {
      var modelValue;
      boundMethodCheck(this, ref12);
      if (!value) {
        return null;
      }
      if (options.sourceFormat === 'unix') {
        modelValue = moment(value, options.displayFormat).unix();
      } else {
        modelValue = moment(value, options.displayFormat).format(options.sourceFormat);
      }
      return modelValue;
    }

    init(element, valueAccessor, allBindingsAccessor, viewModel) {
      var addon, input, isOpen, onChange, onChangeValue, options, template, trigger, value;
      boundMethodCheck(this, ref12);
      options = this.getOptions(allBindingsAccessor);
      value = this.getDisplayValue(this.getData(valueAccessor), options);
      //console.log value
      if (!value) {
        element.value = '';
      } else {
        element.value = value;
      }
      input = jQuery(element);
      if (options.template) {
        template = options.template;
      } else {
        template = `<div class="input-group-addon">
	<a class="picker-trigger-link" style="cursor: pointer;">
		<i class="glyphicon glyphicon-calendar"></i>
	</a>
</div>`;
      }
      addon = jQuery(template);
      addon.insertBefore(input);
      trigger = addon.find('a.picker-trigger-link');
      input.datepicker(options);
      // Trigger only when value has changed, but do not update
      // picker, ie someone is typing-in date
      onChangeValue = (e) => {
        value = input.datepicker('getDate');
        //console.log value, element.value
        if (value) {
          this.updateModel(element, valueAccessor, allBindingsAccessor);
        }
        //console.log 'Changing model... onChangeValue'
        return false;
      };
      // When date is changed and change is confirmed
      onChange = (e) => {
        var parsedDate;
        parsedDate = Date.parse(element.value);
        if (parsedDate && !e.isTrigger) {
          element.value = this.getDisplayValue(Math.round(parsedDate.getTime() / 1000), options);
          this.updateModel(element, valueAccessor, allBindingsAccessor);
          input.datepicker('update');
          return true;
        }
        return false;
      };
      // Don't trigger picker change date, as date need to be parsed by datejs
      input.on('changeDate', (e) => {
        onChangeValue(e);
        return true;
      });
      // Here is actual date change handling
      input.on('change', onChange);
      input.on('blur', onChange);
      // Handle opened state
      isOpen = false;
      input.on('show', (e) => {
        return isOpen = true;
      });
      input.on('hide', (e) => {
        return isOpen = false;
      });
      // Need mousedown or will no hide on second click
      trigger.on('mousedown', function(e) {
        if (isOpen) {
          input.datepicker('hide');
        } else {
          input.datepicker('show');
        }
        e.stopPropagation();
        e.preventDefault();
      });
    }

    update(element, valueAccessor, allBindingsAccessor) {
      var options, val, value;
      boundMethodCheck(this, ref12);
      val = valueAccessor();
      if (val && val.data) {
        ko.utils.setTextContent(element, val.data);
      } else {
        ko.utils.setTextContent(element, val);
      }
      options = this.getOptions(allBindingsAccessor);
      value = this.getDisplayValue(this.getData(valueAccessor), options);
      if (element.value !== value) {
        return element.value = value;
      }
    }

  };

  /*
  One-way date/time formatter
  */
  this.Maslosoft.Binder.DateTimeFormatter = class DateTimeFormatter extends this.Maslosoft.Binder.MomentFormatter {
    constructor(options) {
      super(new Maslosoft.Binder.DateTimeOptions(options));
    }

  };

  
  // One-way decimal formatter

  ref13 = this.Maslosoft.Binder.DecimalFormatter = (function() {
    class DecimalFormatter extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor, allBindingsAccessor, viewModel) {
        boundMethodCheck(this, ref13);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var bound, config, formatted, j, len, name, names, value;
        boundMethodCheck(this, ref13);
        value = this.getValue(valueAccessor) || 0;
        value = parseFloat(value);
        config = {};
        names = ['precision', 'decimalSeparator', 'thousandSeparator', 'suffix', 'prefix'];
        for (j = 0, len = names.length; j < len; j++) {
          name = names[j];
          // Set global value
          config[name] = this[name];
          
          // Try to set value from bindings
          bound = allBindingsAccessor.get(name);
          if (typeof bound !== 'undefined') {
            config[name] = this.getValue(bound);
          }
        }
        formatted = numberFormat(value, config.precision, 3, config.thousandSeparator, config.decimalSeparator);
        return element.innerHTML = config.prefix + formatted + config.suffix;
      }

    };

    DecimalFormatter.prototype.precision = 2;

    DecimalFormatter.prototype.decimalSeparator = ',';

    DecimalFormatter.prototype.thousandSeparator = ' ';

    DecimalFormatter.prototype.suffix = '';

    DecimalFormatter.prototype.prefix = '';

    return DecimalFormatter;

  }).call(this);

  
  // Disabled binding
  // This adds class from options if value is true

  this.Maslosoft.Binder.Disabled = class Disabled extends this.Maslosoft.Binder.CssClass {
    constructor(options) {
      super(new Maslosoft.Binder.CssOptions({
        className: 'disabled'
      }));
    }

  };

  
  // Enum css class handler

  ref14 = this.Maslosoft.Binder.EnumCssClassFormatter = class EnumCssClassFormatter extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var config, j, len, name, re, ref15;
      boundMethodCheck(this, ref14);
      config = this.getValue(valueAccessor);
      ref15 = config.values;
      
      // Remove previously set classes
      for (j = 0, len = ref15.length; j < len; j++) {
        name = ref15[j];
        re = new RegExp(`(?:^|\\s)${name}(?!\\S)`, 'g');
        element.className = element.className.replace(re, '');
      }
      element.className += ' ' + config.values[config.data];
    }

  };

  
  // Enum binding handler

  ref15 = this.Maslosoft.Binder.EnumFormatter = class EnumFormatter extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var config;
      boundMethodCheck(this, ref15);
      config = this.getValue(valueAccessor);
      if (typeof config.values[config.data] !== 'undefined') {
        element.innerHTML = config.values[config.data];
      } else {
        element.innerHTML = config.data;
      }
    }

  };

  
  // Eval binding handler

  ref16 = this.Maslosoft.Binder.Eval = class Eval extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor) {
      var allowBindings;
      boundMethodCheck(this, ref16);
      // Let bindings proceed as normal *only if* my value is false
      allowBindings = this.getValue(valueAccessor);
      console.log(allowBindings);
      return {
        controlsDescendantBindings: !allowBindings
      };
    }

    update(element, valueAccessor) {
      var allowBindings;
      boundMethodCheck(this, ref16);
      // Let bindings proceed as normal *only if* my value is false
      allowBindings = this.getValue(valueAccessor);
      console.log(allowBindings);
      return {
        controlsDescendantBindings: !allowBindings
      };
    }

  };

  
  // Fancytree binding
  // TODO Allow sytaxes:
  // data-bind="fancytree: data"
  // data-bind="fancytree: {data: data}"
  // data-bind="fancytree: {data: data, options: <fancyTree-options>, autoExpand: true|false}"
  // TODO When using two or more trees from same data, only first one works properly

  ref17 = this.Maslosoft.Binder.Fancytree = (function() {
    class Fancytree extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.handle = this.handle.bind(this);
        this.update = this.update.bind(this);
      }

      getData(valueAccessor) {
        var value;
        // Verbose syntax, at least {data: data}
        value = this.getValue(valueAccessor) || [];
        if (value.data) {
          return value.data;
        }
        return value;
      }

      init(element, valueAccessor, allBindingsAccessor, context) {
        var dnd, drag, events, folderIcon, nodeIcon, nodeRenderer, options, renderer, tree, treeEvents;
        boundMethodCheck(this, ref17);
        tree = this.getData(valueAccessor);
        // Tree options
        options = valueAccessor().options || {};
        events = this.getValue(valueAccessor).on || false;
        // Effects makes updates flickering, disable
        options.toggleEffect = false;
        options.source = tree.children;
        options.extensions = [];
        // Events
        treeEvents = new TreeEvents(tree, events, options);
        // Accessors for dnd and draggable
        dnd = valueAccessor().dnd || false;
        drag = valueAccessor().drag || false;
        if (dnd && drag) {
          throw new Error('Cannot use both `dnd` and `drag`');
        }
        // DND
        if (dnd) {
          options.autoScroll = false;
          options.extensions.push('dnd');
          options.dnd = new TreeDnd(tree, element, treeEvents);
        }
        
        // Draggable only
        if (drag) {
          options.autoScroll = false;
          options.extensions.push('dnd');
          options.dnd = new TreeDrag(tree, element);
        }
        // Node icon and renderer
        nodeIcon = valueAccessor().nodeIcon || false;
        folderIcon = valueAccessor().folderIcon || false;
        nodeRenderer = valueAccessor().nodeRenderer || false;
        
        // Folder icon option
        if (folderIcon && !nodeIcon) {
          warn("Option `folderIcon` require also `nodeIcon` or it will not work at all");
        }
        if (nodeIcon || nodeRenderer) {
          // Disable tree icon, as custom renderer will be used
          if (nodeIcon) {
            options.icon = false;
          }
          
          // Create internal renderer instance
          renderer = new TreeNodeRenderer(tree, options, nodeIcon, folderIcon);
          
          // Custom title renderer
          if (nodeRenderer) {
            renderer.setRenderer(new nodeRenderer(tree, options));
          }
          options.renderNode = renderer.render;
        }
        return jQuery(element).fancytree(options);
      }

      handle(element, valueAccessor, allBindingsAccessor) {
        var config, handler;
        boundMethodCheck(this, ref17);
        config = this.getValue(valueAccessor);
        element = jQuery(element);
        handler = () => {
          if (!element.find('.ui-fancytree').length) {
            return;
          }
          element.fancytree('option', 'source', this.getData(valueAccessor).children);
          // Autoexpand handling
          if (config.autoExpand) {
            element.fancytree('getRootNode').visit(function(node) {
              return node.setExpanded(true);
            });
          }
          return element.focus();
        };
        // Put rendering to end of queue to ensure bindings are evaluated
        return setTimeout(handler, 0);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        boundMethodCheck(this, ref17);
        return this.handle(element, valueAccessor, allBindingsAccessor);
      }

    };

    Fancytree.prototype.tree = null;

    Fancytree.prototype.element = null;

    return Fancytree;

  }).call(this);

  
  // One-way file size formatter

  ref18 = this.Maslosoft.Binder.FileSizeFormatter = (function() {
    class FileSizeFormatter extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor, allBindingsAccessor, viewModel) {
        boundMethodCheck(this, ref18);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var binary, decimal, format, step, value;
        boundMethodCheck(this, ref18);
        value = this.getValue(valueAccessor) || 0;
        
        // TODO This should also be configurable via at binding

        binary = this.binary;
        decimal = !this.binary;
        if (binary) {
          step = 1024;
        }
        if (decimal) {
          step = 1000;
        }
        format = (bytes) => {
          var i, units;
          bytes = parseInt(bytes);
          if (bytes < step) {
            return bytes + ' B';
          }
          i = -1;
          if (binary) {
            units = this.units.binary;
          }
          if (decimal) {
            units = this.units.decimal;
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
            return Math.max(bytes, 0.1).toFixed(1) + ` ~*${i * step} * ${step} B`;
          }
        };
        return element.innerHTML = format(value);
      }

    };

    FileSizeFormatter.prototype.units = {
      binary: ["kiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"],
      decimal: ["kB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]
    };

    FileSizeFormatter.prototype.binary = true;

    return FileSizeFormatter;

  }).call(this);

  
  // GMap3 binding
  // TODO Allow syntax:
  // data-bind="googleMap: config"
  // TODO When using two or more trees from same data, only first one works properly

  ref19 = this.Maslosoft.Binder.GoogleMap = class GoogleMap extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
      this.apply = this.apply.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, viewModel) {
      boundMethodCheck(this, ref19);
      return this.apply(element, this.getValue(valueAccessor));
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      boundMethodCheck(this, ref19);
      return this.apply(element, this.getValue(valueAccessor));
    }

    apply(element, cfg) {
      var latLng, map, mapOptions, markerCfg;
      boundMethodCheck(this, ref19);
      console.log(element, cfg);
      latLng = new google.maps.LatLng(cfg.lat, cfg.lng);
      mapOptions = {
        zoom: cfg.zoom,
        center: latLng,
        mapTypeId: cfg.type
      };
      map = new google.maps.Map(element, mapOptions);
      if (cfg.markers) {
        markerCfg = {
          position: latLng,
          map: map
        };
        return new google.maps.Marker(markerCfg);
      }
    }

  };

  
  // Hidden binding handler, opposite to visible

  ref20 = this.Maslosoft.Binder.Hidden = class Hidden extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor) {
      var value;
      boundMethodCheck(this, ref20);
      value = !this.getValue(valueAccessor);
      return ko.bindingHandlers.visible.update(element, function() {
        return value;
      });
    }

  };

  
  // Href binding handler

  ref21 = this.Maslosoft.Binder.Href = (function() {
    var bustLinks;

    class Href extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor, allBindingsAccessor) {
        var href, stopPropagation;
        boundMethodCheck(this, ref21);
        href = this.getValue(valueAccessor);
        // Add href attribute if binding have some value
        if (!element.href && href) {
          ensureAttribute(element, 'href');
        }
        bustLinks(element);
        // Stop propagation handling
        stopPropagation = allBindingsAccessor.get('stopPropagation') || false;
        if (stopPropagation) {
          return ko.utils.registerEventHandler(element, "click", function(e) {
            return e.stopPropagation();
          });
        }
      }

      update(element, valueAccessor, allBindings) {
        var href, target;
        boundMethodCheck(this, ref21);
        bustLinks(element);
        href = this.getValue(valueAccessor);
        if (href) {
          target = allBindings.get('target') || '';
          // Ensure attribute
          ensureAttribute(element, 'href');
          ensureAttribute(element, 'target');
          if (element.getAttribute('href') !== href) {
            element.setAttribute('href', href);
          }
          if (element.getAttribute('target') !== target) {
            return element.setAttribute('target', target);
          }
        } else {
          // Remove attribute if empty
          return element.removeAttribute('href');
        }
      }

    };

    bustLinks = function(element) {
      var defer;
      // Skip on non anchor elements
      if (element.tagName.toLowerCase() !== 'a') {
        return;
      }
      defer = function() {
        var $il, innerLink, j, len, ref22, results;
        ref22 = jQuery(element).find('a');
        results = [];
        for (j = 0, len = ref22.length; j < len; j++) {
          innerLink = ref22[j];
          $il = jQuery(innerLink);
          results.push($il.replaceWith($il.contents()));
        }
        return results;
      };
      return setTimeout(defer, 0);
    };

    return Href;

  }).call(this);

  
  // HTML improved binding handler

  ref22 = this.Maslosoft.Binder.Html = class Html extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {
      return {
        'controlsDescendantBindings': true
      };
    }

    update(element, valueAccessor, allBindings, context) {
      var configuration, pm, value;
      boundMethodCheck(this, ref22);
      // setHtml will unwrap the value if needed
      value = this.getValue(valueAccessor);
      configuration = this.getValue(allBindings).plugins;
      pm = new PluginsManager(element);
      pm.from(configuration);
      value = pm.getElementValue(element, value);
      return ko.utils.setHtml(element, value);
    }

  };

  
  // Html tree binding

  // This simpy builds a nested ul>li struct

  // data-bind="htmlTree: data"

  ref23 = this.Maslosoft.Binder.HtmlTree = class HtmlTree extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    static drawNode(data) {
      var child, childWrapper, j, len, node, ref24, title;
      // wrapper = document.createElement 'ul'
      title = document.createElement('li');
      title.innerHTML = data.title;
      // wrapper.appendChild title
      if (data.children && data.children.length > 0) {
        childWrapper = document.createElement('ul');
        ref24 = data.children;
        for (j = 0, len = ref24.length; j < len; j++) {
          node = ref24[j];
          child = HtmlTree.drawNode(node);
          childWrapper.appendChild(child);
        }
        title.appendChild(childWrapper);
      }
      return title;
    }

    getData(valueAccessor) {
      var value;
      // Verbose syntax, at least {data: data}
      value = this.getValue(valueAccessor) || [];
      if (value.data) {
        return this.getValue(value.data) || [];
      }
      return value;
    }

    update(element, valueAccessor, allBindingsAccessor, viewModel) {
      var data, handler;
      boundMethodCheck(this, ref23);
      data = this.getValue(valueAccessor);
      warn("HtmlTree is experimental, do not use");
      handler = () => {
        var nodes;
        nodes = HtmlTree.drawNode(data);
        element.innerHTML = '';
        return element.appendChild(nodes);
      };
      // Put rendering to end of queue to ensure bindings are evaluated
      return setTimeout(handler, 0);
    }

  };

  
  // Html value binding
  // WARNING This MUST have parent context, or will not work

  ref24 = this.Maslosoft.Binder.HtmlValue = (function() {
    var idCounter;

    class HtmlValue extends this.Maslosoft.Binder.Base {
      constructor(options = {}) {
        super(options);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
        if (ko.bindingHandlers.sortable && ko.bindingHandlers.sortable.options) {
          // Allow `contenteditable` to get focus
          ko.bindingHandlers.sortable.options.cancel = ':input,button,[contenteditable]';
        }
      }

      
      // Get value of element, this can be overridden, see TextValue for example.
      // Will return inner html of element.

      // @param jQuery element
      // @return string

      getElementValue(element) {
        return element.innerHTML;
      }

      
      // Set value of element, this can be overridden, see TextValue for example
      // Value param should be valid html.

      // @param jQuery element
      // @param string

      setElementValue(element, value) {
        return element.innerHTML = value;
      }

      init(element, valueAccessor, allBindingsAccessor) {
        var configuration, deferHandler, dispose, handler, pm;
        boundMethodCheck(this, ref24);
        element.setAttribute('contenteditable', true);
        
        // Generate some id if not set, see notes below why
        if (!element.id) {
          element.id = `maslosoft-binder-htmlvalue-${idCounter++}`;
        }
        configuration = this.getValue(allBindingsAccessor).plugins;
        pm = new PluginsManager(element);
        pm.from(configuration);
        // Handle update immediately
        handler = () => {
          var accessor, elementValue, modelValue;
          // console.log("HTML Value Update", element)
          // On some situations element might be null (sorting), ignore this case
          if (!element) {
            return;
          }
          // This is required in some scenarios, specifically when sorting htmlValue elements
          element = document.getElementById(element.id);
          if (!element) {
            return;
          }
          accessor = valueAccessor();
          modelValue = this.getValue(valueAccessor);
          elementValue = this.getElementValue(element);
          if (ko.isWriteableObservable(accessor)) {
            // Update only if changed
            elementValue = pm.getModelValue(element, elementValue);
            if (modelValue !== elementValue) {
              //console.log "Write: #{modelValue} = #{elementValue}"
              return accessor(elementValue);
            }
          }
        };
        
        // Handle update, but push update to end of queue
        deferHandler = () => {
          return setTimeout(handler, 0);
        };
        
        // NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
        jQuery(element).on("keyup, input", handler);
        // This is to allow interaction with tools which could modify content, also to work with drag and drop
        jQuery(document).on("mouseup", deferHandler);
        jQuery(document).on("changed.htmlvalue", handler);
        dispose = function(toDispose) {
          jQuery(toDispose).off("keyup, input", handler);
          jQuery(document).off("mouseup", deferHandler);
          return jQuery(document).off("changed.htmlvalue", handler);
        };
        ko.utils.domNodeDisposal.addDisposeCallback(element, dispose);
      }

      update(element, valueAccessor, allBindings) {
        var configuration, pm, value;
        boundMethodCheck(this, ref24);
        value = this.getValue(valueAccessor);
        configuration = this.getValue(allBindings).plugins;
        pm = new PluginsManager(element);
        pm.from(configuration);
        value = pm.getElementValue(element, value);
        //console.log value
        if (this.getElementValue(element) !== value) {
          this.setElementValue(element, value);
        }
      }

    };

    
    // Counter for id generator
    // @private
    // @static

    idCounter = 0;

    return HtmlValue;

  }).call(this);

  
  // Icon binding handler
  // This is to select proper icon or scaled image thumbnail

  ref25 = this.Maslosoft.Binder.Icon = class Icon extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var $element, date, defaultSize, extra, fixedSize, iconField, isImage, isSvg, matched, model, nameSuffix, regex, size, src;
      boundMethodCheck(this, ref25);
      $element = $(element);
      model = this.getValue(valueAccessor);
      extra = this.getValue(allBindings);
      iconField = allBindings.get("iconField") || 'icon';
      if (!model) {
        if (console) {
          console.warn('Binding value for `icon` binding not defined, skipping. Element:');
          console.warn(element);
          console.warn((new Error()).stack);
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
      // Get icon size
      // TODO This should be configurable with options
      if (typeof model.iconSize === 'undefined') {
        defaultSize = 16;
      } else {
        defaultSize = model.iconSize;
      }
      size = allBindings.get("iconSize") || defaultSize;
      regex = new RegExp("/" + defaultSize + "/", "g");
      // Check if it's image
      // TODO This should be configurable with options
      if (typeof model.isImage === 'undefined') {
        isImage = true;
      } else {
        isImage = model.isImage;
      }
      // This is to not add scaling params for svg's
      if (isSvg) {
        isImage = false;
      }
      // TODO This must be configurable with options
      if (isImage) {
        // Get image thumbnail
        // End with /
        if (!src.match(new RegExp("/$"))) {
          src = src + '/';
        }
        // Dimensions are set
        if (src.match(new RegExp("/w/", "g"))) {
          src = src.replace(regex, "/" + size + "/");
        } else {
          // Dimensions are not set, set it here
          src = src + `w/${size}/h/${size}/p/0/`;
        }
        
        // Add timestamp if set
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
        // Calculate size steps for normal icons
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
      // Update src only if changed
      if ($element.attr("src") !== src) {
        if (extra.preloader) {
          $element.attr('src', extra.preloader);
        }
        preload($element, src);
      }
      // Set max image dimensions
      $element.css({
        width: `${size}px`,
        height: 'auto',
        maxWidth: '100%'
      });
    }

  };

  
  // Src binding handler

  ref26 = this.Maslosoft.Binder.Id = class Id extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element) {
      boundMethodCheck(this, ref26);
      return ensureAttribute(element, 'id');
    }

    update(element, valueAccessor) {
      var id;
      boundMethodCheck(this, ref26);
      id = this.getValue(valueAccessor);
      if (element.getAttribute('id') !== id) {
        return element.setAttribute('id', id);
      }
    }

  };

  
  // Log with element reference

  ref27 = this.Maslosoft.Binder.Log = class Log extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
      this.init = this.init.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      boundMethodCheck(this, ref27);
      return console.log(this.getValue(valueAccessor), element);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {
      boundMethodCheck(this, ref27);
      return console.log(this.getValue(valueAccessor), element);
    }

  };

  /*
  Date picker
  NOTE: Not recommended, as Pick A Date is not maintanted
  */
  ref28 = this.Maslosoft.Binder.PickaDate = class PickaDate extends this.Maslosoft.Binder.Picker {
    constructor(options) {
      super(new Maslosoft.Binder.DateOptions(options));
      this.updateModel = this.updateModel.bind(this);
      
      // Get display value from model value according to formatting options
      // @param string|int value
      // @return string|int

      this.getDisplayValue = this.getDisplayValue.bind(this);
      
      // Get model value from model value according to formatting options
      // @param string|int value
      // @return string|int

      this.getModelValue = this.getModelValue.bind(this);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    updateModel(element, valueAccessor, allBindings) {
      var elementValue, modelValue, val;
      boundMethodCheck(this, ref28);
      modelValue = this.getValue(valueAccessor);
      elementValue = this.getModelValue(element.value);
      if (ko.isWriteableObservable(valueAccessor) || true) {
        // Update only if changed
        if (modelValue !== elementValue) {
          ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue);
          return val = elementValue;
        }
      } else {

      }
    }

    getDisplayValue(value) {
      var inputValue;
      boundMethodCheck(this, ref28);
      if (this.options.sourceFormat === 'unix') {
        inputValue = moment.unix(value).format(this.options.displayFormat);
      } else {
        inputValue = moment(value, this.options.sourceFormat).format(this.options.displayFormat);
      }
      return inputValue;
    }

    getModelValue(value) {
      var modelValue;
      boundMethodCheck(this, ref28);
      if (this.options.sourceFormat === 'unix') {
        modelValue = moment(value, this.options.displayFormat).unix();
      } else {
        modelValue = moment(value, this.options.displayFormat).format(this.options.sourceFormat);
      }
      return modelValue;
    }

    init(element, valueAccessor, allBindingsAccessor, viewModel) {
      var $inputDate, events, inputValue, options, picker, pickerElement, pickerWrapper, template, textInput;
      boundMethodCheck(this, ref28);
      inputValue = this.getDisplayValue(this.getValue(valueAccessor));
      textInput = jQuery(element);
      textInput.val(inputValue);
      if (this.options.template) {
        template = this.options.template;
      } else {
        template = `<div class="input-group-addon">
	<a class="picker-trigger-link" style="cursor: pointer;">
		<i class="glyphicon glyphicon-calendar"></i>
	</a>
</div>`;
      }
      pickerWrapper = jQuery(template);
      pickerWrapper.insertAfter(textInput);
      pickerElement = pickerWrapper.find('a.picker-trigger-link');
      options = {
        // Format of pickadate is not compatible of this of moment
        format: this.options.displayFormat.toLowerCase(),
        selectMonths: true,
        selectYears: true
      };
      $inputDate = pickerElement.pickadate(options);
      picker = $inputDate.pickadate('picker');
      picker.on('set', () => {
        textInput.val(picker.get('value'));
        this.updateModel(element, valueAccessor, allBindingsAccessor);
      });
      events = {};
      // On change or other events (paste etc.)
      events.change = () => {
        var parsedDate;
        parsedDate = Date.parse(element.value);
        if (parsedDate) {
          picker.set('select', [parsedDate.getFullYear(), parsedDate.getMonth(), parsedDate.getDate()]);
          this.updateModel(element, valueAccessor, allBindingsAccessor);
        }
      };
      events.keyup = function(e) {
        if (e.which === 86 && e.ctrlKey) {
          events.change();
        }
      };
      events.mouseup = events.change;
      // Focus event of text input
      events.focus = () => {
        picker.open(false);
      };
      // Blur of text input
      events.blur = (e) => {
        // Don't hide picker when clicking picker itself
        if (e.relatedTarget) {
          return;
        }
        picker.close();
        this.updateModel(element, valueAccessor, allBindingsAccessor);
      };
      textInput.on(events);
      pickerElement.on('click', function(e) {
        var isOpen, root;
        root = jQuery(picker.$root[0]);
        // This seems to be only method
        // to discover if picker is really open
        isOpen = jQuery(root.children()[0]).height() > 0;
        if (isOpen) {
          picker.close();
        } else {
          picker.open(false);
        }
        e.stopPropagation();
        e.preventDefault();
      });
    }

    update(element, valueAccessor) {
      var value;
      boundMethodCheck(this, ref28);
      ko.utils.setTextContent(element, valueAccessor());
      value = this.getDisplayValue(this.getValue(valueAccessor));
      if (element.value !== value) {
        return element.value = value;
      }
    }

  };

  
  // Placeholder binding handler

  ref29 = this.Maslosoft.Binder.Placeholder = class Placeholder extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element) {
      boundMethodCheck(this, ref29);
      return ensureAttribute(element, 'placeholder');
    }

    update(element, valueAccessor) {
      var placeholder;
      boundMethodCheck(this, ref29);
      placeholder = this.getValue(valueAccessor);
      if (element.getAttribute('placeholder') !== placeholder) {
        // Clean up HTML
        placeholder = $("<div/>").html(placeholder).text();
        return element.setAttribute('placeholder', placeholder);
      }
    }

  };

  /*
  Select2
  */
  ref30 = this.Maslosoft.Binder.Select2 = (function() {
    var bindingName, dataBindingName, init, triggerChangeQuietly;

    class Select2 extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init() {
        var args, to;
        boundMethodCheck(this, ref30);
        args = arguments;
        to = function() {
          return init.apply(null, args);
        };
        return setTimeout(to, 0);
      }

      update(element, valueAccessor, allBindingsAccessor) {
        var copy, value;
        boundMethodCheck(this, ref30);
        return;
        value = this.getValue(valueAccessor);
        if (element.value !== value.data) {
          copy = JSON.parse(JSON.stringify(value.data));
          $(element).val(copy);
          return console.log("Update what?", element, value);
        }
      }

    };

    bindingName = 'select2';

    dataBindingName = `${bindingName}Data`;

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
      // Provide a hook for binding to the select2 "data" property; this property is read-only in select2 so not subscribing.
      if (ko.isWriteableObservable(allBindings[dataBindingName])) {
        dataChangeHandler = function() {
          if (!$(element).data('select2')) {
            return;
          }
          allBindings[dataBindingName]($(element).select2('data'));
        };
        $(element).on('change', dataChangeHandler);
      }
      // Apply select2
      $(element).select2(bindingValue);
      if (allBindings.selectedOptions) {
        $(element).val(allBindings.selectedOptions).trigger('change');
      }
      // Destroy select2 on element disposal
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

    return Select2;

  }).call(this);

  
  // Selected binding
  // This adds class from options if value is true

  this.Maslosoft.Binder.Selected = class Selected extends this.Maslosoft.Binder.CssClass {
    constructor(options) {
      super(new Maslosoft.Binder.CssOptions({
        className: 'selected'
      }));
    }

  };

  
  // Src binding handler

  ref31 = this.Maslosoft.Binder.Src = class Src extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element) {
      boundMethodCheck(this, ref31);
      return ensureAttribute(element, 'src');
    }

    update(element, valueAccessor) {
      var src;
      boundMethodCheck(this, ref31);
      src = this.getValue(valueAccessor);
      if (element.getAttribute('src') !== src) {
        return element.setAttribute('src', src);
      }
    }

  };

  /*
  Select2
  */
  ref32 = this.Maslosoft.Binder.Tags = (function() {
    var dropdownKillStyles, once;

    class Tags extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.setTags = this.setTags.bind(this);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      setTags(el, tags) {
        var index, j, len, opt, options, results, tag;
        boundMethodCheck(this, ref32);
        options = el.find('option');
        if (options.length) {
          options.remove();
        }
//		for option, index in el.find('option')

        // Add options, all as selected - as these are our tags list
        results = [];
        for (index = j = 0, len = tags.length; j < len; index = ++j) {
          tag = tags[index];
          opt = jQuery("<option selected='true'></option>");
          opt.val(tag);
          opt.text(tag);
          results.push(el.append(opt));
        }
        return results;
      }

      init(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
        var build, config, copy, data, dropDownKill, el, handler, updateCSS, value;
        boundMethodCheck(this, ref32);
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
          // Assume direct data passing
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
              return jQuery(`<span>${selection.text}</span>`);
            } else {
              return jQuery(`<span>${selection.text}</span>`);
            }
          };
        }
        handler = () => {
          var elementValue, index, j, len, tag;
          if (value.removeAll) {
            value.removeAll();
          } else {
            value = [];
          }
          elementValue = el.val();
          if (elementValue) {
            for (index = j = 0, len = elementValue.length; j < len; index = ++j) {
              tag = elementValue[index];
              // Sometimes some comas and spaces might pop in
              tag = tag.replace(',', '').replace(' ', '').trim();
              if (!tag) {
                continue;
              }
              value.push(tag);
            }
          }
          return updateCSS();
        };
        // This prevents dropdown for tags
        dropDownKill = (e) => {
          var haveTags;
          haveTags = jQuery(e.target).data();
          if (haveTags) {
            return jQuery('body').toggleClass('kill-all-select2-dropdowns', e.type === 'select2:opening');
          }
        };
        build = () => {
          // Apply select2
          el.select2(config);
          updateCSS();
          el.on('change', handler);
          el.on('select2:select select2:unselect', handler);
          el.on('select2:opening select2:close', dropDownKill);
          // Destroy select2 on element disposal
          return ko.utils.domNodeDisposal.addDisposeCallback(element, () => {
            el.select2('destroy');
            if (handler !== null) {
              el.off('change', handler);
              return el.off('select2:select select2:unselect', handler);
            }
          });
        };
        return setTimeout(build, 0);
      }

      update(element, valueAccessor, allBindingsAccessor) {
        var copy, data, el, maybeSet, value;
        boundMethodCheck(this, ref32);
        data = this.getValue(valueAccessor);
        if (data.data) {
          value = data.data;
        } else {
          // Assume direct data passing
          value = data;
        }
        copy = JSON.parse(JSON.stringify(value));
        el = jQuery(element);
        maybeSet = () => {
          var elementTags, modelTags;
          // Not a best moment to update
          if (el.val() === null) {
            elementTags = '';
          } else {
            elementTags = el.val().join(',').replace(/(,+)/g, ',').replace(/(\s+)/g, ' ');
          }
          modelTags = value.join(',');
          if (elementTags !== modelTags) {
            return this.setTags(el, copy);
          }
        };
        return setTimeout(maybeSet, 0);
      }

    };

    dropdownKillStyles = `<style>
	body.kill-all-select2-dropdowns .select2-dropdown {
		display: none !important;
	}
	body.kill-all-select2-dropdowns .select2-container--default.select2-container--open.select2-container--below .select2-selection--single, .select2-container--default.select2-container--open.select2-container--below .select2-selection--multiple
	{
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.select2-container--default.select2-container--focus .select2-selection--multiple {
		border-color: #66afe9;
		outline: 0;
		-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
		box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
	}
</style>`;

    once = true;

    return Tags;

  }).call(this);

  
  // HTML improved binding handler

  ref33 = this.Maslosoft.Binder.Text = class Text extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {
      return {
        'controlsDescendantBindings': true
      };
    }

    update(element, valueAccessor, allBindings, context) {
      var configuration, pm, value;
      boundMethodCheck(this, ref33);
      // setHtml will unwrap the value if needed
      value = escapeHtml(this.getValue(valueAccessor));
      configuration = this.getValue(allBindings).plugins;
      pm = new PluginsManager(element);
      pm.from(configuration);
      value = pm.getElementValue(element, value);
      return ko.utils.setHtml(element, value);
    }

  };

  ref34 = this.Maslosoft.Binder.TextToBg = class TextToBg extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {}

    update(element, valueAccessor, allBindings, context) {
      var value;
      boundMethodCheck(this, ref34);
      value = this.getValue(valueAccessor);
      return jQuery(element).css('background-color', stringToColour(value));
    }

  };

  
  // Html text value binding
  // WARNING This MUST have parent context, or will not work

  this.Maslosoft.Binder.TextValue = class TextValue extends this.Maslosoft.Binder.HtmlValue {
    getElementValue(element) {
      return element.textContent || element.innerText || "";
    }

    setElementValue(element, value) {
      if (typeof element.textContent !== 'undefined') {
        element.textContent = value;
      }
      if (typeof element.innerText !== 'undefined') {
        return element.innerText = value;
      }
    }

  };

  
  // Html text value binding
  // WARNING This MUST have parent context, or will not work

  this.Maslosoft.Binder.TextValueHLJS = class TextValueHLJS extends this.Maslosoft.Binder.HtmlValue {
    getElementValue(element) {
      return element.textContent || element.innerText || "";
    }

    setElementValue(element, value) {
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
    }

  };

  ref35 = this.Maslosoft.Binder.TimeAgoFormatter = class TimeAgoFormatter extends this.Maslosoft.Binder.MomentFormatter {
    constructor(options) {
      super(new Maslosoft.Binder.TimeAgoOptions(options));
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor) {
      var value;
      boundMethodCheck(this, ref35);
      value = this.getValue(valueAccessor);
      element.innerHTML = moment[this.options.sourceFormat](value).fromNow();
    }

  };

  
  // Date formatter

  this.Maslosoft.Binder.TimeFormatter = class TimeFormatter extends this.Maslosoft.Binder.MomentFormatter {
    constructor(options) {
      super(new Maslosoft.Binder.TimeOptions(options));
    }

  };

  /*
  Time picker
  */
  this.Maslosoft.Binder.TimePicker = class TimePicker extends this.Maslosoft.Binder.Base {};

  
  // Tooltip binding handler

  ref36 = this.Maslosoft.Binder.Tooltip = class Tooltip extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor) {
      var title;
      boundMethodCheck(this, ref36);
      title = this.getValue(valueAccessor);
      $(element).attr("title", title);
      $(element).attr("data-original-title", title);
      $(element).attr("rel", "tooltip");
    }

  };

  
  // Tree binding handler

  ref37 = this.Maslosoft.Binder.Tree = class Tree extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor) {
      boundMethodCheck(this, ref37);
    }

  };

  ref38 = this.Maslosoft.Binder.TreeGrid = (function() {
    var makeValueAccessor;

    class TreeGrid extends this.Maslosoft.Binder.Base {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      init(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var activeClass, activeClassHandler, dispose, table, value, widget;
        boundMethodCheck(this, ref38);
        value = this.getValue(valueAccessor);
        activeClass = value.activeClass;
        table = jQuery(element);
        widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView(element, valueAccessor);
        widget.init();
        if (activeClass) {
          activeClassHandler = function(e) {
            // Remove from all instances of `tr` tu support multiple
            // classes separated with space
            table.find('tr').removeClass(activeClass);
            jQuery(e.currentTarget).addClass(activeClass);
            return true;
          };
          table.on('click', 'tr', activeClassHandler);
          dispose = function(toDispose) {
            widget.dispose();
            return jQuery(toDispose).off("click", 'tr', activeClassHandler);
          };
          ko.utils.domNodeDisposal.addDisposeCallback(element, dispose);
        }
        ko.bindingHandlers['template']['init'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
        return {
          controlsDescendantBindings: true
        };
      }

      update(element, valueAccessor, allBindings, viewModel, bindingContext) {
        var widget;
        boundMethodCheck(this, ref38);
        widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView(element, valueAccessor, 'update');
        return ko.bindingHandlers['template']['update'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
      }

    };

    
    // @private

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
          var extras, hasChilds, item, j, len, results;
          depth++;
          results = [];
          for (j = 0, len = items.length; j < len; j++) {
            item = items[j];
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
              results.push(depth--);
            } else {
              results.push(void 0);
            }
          }
          return results;
        };
        //			log unwrappedValue['data']
        if (unwrappedValue['data']['children']) {
          //				log('model init')
          unwrapRecursive(unwrappedValue['data']['children']);
        } else {
          //				log('array init')
          unwrapRecursive(unwrappedValue['data']);
        }
        if (bindingContext) {
          bindingContext.tree = unwrappedValue['data'];
          bindingContext.data = data;
          bindingContext.widget = widget;
        }
        // If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
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

    return TreeGrid;

  }).call(this);

  
  // This is to create "nodes" cell, this is meant to be used with TreeGrid
  // binding handler

  ref39 = this.Maslosoft.Binder.TreeGridNode = class TreeGridNode extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindings, viewModel, bindingContext) {
      boundMethodCheck(this, ref39);
    }

    update(element, valueAccessor, allBindings, viewModel, bindingContext) {
      var config, data, depth, expanderIcon, expanders, extras, folderIcon, html, nodeIcon;
      boundMethodCheck(this, ref39);
      ko.utils.toggleDomNodeCssClass(element, 'tree-grid-drag-handle', true);
      html = [];
      data = this.getValue(valueAccessor);
      extras = data._treeGrid;
      config = bindingContext.widget.config;
      //console.log extras.hasChilds
      // TODO: Just accessing data.children causes havoc...
      nodeIcon = config.nodeIcon;
      folderIcon = config.folderIcon;
      expanderIcon = config.expanderIcon || "<i class='glyphicon glyphicon-triangle-bottom'></i>";
      if (folderIcon && extras.hasChilds) {
        //				console.log 'hmmm'
        nodeIcon = folderIcon;
      }
      //			console.log "#{data.title}: #{extras.depth}", extras.hasChilds
      //			console.log data
      //			console.log ko.unwrap bindingContext.$index
      depth = extras.depth;
      expanders = [];
      expanders.push(`<div class='collapsed' style='display:none;transform: rotate(-90deg);'>${expanderIcon}</div>`);
      expanders.push(`<div class='expanded' style='display:none;transform: rotate(-45deg);'>${expanderIcon}</div>`);
      html.push(`<a class='expander' style='cursor:pointer;text-decoration:none;width:1em;margin-left:${depth}em;display:inline-block;'>${expanders.join('')}</a>`);
      depth = extras.depth + 1;
      html.push(`<i class='no-expander' style='margin-left:${depth}em;display:inline-block;'></i>`);
      html.push(`<img src='${nodeIcon}' style='width: 1em;height:1em;margin-top: -.3em;display: inline-block;'/>`);
      return element.innerHTML = html.join('') + element.innerHTML;
    }

  };

  
  // Validation binding handler

  // @see ValidationManager

  ref40 = this.Maslosoft.Binder.Validator = (function() {
    var idCounter;

    class Validator extends this.Maslosoft.Binder.Base {
      constructor(options) {
        super(new Maslosoft.Binder.ValidatorOptions());
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      getElementValue(element) {
        // For inputs use value
        if (element.tagName.toLowerCase() === 'input') {
          return element.value;
        }
        // For textarea use value
        if (element.tagName.toLowerCase() === 'textarea') {
          return element.value;
        }
        // For rest use text value
        return element.textContent || element.innerText || "";
      }

      init(element, valueAccessor, allBindingsAccessor, context) {
        var classField, configuration, handler, initialVal, manager, pm, validators;
        boundMethodCheck(this, ref40);
        configuration = this.getValue(valueAccessor);
        classField = this.options.classField;
        pm = new PluginsManager(element, classField);
        validators = pm.from(configuration);
        //   TODO Maybe below code should be used to check if class is validator compatible
        //		proto = config[classField].prototype

        //		if typeof(proto.isValid) isnt 'function' or typeof(proto.getErrors) isnt 'function' or typeof(proto.reset) isnt 'function'
        //			if typeof(config[classField].prototype.constructor) is 'function'
        //				name = config[classField].prototype.constructor.name
        //			else
        //				name = config[classField].toString()

        //			error "Parameter `#{classField}` (of type #{name}) must be validator compatible class, binding defined on element:", element
        //			continue
        manager = new ValidationManager(validators, this.options);
        manager.init(element);
        // Generate some id if not set, see notes below why
        if (!element.id) {
          element.id = `Maslosoft-Ko-Binder-Validator-${idCounter++}`;
        }
        // Get initial value to evaluate only if changed
        initialVal = this.getElementValue(element);
        handler = (e) => {
          var elementValue;
          // On some situations element might be null (sorting), ignore this case
          if (!element) {
            return;
          }
          // This is required in some scenarios, specifically when sorting htmlValue elements
          element = document.getElementById(element.id);
          if (!element) {
            return;
          }
          elementValue = this.getElementValue(element);
          
          // Validate only if changed
          if (initialVal !== elementValue) {
            initialVal = elementValue;
            return manager.validate(element, elementValue);
          }
        };
        // NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
        ko.utils.registerEventHandler(element, "keyup, input", handler);
        // This is to allow interaction with tools which could modify content,
        // also to work with drag and drop
        return ko.utils.registerEventHandler(document, "mouseup", handler);
      }

      update(element, valueAccessor, allBindings) {
        boundMethodCheck(this, ref40);
      }

    };

    // Counter for id generator
    // @static
    idCounter = 0;

    return Validator;

  }).call(this);

  // NOTE: Will not trigger on value change, as it is not directly observing value.
  // Will trigger only on init

  // Video PLaylist binding handler

  ref41 = this.Maslosoft.Binder.VideoPlaylist = (function() {
    class VideoPlaylist extends this.Maslosoft.Binder.Video {
      constructor() {
        super(...arguments);
        this.init = this.init.bind(this);
        this.update = this.update.bind(this);
      }

      getData(valueAccessor) {
        var value;
        // Verbose syntax, at least {data: data}
        value = this.getValue(valueAccessor) || [];
        if (value.data) {
          return value.data;
        }
        return value;
      }

      init(element, valueAccessor, allBindingsAccessor, context) {
        boundMethodCheck(this, ref41);
      }

      update(element, valueAccessor, allBindingsAccessor, viewModel) {
        var data, html, j, len, options, title, titleField, url, urlField, video;
        boundMethodCheck(this, ref41);
        data = this.getData(valueAccessor);
        options = this.getValue(valueAccessor || {});
        urlField = options.urlField || 'url';
        titleField = options.urlField || 'title';
        html = [];
        for (j = 0, len = data.length; j < len; j++) {
          video = data[j];
          url = video[urlField];
          title = video[titleField];
          if (this.isVideoUrl(url)) {
            html.push(`<a href='${url}'>${title}</a>`);
          }
        }
        element.innerHTML = html.join("\n");
        if (html.length) {
          ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', true);
          return new Maslosoft.Playlist(element);
        } else {
          return ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', false);
        }
      }

    };

    VideoPlaylist.prototype.initVideos = null;

    return VideoPlaylist;

  }).call(this);

  
  // Video Playlist binding handler

  ref42 = this.Maslosoft.Binder.VideoThumb = class VideoThumb extends this.Maslosoft.Binder.Video {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindingsAccessor, context) {
      boundMethodCheck(this, ref42);
    }

    update(element, valueAccessor) {
      var url;
      boundMethodCheck(this, ref42);
      url = this.getValue(valueAccessor);
      return this.setThumb(url, element);
    }

  };

  ref43 = this.Maslosoft.Binder.Widget = class Widget extends this.Maslosoft.Binder.Base {
    constructor() {
      super(...arguments);
      this.init = this.init.bind(this);
      this.update = this.update.bind(this);
    }

    init(element, valueAccessor, allBindings, context) {
      var Error, className, name, params, ref, value, widget;
      boundMethodCheck(this, ref43);
      className = this.getValue(valueAccessor);
      ref = allBindings.get('ref');
      // Ref is string, try to create new widget and set ref
      if (typeof ref === 'string' || !ref) {
        if (typeof className !== 'function') {
          return;
        }
        if (typeof className.constructor !== 'function') {
          return;
        }
        try {
          widget = new className();
        } catch (error1) {
          Error = error1;
          return;
        }
        if (ref) {
          setRefByName(ref, widget);
        }
        if (ref) {
          ref = widget;
        }
      } else {
        //			console.log 'By ref...'
        //			console.log ref, typeof(ref)
        if (typeof ref === 'object') {
          //				console.log 'Assign ref...'
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
    }

    update(element, valueAccessor) {
      boundMethodCheck(this, ref43);
    }

  };

  ref44 = this.Maslosoft.Binder.WidgetAction = class WidgetAction extends this.Maslosoft.Binder.WidgetUrl {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var data, href;
      boundMethodCheck(this, ref44);
      data = this.getData(element, valueAccessor, allBindings, 'action');
      href = this.createUrl(data.id, data.action, data.params, '?');
      element.setAttribute('href', href);
      return this.setRel(element);
    }

  };

  ref45 = this.Maslosoft.Binder.WidgetActivity = class WidgetActivity extends this.Maslosoft.Binder.WidgetUrl {
    constructor() {
      super(...arguments);
      this.update = this.update.bind(this);
    }

    update(element, valueAccessor, allBindings) {
      var data, href;
      boundMethodCheck(this, ref45);
      data = this.getData(element, valueAccessor, allBindings, 'activity');
      href = this.createUrl(data.id, data.activity, data.params, '#');
      element.setAttribute('href', href);
      return this.setRel(element);
    }

  };

  PluginsManager = (function() {
    class PluginsManager {
      constructor(element1 = null, classField1 = '_class') {
        this.getElementValue = this.getElementValue.bind(this);
        this.getModelValue = this.getModelValue.bind(this);
        this.element = element1;
        this.classField = classField1;
        this.plugins = new Array();
      }

      
      // Create configured instances out of configuration
      // containing _class and optional params

      // Example configuration for one plugin:
      // ```
      // {
      // 	_class: Maslosoft.BinderDev.RegExpValidator,
      // 	pattern: '^[a-z]+$',
      // 	allowEmpty: false
      // }
      // ```

      // Example configuration for many plugins:
      // ```
      // [
      // 	{
      // 		_class: Maslosoft.BinderDev.EmailValidator,
      // 		label: 'E-mail'
      // 	},
      // 	{
      // 		_class: Maslosoft.BinderDev.RequiredValidator,
      // 		label: 'E-mail'
      // 	}
      // ]
      // ```

      // @param object
      // @return object[]

      from(configuration) {
        var cfg, classField, className, config, element, index, j, len, plugin, value;
        element = this.element;
        classField = this.classField;
        this.plugins = new Array();
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
//		console.log cfg
        for (j = 0, len = cfg.length; j < len; j++) {
          config = cfg[j];
          if (!config[classField]) {
            error(`Parameter \`${classField}\` must be defined for plugin on element:`, element);
            continue;
          }
          if (typeof config[classField] !== 'function') {
            error(`Parameter \`${classField}\` must be plugin compatible class, binding defined on element:`, element);
            continue;
          }
          // Store class name first, as it needs to be removed
          className = config[classField];
          // Remove class key, to not interrupt plugin configuration
          delete config[classField];
          // Instantiate plugin
          plugin = new className();
          for (index in config) {
            value = config[index];
            plugin[index] = null;
            plugin[index] = value;
          }
          this.plugins.push(plugin);
          return this.plugins;
        }
      }

      getElementValue(element, value) {
        var j, len, plugin, ref46;
        ref46 = this.plugins;
        for (j = 0, len = ref46.length; j < len; j++) {
          plugin = ref46[j];
          if (typeof plugin.getElementValue === 'function') {
            value = plugin.getElementValue(element, value);
          }
        }
        return value;
      }

      getModelValue(element, value) {
        var j, len, plugin, ref46;
        ref46 = this.plugins;
        for (j = 0, len = ref46.length; j < len; j++) {
          plugin = ref46[j];
          if (typeof plugin.getModelValue === 'function') {
            value = plugin.getModelValue(element, value);
          }
        }
        return value;
      }

    };

    PluginsManager.prototype.classField = '_class';

    PluginsManager.prototype.element = null;

    
    // @var object[]

    PluginsManager.prototype.plugins = null;

    return PluginsManager;

  }).call(this);

  TreeDnd = (function() {
    var t;

    class TreeDnd {
      constructor(initialTree, element, events1, options) {
        this.dragEnd = this.dragEnd.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
        this.events = events1;
        this.draggable = {};
        this.draggable.scroll = false;
        this.tree = {};
        this.tree = initialTree;
        this.finder = new TreeNodeFinder(this.tree);
        this.el = jQuery(element);
      }

      dragStart(node, data) {
        return true;
      }

      dragEnter(node, data) {
        return true;
      }

      dragEnd(node, data) {
        log('drag end...');
        return true;
      }

      dragDrop(node, data) {
        var ctx, current, dragged, handler, hitMode, index, parent, target, targetParent;
        hitMode = data.hitMode;
        // Dragged element - either draggable or tree element
        dragged = data.draggable.element[0];
        // Event handler for drop
        this.events.drop(node, data);
        if (!data.otherNode) {
          // Drop from ourside tree
          ctx = ko.contextFor(dragged);
          // Handle drop event possible transformation of node
          current = this.events.getNode(ctx.$data);
        } else {
          // From from within tree
          parent = this.finder.find(data.otherNode.parent.data.id);
          // Find node
          // Handle drop event possible transformation of node
          current = this.events.getNode(this.finder.find(data.otherNode.data.id));
          if (!this.el.is(dragged)) {
            log('From other instance...');
            // Drop from other tree instance
            data = ko.dataFor(dragged);
            log(data);
            setTimeout(handler, 0);
          }
        }
        target = this.finder.find(node.data.id);
        targetParent = this.finder.find(node.parent.data.id);
        // console.log "Parent: #{parent.title}"
        // console.log "Current: #{current.title}"
        // console.log "Target: #{target.title}"
        // console.log "TargetParent: #{targetParent.title}"
        // console.log hitMode

        // Update view model
        // Remove current element first
        if (parent) {
          parent.children.remove(current);
        }
        this.tree.children.remove(current);
        if (targetParent) {
          targetParent.children.remove(current);
        }
        // Just push at target end
        if (hitMode === 'over') {
          // log hitMode
          // log "Target: #{target.title}"
          // log "Current: #{current.title}"
          target.children.push(current);
        }
        // Insert before target - at target parent
        if (hitMode === 'before') {
          if (targetParent) {
            // Move over some node
            index = targetParent.children.indexOf(target);
            targetParent.children.splice(index, 0, current);
          } else {
            // Move over root node
            index = this.tree.children.indexOf(target);
            this.tree.children.splice(index, 0, current);
          }
        }
        // console.log "indexOf: #{index} (before)"

        // Simply push at the end - but at targetParent
        if (hitMode === 'after') {
          if (targetParent) {
            targetParent.children.push(current);
          } else {
            this.tree.children.push(current);
          }
        }
        // NOTE: This could possibly work, but it doesn't.
        // This would update whole tree with new data. Some infinite recursion occurs.
        // @handle element, valueAccessor, allBindingsAccessor
        handler = (e) => {
          log(e);
          this.el.fancytree('option', 'source', this.tree.children);
          this.el.fancytree('getRootNode').visit(function(node) {
            return node.setExpanded(true);
          });
          this.el.focus();
          return log('update tree..', this.el);
        };
        setTimeout(handler, 0);
        // Move fancytree node separatelly
        // data.otherNode.moveTo(node, hitMode)

        // Expand node as it looks better if it is expanded after drop
        return true;
      }

    };

    // Expand helps greatly when doing dnd
    TreeDnd.prototype.autoExpandMS = 400;

    // Prevent focus on click
    // When enabled will scroll to tree control on click, not really desirable
    // Cons: breaks keyboard navigation
    TreeDnd.prototype.focusOnClick = false;

    // These two are required, or view model might loop	
    TreeDnd.prototype.preventVoidMoves = true;

    TreeDnd.prototype.preventRecursiveMoves = true;

    
    // Whole tree data
    // @var TreeItem[]

    TreeDnd.prototype.tree = null;

    
    // Node finder instance
    // @var TreeNodeFinder

    TreeDnd.prototype.finder = null;

    
    // Draggable options

    TreeDnd.prototype.draggable = null;

    
    // @var TreeEvents

    TreeDnd.prototype.events = null;

    
    // Tree html element

    TreeDnd.el = null;

    // Private
    t = function(node) { // Comment to log
      var childNode, children, j, len, ref46;
      return;
      log(`Node: ${node.title}`);
      children = [];
      if (node.children && node.children.length > 0) {
        ref46 = node.children;
        for (j = 0, len = ref46.length; j < len; j++) {
          childNode = ref46[j];
          children.push(childNode.title);
        }
        return log(`Children: ${children.join(',')}`);
      }
    };

    return TreeDnd;

  }).call(this);

  TreeDrag = (function() {
    var t;

    class TreeDrag {
      constructor(initialTree, element, events, options) {
        this.dragEnd = this.dragEnd.bind(this);
        this.dragDrop = this.dragDrop.bind(this);
        this.draggable = {};
        this.draggable.scroll = false;
        this.tree = {};
        this.tree = initialTree;
        this.finder = new TreeNodeFinder(this.tree);
        this.el = jQuery(element);
      }

      dragStart(node, data) {
        return true;
      }

      dragEnter(node, data) {
        return false;
      }

      dragEnd(node, data) {
        log('drag end...');
        return true;
      }

      dragDrop(node, data) {
        var ctx, current, dragged, handler, hitMode, index, parent, target, targetParent;
        return false;
        hitMode = data.hitMode;
        // Dragged element - either draggable or tree element
        dragged = data.draggable.element[0];
        if (!data.otherNode) {
          // Drop from ourside tree
          ctx = ko.contextFor(dragged);
          current = ctx.$data;
        } else {
          // From from within tree
          parent = this.finder.find(data.otherNode.parent.data.id);
          current = this.finder.find(data.otherNode.data.id);
          if (!this.el.is(dragged)) {
            log('From other instance...');
            // Drop from other tree instance
            data = ko.dataFor(dragged);
            log(data);
            setTimeout(handler, 0);
          }
        }
        target = this.finder.find(node.data.id);
        targetParent = this.finder.find(node.parent.data.id);
        // console.log "Parent: #{parent.title}"
        // console.log "Current: #{current.title}"
        // console.log "Target: #{target.title}"
        // console.log "TargetParent: #{targetParent.title}"
        // console.log hitMode

        // Update view model
        // Remove current element first
        if (parent) {
          parent.children.remove(current);
        }
        this.tree.children.remove(current);
        if (targetParent) {
          targetParent.children.remove(current);
        }
        // Just push at target end
        if (hitMode === 'over') {
          // log hitMode
          // log "Target: #{target.title}"
          // log "Current: #{current.title}"
          target.children.push(current);
        }
        // Insert before target - at target parent
        if (hitMode === 'before') {
          if (targetParent) {
            // Move over some node
            index = targetParent.children.indexOf(target);
            targetParent.children.splice(index, 0, current);
          } else {
            // Move over root node
            index = this.tree.children.indexOf(target);
            this.tree.children.splice(index, 0, current);
          }
        }
        // console.log "indexOf: #{index} (before)"

        // Simply push at the end - but at targetParent
        if (hitMode === 'after') {
          if (targetParent) {
            targetParent.children.push(current);
          } else {
            this.tree.children.push(current);
          }
        }
        // NOTE: This could possibly work, but it doesn't.
        // This would update whole tree with new data. Some infinite recursion occurs.
        // @handle element, valueAccessor, allBindingsAccessor
        handler = (e) => {
          log(e);
          this.el.fancytree('option', 'source', this.tree.children);
          this.el.fancytree('getRootNode').visit(function(node) {
            return node.setExpanded(true);
          });
          this.el.focus();
          return log('update tree..', this.el);
        };
        setTimeout(handler, 0);
        // Move fancytree node separatelly
        // data.otherNode.moveTo(node, hitMode)

        // Expand node as it looks better if it is expanded after drop
        return true;
      }

    };

    // Prevent focus on click
    // When enabled will scroll to tree control on click, not really desirable
    // Cons: breaks keyboard navigation
    TreeDrag.prototype.focusOnClick = false;

    
    // Whole tree data
    // @var TreeItem[]

    TreeDrag.prototype.tree = null;

    
    // Node finder instance
    // @var TreeNodeFinder

    TreeDrag.prototype.finder = null;

    
    // Draggable options

    TreeDrag.prototype.draggable = null;

    
    // Tree html element

    TreeDrag.el = null;

    // Private
    t = function(node) { // Comment to log
      var childNode, children, j, len, ref46;
      return;
      log(`Node: ${node.title}`);
      children = [];
      if (node.children && node.children.length > 0) {
        ref46 = node.children;
        for (j = 0, len = ref46.length; j < len; j++) {
          childNode = ref46[j];
          children.push(childNode.title);
        }
        return log(`Children: ${children.join(',')}`);
      }
    };

    return TreeDrag;

  }).call(this);

  TreeEvents = (function() {
    var doEvent, finder, stop;

    class TreeEvents {
      constructor(initialTree, events1, options1) {
        // Drop event
        this.drop = this.drop.bind(this);
        
        // Handler to possibly recreate/transform node

        this.getNode = this.getNode.bind(this);
        this.handle = this.handle.bind(this);
        this.events = events1;
        this.options = options1;
        finder = new TreeNodeFinder(initialTree);
        this.handle('click');
        this.handle('dblclick');
        this.handle('activate');
        this.handle('deactivate');
      }

      drop(node, data) {
        log("Drop...");
        log(this.events);
        if (this.events.drop) {
          this.dropEvent = new this.events.drop(node, data);
          return log(this.dropEvent);
        }
      }

      getNode(node) {
        log("Tree event drop...");
        log(this.dropEvent);
        if (this.dropEvent && this.dropEvent.getNode) {
          return this.dropEvent.getNode(node);
        } else {
          return node;
        }
      }

      handle(type) {
        if (this.events[type]) {
          return this.options[type] = (event, data) => {
            var model;
            if (doEvent(data)) {
              model = finder.find(data.node.data.id);
              this.events[type](model, data, event);
              return stop(event);
            }
          };
        }
      }

    };

    
    // Events defined by binding

    TreeEvents.prototype.events = null;

    
    // Drop event is handled differently

    TreeEvents.prototype.dropEvent = null;

    
    // Fancy tree options

    TreeEvents.prototype.options = null;

    // Private

    // Finder instance
    // @var TreeNodeFinder

    finder = null;

    // Check whether should handle event
    doEvent = function(data) {
      // For most events just do event it has no target
      if (typeof data.targetType === 'undefined') {
        return true;
      }
      // For click and double click react only on title and icon click
      if (data.targetType === 'title') {
        return true;
      }
      if (data.targetType === 'icon') {
        return true;
      }
    };

    // Stop event propagation
    stop = function(event) {
      return event.stopPropagation();
    };

    return TreeEvents;

  }).call(this);

  TreeNodeCache = (function() {
    var nodes;

    class TreeNodeCache {
      constructor() {}

      // nodes = {}
      get(id) {
        if (typeof nodes[id] === 'undefined') {
          return false;
        }
        return nodes[id];
      }

      set(id, val) {
        return nodes[id] = val;
      }

    };

    nodes = {};

    return TreeNodeCache;

  }).call(this);

  TreeNodeFinder = (function() {
    var cache, findNode, trees;

    class TreeNodeFinder {
      constructor(initialTree) {
        trees.push(initialTree);
      }

      find(id) {
        var j, len, node, tree;
        for (j = 0, len = trees.length; j < len; j++) {
          tree = trees[j];
          node = findNode(tree, id);
          if (node) {
            return node;
          }
        }
        return false;
      }

    };

    // Private
    cache = new TreeNodeCache();

    trees = [];

    findNode = function(node, id) {
      var child, found, foundNode, j, len, ref46;
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
        ref46 = node.children;
        for (j = 0, len = ref46.length; j < len; j++) {
          child = ref46[j];
          foundNode = findNode(child, id);
          if (foundNode !== false) {
            cache.set(id, foundNode);
            return foundNode;
          }
        }
      }
      return false;
    };

    return TreeNodeFinder;

  }).call(this);

  TreeNodeRenderer = (function() {
    var finder;

    class TreeNodeRenderer {
      constructor(tree, options, icon1, folderIcon1) {
        this.render = this.render.bind(this);
        this.icon = icon1;
        this.folderIcon = folderIcon1;
        finder = new TreeNodeFinder(tree);
      }

      setRenderer(renderer1) {
        this.renderer = renderer1;
        if (typeof this.renderer.render !== 'function') {
          return console.error("Renderer must have function `render`");
        }
      }

      render(event, data) {
        var html, icon, index, model, node, span, val;
        node = data.node;

        // Skip event from child nodes
// If not skipped, double icons will appear on folder nodes
// TODO Investigate if there is more reliable methos for this
        for (index in data) {
          val = data[index];
          if (index === 'originalEvent') {
            return;
          }
        }
        
        // Operate only on title, not whole node html
        // This will prevent destroying expanders etc.
        span = jQuery(node.span).find("> span.fancytree-title");
        
        // Use custom render
        if (this.renderer && this.renderer.render) {
          model = finder.find(node.data.id);
          this.renderer.render(model, span);
        }
        
        // Apply icon if applicable
        if (this.icon || this.folderIcon) {
          
          // Use html here (not node.title) as it might be altered by custom renderer
          html = span.html();
          
          // Check which icon to use
          if (this.folderIcon && node.children && node.children.length) {
            icon = this.folderIcon;
          } else {
            icon = this.icon;
          }
          
          // Add icon tag just before title
          // This will ensure proper dnd for responsive icon size
          return span.html(`<i class='node-title-icon' style='background-image:url(${icon})'></i> ${html}`);
        }
      }

    };

    TreeNodeRenderer.prototype.icon = '';

    TreeNodeRenderer.prototype.folderIcon = '';

    TreeNodeRenderer.prototype.renderer = null;

    
    // Node finder instance
    // @var TreeNodeFinder
    // @private

    finder = null;

    return TreeNodeRenderer;

  }).call(this);

  ValidationManager = (function() {
    var hide, show, toggle;

    
    // Validation manager.

    // This class applies proper styles and messages to configured DOM elements.

    class ValidationManager {
      
      // Initialize validation manager

      // @param validators Maslosoft.Binder.BaseValidator[]
      // @param options Maslosoft.Binder.ValidatorOptions

      constructor(validators1, options1) {
        
        // Trigger validation and warnigs on all items

        // @param element DomElement
        // @param value mixed

        // @return bool

        this.validate = this.validate.bind(this);
        
        // Set working element. No need to call it directly, it is called by validate method.

        // @param element DomElement

        // @return ValidationManager

        this.setElement = this.setElement.bind(this);
        
        // Initialize element. This sets proper state of helper elements,
        // like error/warning messages container

        // @param element DomElement

        this.init = this.init.bind(this);
        
        // Apply validation of one validator

        // @param validator Maslosoft.Binder.BaseValidator
        // @param element DomElement
        // @param value mixed

        // @return bool

        this.validateOne = this.validateOne.bind(this);
        
        // Apply warnings of one input

        // @param validator Maslosoft.Binder.BaseValidator
        // @param element DomElement
        // @param value mixed

        // @return ValidationManager

        this.adviseOne = this.adviseOne.bind(this);
        this.validators = validators1;
        this.options = options1;
      }

      validate(element, value) {
        var j, k, len, len1, ref46, ref47, validator;
        // Set current element here, as it could be changed in some case, ie sorting
        this.setElement(element);
        ref46 = this.validators;
        // Trigger all validators
        for (j = 0, len = ref46.length; j < len; j++) {
          validator = ref46[j];
          if (!this.validateOne(validator, value)) {
            return false;
          }
        }
        ref47 = this.validators;
        // Loop again for warnings, or they would be overriden
        for (k = 0, len1 = ref47.length; k < len1; k++) {
          validator = ref47[k];
          // Ensure that validator handle warnings
          if (typeof validator.getWarnings === 'function') {
            this.adviseOne(validator, value);
          }
        }
        return true;
      }

      setElement(element1) {
        this.element = element1;
        this.parent = jQuery(this.element).parents('.form-group')[0];
        if (!this.parent) {
          return this;
        }
        this.errors = this.parent.querySelector(this.options.errorMessages);
        this.warnings = this.parent.querySelector(this.options.warningMessages);
        hide(this.errors);
        hide(this.warnings);
        return this;
      }

      init(element) {
        return this.setElement(element);
      }

      validateOne(validator, value) {
        var element, errors, isValid, messages, parent, warnings;
        // Reassign variables for local scope
        element = this.element;
        parent = this.parent;
        errors = this.errors;
        warnings = this.warnings;
        messages = new Array();
        validator.reset();
        isValid = false;
        if (validator.isValid(value)) {
          // Apply input error styles as needed
          if (this.options.inputError) {
            toggle(element, this.options.inputError, false);
          }
          if (this.options.inputSuccess) {
            toggle(element, this.options.inputSuccess, true);
          }
          // Apply parent styles as needed
          if (parent) {
            if (this.options.parentError) {
              toggle(parent, this.options.parentError, false);
            }
            if (this.options.parentSuccess) {
              toggle(parent, this.options.parentSuccess, true);
            }
          }
          // Reset error messages
          if (errors) {
            hide(errors);
            errors.innerHTML = '';
          }
          isValid = true;
        } else {
          // Errors...
          messages = validator.getErrors();
          // Apply input error styles as needed
          if (this.options.inputError) {
            toggle(element, this.options.inputError, true);
          }
          if (this.options.inputSuccess) {
            toggle(element, this.options.inputSuccess, false);
          }
          // Apply parent styles as needed
          if (parent) {
            if (this.options.parentError) {
              toggle(parent, this.options.parentError, true);
            }
            if (this.options.parentSuccess) {
              toggle(parent, this.options.parentSuccess, false);
            }
          }
          // Show error messages
          if (errors && messages) {
            show(errors);
            errors.innerHTML = messages.join('<br />');
          }
          isValid = false;
        }
        
        // Warnings part - this is required here to reset warnings

        // Reset warnings regardless of validation result
        // Remove input warning styles as needed
        if (this.options.inputWarning) {
          toggle(element, this.options.inputWarning, false);
        }
        // Remove parent styles as needed
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
      }

      adviseOne(validator, value) {
        var element, errors, messages, parent, warnings;
        // Reassign variables for local scope
        element = this.element;
        parent = this.parent;
        errors = this.errors;
        warnings = this.warnings;
        messages = validator.getWarnings();
        // If has warnings remove success and add warnings to any applicable element
        if (messages.length) {
          // Apply input warning styles as needed
          if (this.options.inputWarning) {
            toggle(element, this.options.inputWarning, true);
          }
          if (this.options.inputSuccess) {
            toggle(element, this.options.inputSuccess, false);
          }
          // Apply parent styles as needed
          if (parent) {
            if (this.options.parentWarning) {
              toggle(parent, this.options.parentWarning, true);
            }
            if (this.options.parentSuccess) {
              toggle(parent, this.options.parentSuccess, false);
            }
          }
          // Show warnings if any
          if (warnings) {
            show(warnings);
            warnings.innerHTML = messages.join('<br />');
          }
        }
        return this;
      }

    };

    
    // Input element
    // @var DomElement

    ValidationManager.prototype.element = null;

    
    // Parent of input element
    // @var DomElement

    ValidationManager.prototype.parent = null;

    
    // Errors container element
    // @var DomElement

    ValidationManager.prototype.errors = null;

    
    // Warnings container element
    // @var DomElement

    ValidationManager.prototype.warnings = null;

    // Private
    toggle = ko.utils.toggleDomNodeCssClass;

    hide = function(element) {
      return ko.utils.toggleDomNodeCssClass(element, 'hide', true);
    };

    show = function(element) {
      return ko.utils.toggleDomNodeCssClass(element, 'hide', false);
    };

    return ValidationManager;

  }).call(this);

  if (!this.Maslosoft.Binder.Widgets.TreeGrid) {
    this.Maslosoft.Binder.Widgets.TreeGrid = {};
  }

  Maslosoft.Binder.Widgets.TreeGrid.Dnd = (function() {
    var didDrop, dragged, draggedOver, hitMode, indicator, prevHitMode;

    class Dnd {
      constructor(grid) {
        var defer;
        
        // On drag start

        this.dragStart = this.dragStart.bind(this);
        // data = ko.dataFor e.target
        // console.log "Started #{data.title}"
        this.drag = this.drag.bind(this);
        
        // Drop if stopped dragging without dropping
        // This is required when dragging near top or bottom of container

        this.stop = this.stop.bind(this);
        
        // Drop in a normal manner, see also `stop` for edge case

        this.drop = this.drop.bind(this);
        //		setTimeout dropDelay, 50

        // Handle over state to get element to be about to be dropped
        // This is bound to dropable `over`

        this.over = this.over.bind(this);
        
        // On drag over, evaluated only if entering different element or hit mode

        this.dragOver = this.dragOver.bind(this);
        
        // Move handler for mousemove for precise position calculation
        // * Detect over which tree element is cursor and if it's more
        // on top/bottom edge or on center

        this.move = this.move.bind(this);
        
        // Reset appropriate things on drop

        this.clear = this.clear.bind(this);
        
        // Initialize drag helper

        this.dragHelper = this.dragHelper.bind(this);
        this.grid = grid;
        
        // DND must be explicitly enabled
        if (!this.grid.config.dnd) {
          return;
        }
        if (this.grid.context === 'init') {
          // handle disposal
          ko.utils.domNodeDisposal.addDisposeCallback(this.grid.element.get(0), function() {
            var e;
            try {
              if (this.grid.element) {
                this.grid.element.draggable("destroy");
                return this.grid.element.droppable("destroy");
              }
            } catch (error1) {
              e = error1;
              return console.log(e.message);
            }
          });
          this.grid.element.on('mousemove', '> tr', this.move);
        }
        if (!indicator) {
          indicator = new Maslosoft.Binder.Widgets.TreeGrid.DropIndicator(this.grid);
        }
        defer = () => {
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
            start: this.dragStart,
            drag: this.drag,
            stop: this.stop,
            helper: this.dragHelper
          };
          droppableOptions = {
            tolerance: "pointer",
            drop: this.drop,
            over: this.over
          };
          this.grid.element.find('> tr').draggable(draggableOptions);
          return this.grid.element.find('> tr').droppable(droppableOptions);
        };
        setTimeout(defer, 0);
      }

      dragStart(e) {
        return dragged = e.target;
      }

      drag(e, helper) {}

      stop(e, ui) {
        if (!didDrop) {
          return this.drop(e, ui);
        }
      }

      drop(e, ui) {
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
        // console.log "Drop #{current.title} over #{over.title}"
        // console.log arguments
        //		log "CURR " + current.title
        //		log "OVER " + over.title
        //		log "PRNT " + overParent.title
        //		log "HITM " + hitMode
        if (overParent.children) {
          // Model initialized
          parentChilds = overParent.children;
        } else {
          // Array initialized
          parentChilds = overParent;
        }
        dropDelay = () => {
          var index;
          this.grid.remove(current);
          if (hitMode === 'over') {
            // Most obvious case, when dragged node is directly over
            // dropped node, insert current node as it's last child
            over.children.push(current);
          }
          if (hitMode === 'before') {
            // Insert node before current node, this is case when
            // insert mark is before dragged over node
            index = parentChilds.indexOf(over);
            parentChilds.splice(index, 0, current);
          }
          if (hitMode === 'after') {
            // When node has children, then add just at beginning
            // to match visual position of dragged node
            if (over.children.length) {
              parentChilds.splice(0, 0, current);
            } else {
              // When not having children, it means that node is
              // last on the level so insert as a last node
              parentChilds.push(current);
            }
          }
          // Special case for last item. This allow adding node to top
          // level on the end of tree. Without this, it would be
          // impossible to move node to the end if last node is not top node.

          // TODO for some reason view does not update on push

          if (hitMode === 'last') {
            //				log "Delayed Drop on end of table..."
            if (root.children) {
              root.children.push(current);
            } else {
              
              // TODO Neither push or splice at end works!
              // It *does* add to view model but does not update UI!
              // However splice at beginning works properly!!!111

              //					root.splice root.length, 0, current
              root.push(current);
            }
          }
          return this.clear();
        };
        // Delay a bit to reduce flickering
        // See also TreeGridView.thaw() - this value should be lower than that in thaw
        return dropDelay();
      }

      over(e) {
        // Don't stop propagation, just detect row
        if (e.target.tagName.toLowerCase() === 'tr') {
          // Limit updates to only when dragging over different items
          if (draggedOver !== e.target) {
            draggedOver = jQuery(e.target);
            return this.dragOver(e);
          }
        }
      }

      dragOver(e) {
        if (indicator) {
          return indicator.precise.over(dragged, draggedOver, hitMode, indicator);
        }
      }

      move(e) {
        var offset, pos, rel;
        if (dragged) {
          // Dragged over itself must be handled here,
          // as it is not evaluated on `over`
          if (e.currentTarget === dragged) {
            if (!draggedOver || dragged !== draggedOver.get(0)) {
              // console.log dragged
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
            // Last elem and after - switch to last hitmode
            if (this.grid.isLast(ko.dataFor(draggedOver.get(0)))) {
              hitMode = 'last';
            }
          }
          // Rate limiting for hit mode
          if (prevHitMode !== hitMode) {
            prevHitMode = hitMode;
            e.target = draggedOver;
            return this.dragOver(e);
          }
        }
      }

      clear() {
        this.grid.thaw();
        draggedOver = null;
        dragged = null;
        hitMode = null;
        prevHitMode = null;
        didDrop = false;
        // Destroy helpers and indicators
        if (this.helper) {
          this.helper.hide();
          this.helper = null;
        }
        if (indicator) {
          return indicator.hide();
        }
      }

      dragHelper(e) {
        var cell, dropIndicator, item, tbody;
        tbody = jQuery(e.currentTarget).parent();
        cell = tbody.find('.tree-grid-drag-handle').parents('td').first();
        item = cell.clone();
        item.find('.expander .expanded').remove();
        item.find('.expander .collapsed').remove();
        item.find('.expander').remove();
        item.find('.no-expander').remove();
        dropIndicator = "<span class='drop-indicator'>&times;</span>";
        this.helper = jQuery(`<div style='white-space:nowrap;'>${dropIndicator}${item.html()}</div>`);
        this.helper.css("pointer-events", "none");
        indicator.attach(this.helper.find('.drop-indicator'));
        return this.helper;
      }

    };

    
    // Tree grid view instance

    // @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

    Dnd.prototype.grid = null;

    
    // Drag helper

    // @var jQuery element

    Dnd.prototype.helper = null;

    
    // Drop indicator

    // @var Maslosoft.Binder.Widgets.TreeGrid.DropIndicator

    indicator = null;

    
    // Element over which currently item is dragged
    // @var jQuery element

    draggedOver = null;

    
    // Element currently dragged
    // @var HTMLElement

    dragged = null;

    
    // Hit mode
    // @var string

    hitMode = null;

    
    // Previous hit mode, this is used for rate limit of hitMode detection
    // @var string

    prevHitMode = null;

    
    // Whether drop event occured, this is required for edge cases
    // @var boolean

    didDrop = false;

    return Dnd;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.DropIndicator = (function() {
    class DropIndicator {
      constructor(grid) {
        this.grid = grid;
        this.precise = new Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator(this.grid);
      }

      attach(element1) {
        this.element = element1;
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
        // 1/2 of font size
        this.element.css({
          'left': '-.75em'
        });
        // 1/4 of font size
        return this.element.css({
          'top': '-.35em'
        });
      }

      hide() {
        this.element.hide();
        return this.precise.hide();
      }

      show() {
        this.element.show();
        return this.precise.show();
      }

      accept() {
        this.element.html('&check;');
        this.element.css({
          'color': 'green'
        });
        return this.precise.accept();
      }

      deny() {
        this.element.html('&times;');
        this.element.css({
          'color': 'red'
        });
        return this.precise.deny();
      }

    };

    
    // Precise indicator holder
    // @var Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator

    DropIndicator.precise = null;

    
    // Indicator element instance boud to draggable
    // @var jQuery element

    DropIndicator.element = null;

    return DropIndicator;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.Events = (function() {
    class Events {
      constructor(grid, context) {
        this.grid = grid;
        if (!this.grid.config.on) {
          return;
        }
      }

    };

    
    // Tree grid view instance

    // @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

    Events.prototype.grid = null;

    return Events;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.Expanders = (function() {
    var collapse, expand, initExpand;

    class Expanders {
      constructor(grid, context) {
        this.updateExpanders = this.updateExpanders.bind(this);
        this.handler = this.handler.bind(this);
        // Cancel expander click event, as it reacts on mousedown
        // however click would propagate and call action
        this.cancelClick = this.cancelClick.bind(this);
        this.grid = grid;
        // Expanders explicitly disabled
        if (this.grid.config.expanders === false) {
          return;
        }
        // Initialize click handlers only on init
        if (this.grid.context === 'init') {
          this.grid.element.on('mousedown', '.expander', this.handler);
          this.grid.element.on('click', '.expander', this.cancelClick);
        }
        if (this.grid.context === 'update') {
          this.updateExpanders();
        }
      }

      updateExpanders() {
        var defer, one;
        one = (item, data) => {
          var hasChildren;
          hasChildren = data.children && data.children.length;
          if (hasChildren) {
            item.find('.no-expander').hide();
            item.find('.expander').show();
            if (!item.find('.expander .collapsed').is(':visible')) {
              return item.find('.expander .expanded').show();
            }
          } else {
            item.find('.expander').hide();
            return item.find('.no-expander').show();
          }
        };
        //			item.find('.debug').html data.children.length
        defer = () => {
          return this.grid.visit(one);
        };
        //		defer()
        return setTimeout(defer, 0);
      }

      handler(e) {
        var current, depth, initOne, show;
        current = ko.contextFor(e.target).$data;
        // Expanding tree node should not call action
        // @see https://github.com/Maslosoft/Binder/issues/33
        e.stopPropagation();
        e.preventDefault();
        depth = -1;
        show = false;
        log(`clicked on expander ${current.title}`);
        initOne = (item, data) => {
          var itemDepth, manuallyToggled, showChildItems;
          itemDepth = data._treeGrid.depth;
          if (data === current) {
            depth = itemDepth;
            show = initExpand(item);
            item.data('treegrid-manual-state', show);
            return;
          }
          // Not found yet, so continue
          // Current item should be left intact, so skip to next item
          if (depth === -1) {
            return;
          }
          // Found item on same depth, skip further changes
          if (itemDepth === depth) {
            depth = -1;
            return;
          }
          // toggle all one depth lower
          if (itemDepth >= depth) {
            // TODO: Below is a scratch of logic to re-expand or re-collapse
            if (false) {
              // nodes that were manually toggled.
              showChildItems = show;
              // Manually expanded/collapsed sub nodes
              // should have state restored
              manuallyToggled = item.data('treegrid-manual-state');
              if (typeof manuallyToggled !== 'undefined') {
                console.log(manuallyToggled);
                showChildItems = manuallyToggled;
              }
            }
            if (show) {
              item.show();
              return expand(item);
            } else {
              item.hide();
              return collapse(item);
            }
          }
        };
        return this.grid.visit(initOne);
      }

      cancelClick(e) {
        e.stopPropagation();
        return e.preventDefault();
      }

    };

    
    // Init expands
    // @return boolean whether is expanded

    initExpand = function(item) {
      var el, show;
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
      return show;
    };

    
    // Expand expanders

    expand = function(item) {
      var el;
      el = item.find('.expander');
      el.find('.collapsed').hide();
      return el.find('.expanded').show();
    };

    
    // Collapse expanders

    collapse = function(item) {
      var el;
      el = item.find('.expander');
      el.find('.expanded').hide();
      return el.find('.collapsed').show();
    };

    
    // Tree grid view instance

    // @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

    Expanders.prototype.grid = null;

    return Expanders;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator = (function() {
    var coarse, indicator, initialized, precise;

    
    // Insert indicator

    class InsertIndicator {
      constructor(grid) {
        this.grid = grid;
        if (!initialized) {
          this.create();
          initialized = true;
        }
      }

      hide() {
        return indicator.hide();
      }

      show() {
        return indicator.show();
      }

      accept() {
        return indicator.css({
          color: 'green'
        });
      }

      deny() {
        return indicator.css({
          color: 'red'
        });
      }

      
      // Place over element, with hitMode param

      over(dragged, draggedOver, hitMode = 'over', accepter) {
        var left, mid, midFactor, node, nodeMid, offset, top, widthOffset;
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
      }

      
      // Show or hide precise indicator

      precise(showPrecise = true) {
        if (showPrecise) {
          return precise.show();
        } else {
          return precise.hide();
        }
      }

      create() {
        indicator = jQuery(`<div class="tree-grid-insert-indicator" style="display:none;position:absolute;z-index: 10000;color:green;line-height: 1em;">
	<span class="tree-grid-insert-indicator-coarse" style="font-size: 1.5em;">
		&#9654;
	</span>
	<span class="tree-grid-insert-indicator-precise" style="font-size:1.4em;">
		&#11835;
	</span>
</div>`);
        indicator.appendTo('body');
        coarse = indicator.find('.tree-grid-insert-indicator-coarse');
        return precise = indicator.find('.tree-grid-insert-indicator-precise');
      }

    };

    
    // Tree grid view instance

    // @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

    InsertIndicator.prototype.grid = null;

    
    // @private
    // @static

    initialized = false;

    
    // Indicator main wrapper
    // @var jQuery element
    // @private
    // @static

    indicator = null;

    
    // Indicator coarse item
    // @var jQuery element
    // @private
    // @static

    coarse = null;

    
    // Indicator precise item
    // @var jQuery element
    // @private
    // @static

    precise = null;

    return InsertIndicator;

  }).call(this);

  Maslosoft.Binder.Widgets.TreeGrid.TreeGridView = (function() {
    var cellsStyles;

    class TreeGridView {
      constructor(element, valueAccessor = null, context1 = 'init') {
        var j, len, plugin, ref46;
        
        // Visit each node starting from tree root and apply callback.
        // Callback accepts two parameters:

        // * parent - contains current element parent item, might be null
        // * data - contains data attached to element

        this.visitRecursive = this.visitRecursive.bind(this);
        this.getParent = this.getParent.bind(this);
        this.getRoot = this.getRoot.bind(this);
        this.getContext = this.getContext.bind(this);
        
        // Check if parent have child

        this.have = this.have.bind(this);
        
        // Check if it is last on list of table rows

        this.isLast = this.isLast.bind(this);
        
        // Check if can actually drop on draggedOver

        this.canDrop = this.canDrop.bind(this);
        this.remove = this.remove.bind(this);
        
        // Set widths of table cells to strict values.
        // This prevents flickering table when moving nodes.

        this.freeze = this.freeze.bind(this);
        
        // Set widths of table cells back to original style, set by freeze()

        this.thaw = this.thaw.bind(this);
        //		setTimeout defer, 0
        this.getFirstCells = this.getFirstCells.bind(this);
        this.context = context1;
        this.element = jQuery(element);
        if (valueAccessor) {
          this.config = {};
          this.config = ko.unwrap(valueAccessor());
          ref46 = TreeGridView.plugins;
          for (j = 0, len = ref46.length; j < len; j++) {
            plugin = ref46[j];
            new plugin(this);
          }
        }
      }

      //			console.log data
      init() {
        jQuery(document).on('ajaxStart', this.freeze);
        return jQuery(document).on('ajaxComplete', this.thaw);
      }

      dispose() {
        jQuery(document).off('ajaxStart', this.freeze);
        return jQuery(document).off('ajaxComplete', this.thaw);
      }

      
      // Visit each node and apply callback.
      // Callback accepts two parameters:

      // * element - contains current row jQuery element
      // * data - contains data attached to element

      visit(callback) {
        var data, item, items, j, len, results;
        items = this.element.find('> tr');
        results = [];
        for (j = 0, len = items.length; j < len; j++) {
          item = items[j];
          data = ko.dataFor(item);
          results.push(callback(jQuery(item), data));
        }
        return results;
      }

      visitRecursive(callback, model = null) {
        var child, j, k, l, len, len1, len2, len3, m, ref46, ref47, results, results1;
        if (!model) {
          model = this.getRoot();
          callback(null, model);
          if (model.children && model.children.length) {
            ref46 = model.children;
            for (j = 0, len = ref46.length; j < len; j++) {
              child = ref46[j];
              callback(model, child);
              this.visitRecursive(callback, child);
            }
          }
          // Array node
          if (model.length) {
            results = [];
            for (k = 0, len1 = model.length; k < len1; k++) {
              child = model[k];
              callback(model, child);
              results.push(this.visitRecursive(callback, child));
            }
            return results;
          }
        } else {
          if (model.children && model.children.length) {
            ref47 = model.children;
            for (l = 0, len2 = ref47.length; l < len2; l++) {
              child = ref47[l];
              callback(model, child);
              this.visitRecursive(callback, child);
            }
          }
          // Array node
          if (model.length) {
            results1 = [];
            for (m = 0, len3 = model.length; m < len3; m++) {
              child = model[m];
              callback(model, child);
              results1.push(this.visitRecursive(callback, child));
            }
            return results1;
          }
        }
      }

      getParent(model) {
        var found, one;
        found = null;
        one = function(parent, data) {
          if (data === model) {
            return found = parent;
          }
        };
        // Don't set model here to start from root
        this.visitRecursive(one);
        return found;
      }

      getRoot() {
        var ctx;
        ctx = ko.contextFor(this.element.get(0));
        return ctx.tree;
      }

      getContext() {
        return ko.contextFor(this.element.get(0));
      }

      have(parent, child) {
        var found, one;
        found = false;
        one = function(parent, data) {
          if (data === child) {
            return found = true;
          }
        };
        // Start from parent here
        this.visitRecursive(one, parent);
        return found;
      }

      isLast(model) {
        var last, lastRow;
        lastRow = this.element.find('> tr:last()');
        last = ko.dataFor(lastRow.get(0));
        if (model === last) {
          return true;
        }
        return false;
      }

      canDrop(dragged, draggedOver, hitMode) {
        var current, over;
        current = ko.dataFor(dragged);
        over = ko.dataFor(draggedOver.get(0));
        //		log current.title
        //		log over.title

        // Allow adding to the end of table
        if (hitMode === 'last') {
          return true;
        }
        // Allow adding to the end of list
        if (hitMode === 'after') {
          return true;
        }
        // Forbid dropping on itself
        if (current === over) {
          return false;
        }
        // Forbid dropping on children of current node
        if (this.have(current, over)) {
          return false;
        }
        return true;
      }

      remove(model) {
        var one;
        one = function(parent, data) {
          if (parent) {
            // Model initialized
            if (parent.children) {
              return parent.children.remove(model);
            } else {
              // Array initialized
              return parent.remove(model);
            }
          }
        };
        // Don't set model here to start from root
        return this.visitRecursive(one);
      }

      expandAll() {}

      collapseAll() {}

      freeze() {
        var $cell, cell, cells, j, len, results;
        console.log("Freeze");
        // Reset stored width values
        cellsStyles = [];
        cells = this.getFirstCells();
        console.log(cells);
        results = [];
        for (j = 0, len = cells.length; j < len; j++) {
          cell = cells[j];
          //			log cell
          cellsStyles.push(cell.style);
          $cell = jQuery(cell);
          //			log $cell.width()
          results.push($cell.css('width', $cell.width() + 'px'));
        }
        return results;
      }

      thaw() {
        var defer;
        defer = () => {
          var cell, cells, index, j, len, results;
          console.log('thaw');
          cells = this.getFirstCells();
          results = [];
          for (index = j = 0, len = cells.length; j < len; index = ++j) {
            cell = cells[index];
            results.push(cell.style = cellsStyles[index]);
          }
          return results;
        };
        // TODO setTimeout should be avoided, investigate if should be used
        // Unfreezing takes some time...
        // This needs to be delayed a bit or flicker will still occur
        return defer();
      }

      getFirstCells() {
        var cells, table;
        table = this.element;
        if (this.element.is('tbody')) {
          table = this.element.parent();
        }
        cells = table.find('thead tr:first() th');
        if (!cells || !cells.length) {
          cells = table.find('tr:first() td');
        }
        if (!cells || !cells.length) {
          cells = table.find('tbody tr:first() td');
        }
        if (!cells || !cells.length) {
          cells = table.find('tfoot tr:first() th');
        }
        return cells;
      }

    };

    
    // Plugins for tree grid

    // NOTE: Order of plugins *might* be important, especially for built-in plugins

    // @var Object[]

    TreeGridView.plugins = [Maslosoft.Binder.Widgets.TreeGrid.Expanders, Maslosoft.Binder.Widgets.TreeGrid.Dnd, Maslosoft.Binder.Widgets.TreeGrid.Events];

    
    // TBODY element - root of tree

    // @var jQuery element

    TreeGridView.prototype.element = null;

    
    // Configuration of binding

    // @var Object

    TreeGridView.prototype.config = null;

    cellsStyles = [];

    return TreeGridView;

  }).call(this);

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

  this.Maslosoft.Ko.objByName = function(name, context = window) {
    var args, func, i, j, len, n, ns, part;
    args = Array.prototype.slice.call(arguments, 2);
    ns = name.split(".");
    func = context;
    part = [];
    for (i = j = 0, len = ns.length; j < len; i = ++j) {
      n = ns[i];
      part.push(n);
      if (typeof func[n] === 'undefined') {
        throw new Error(`Name part \`${part.join('.')}\` not found while accesing ${name}`);
      }
      func = func[n];
    }
    return func;
  };

  this.Maslosoft.Ko.Track = class Track {
    constructor() {
      this.factory = this.factory.bind(this);
      this.fromJs = this.fromJs.bind(this);
    }

    factory(data) {
      var Error, className, index, j, len, model, name, ref, value;
      // Return if falsey value
      if (!data) {
        return data;
      }
      // Check if has prototype
      if (data._class && typeof data._class === 'string') {
        // Convert PHP class name to js class name
        className = data._class.replace(/\\/g, '.');
        try {
          ref = Maslosoft.Ko.objByName(className);
        } catch (error1) {
          Error = error1;
          console.warn(`Could not resolve class name \`${className}\``);
        }
        if (ref) {
          return new ref(data);
        } else {
          console.warn(`Class \`${className}\` not found, using default object`);
          console.debug(data);
        }
      }
      // Track generic object
      if (typeof data === 'object') {
        data = ko.track(data, {
          deep: true
        });
        // Check if array (different loop used here)
        if (Array.isArray(data)) {
          for (index = j = 0, len = data.length; j < len; index = ++j) {
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
    }

    fromJs(model, jsData) {
      var name, results, value;
      results = [];
      for (name in jsData) {
        value = jsData[name];
        if (typeof value === 'object') {
          if (Array.isArray(value)) {
            model[name] = this.factory(value);
            continue;
          }
          if (model[name]) {
            results.push(this.fromJs(model[name], value));
          } else {
            results.push(model[name] = this.factory(value));
          }
        } else {
          results.push(model[name] = value);
        }
      }
      return results;
    }

  };

  ko.tracker = new this.Maslosoft.Ko.Track();

  if (!window.Proxy) {
    console.warn('Your browser does not support Proxy, will not work properly in some cases...');
    window.Proxy = class Proxy {};
  }

  ModelProxyHandler = class ModelProxyHandler {
    constructor(parent1, field1) {
      this.parent = parent1;
      this.field = field1;
    }

    set(target, name, value, receiver) {
      var after, before, changed;
      changed = false;
      // Detect value change
      if (target[name] !== value) {
        //			log "Changed: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
        changed = true;
      }
      // Detect keys change
      before = Object.keys(target).length;
      target[name] = value;
      after = Object.keys(target).length;
      if (before !== after) {
        //			log "New key: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
        changed = true;
      }
      
      // Notify change
      if (changed) {
        ko.valueHasMutated(this.parent, this.field);
      }
      return true;
    }

    deleteProperty(target, name) {
      delete target[name];
      // Notify change
      //		log "Deleted: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
      ko.valueHasMutated(this.parent, this.field);
      return true;
    }

  };

  // Map for concrete objects initializations
  if (WeakMap) {
    initMap = new WeakMap();
  } else {
    initMap = new Map();
  }

  this.Maslosoft.Binder.Model = class Model {
    constructor(data = null) {
      var initialized, name, ref46, ref47, ref48, value;
      initialized = initMap.get(this);
      ref46 = this;
      // Dereference first
      for (name in ref46) {
        value = ref46[name];
        if (isPlainObject(this[name])) {
          this[name] = {};
        }
        if (Array.isArray(this[name])) {
          this[name] = [];
        }
      }
      // Initialize new object
      if (!initialized) {
        initMap.set(this, true);
        ref47 = this;
        // Reassign here is required - when using model with values from class prototype only
        for (name in ref47) {
          value = ref47[name];
          this[name] = ko.tracker.factory(value);
          // Extra track of object properties.
          if (isPlainObject(this[name])) {
            this[name] = new Proxy(this[name], new ModelProxyHandler(this, name));
          }
        }
      }
// Apply data
      for (name in data) {
        value = data[name];
        this[name] = ko.tracker.factory(value);
      }
      ref48 = this;
      // Track plain objects always
      for (name in ref48) {
        value = ref48[name];
        if (isPlainObject(this[name])) {
          this[name] = new Proxy(this[name], new ModelProxyHandler(this, name));
        }
      }
      ko.track(this, {
        deep: true
      });
    }

  };

  // For backward compatibility
  this.Maslosoft.Ko.Balin = this.Maslosoft.Binder;

  this.Maslosoft.Ko.escapeRegExp = escapeRegExp;

  this.Maslosoft.Ko.escapeHtml = escapeHtml;

  this.Maslosoft.Ko.equals = equals;

  this.Maslosoft.Ko.stringToColour = stringToColour;

  this.Maslosoft.Ko.preload = preload;

  this.Maslosoft.Ko.numberFormat = numberFormat;

  this.Maslosoft.Ko.lcfirst = lcfirst;

  this.Maslosoft.Ko.ucfirst = ucfirst;

}).call(this);

//# sourceMappingURL=ko.binder-noinit.js.map
