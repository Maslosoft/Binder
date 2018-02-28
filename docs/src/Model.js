// Generated by CoffeeScript 1.12.7
(function() {
  var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  if (!this.Maslosoft) {
    this.Maslosoft = {};
  }

  if (!this.Maslosoft.Ko) {
    this.Maslosoft.Ko = {};
  }

  if (!this.Maslosoft.Ko.BalinDev) {
    this.Maslosoft.Ko.BalinDev = {};
  }

  if (!this.Maslosoft.Ko.BalinDev.Models) {
    this.Maslosoft.Ko.BalinDev.Models = {};
  }

  if (!this.Maslosoft.Ko.BalinDev.Widgets) {
    this.Maslosoft.Ko.BalinDev.Widgets = {};
  }

  this.Maslosoft.Ko.BalinDev.FancyTreeDropHandler = (function() {
    function FancyTreeDropHandler(node, data) {
      this.getNode = bind(this.getNode, this);
    }

    FancyTreeDropHandler.prototype.getNode = function(node) {
      console.log("Transform node...");
      console.log(node);
      return node;
    };

    return FancyTreeDropHandler;

  })();

  this.Maslosoft.Ko.BalinDev.Models.TreeItem = (function(superClass) {
    extend(TreeItem, superClass);

    TreeItem.idCounter = 0;

    TreeItem.prototype._class = "Maslosoft.Ko.BalinDev.Models.TreeItem";

    TreeItem.prototype.id = 0;

    TreeItem.prototype.title = '';

    TreeItem.prototype.description = '';

    TreeItem.prototype.children = null;

    function TreeItem(data) {
      if (data == null) {
        data = null;
      }
      this.children = [];
      TreeItem.__super__.constructor.call(this, data);
      this.id = TreeItem.idCounter++;
    }

    return TreeItem;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Intro = (function(superClass) {
    extend(Intro, superClass);

    function Intro() {
      return Intro.__super__.constructor.apply(this, arguments);
    }

    Intro.prototype._class = "Maslosoft.Ko.BalinDev.Models.Intro";

    Intro.prototype.text = '';

    return Intro;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.FileSizeFormatter = (function(superClass) {
    extend(FileSizeFormatter, superClass);

    function FileSizeFormatter() {
      return FileSizeFormatter.__super__.constructor.apply(this, arguments);
    }

    FileSizeFormatter.prototype._class = "Maslosoft.Ko.BalinDev.Models.FileSizeFormatter";

    FileSizeFormatter.prototype.size = 0;

    return FileSizeFormatter;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.DecimalFormatter = (function(superClass) {
    extend(DecimalFormatter, superClass);

    function DecimalFormatter() {
      return DecimalFormatter.__super__.constructor.apply(this, arguments);
    }

    DecimalFormatter.prototype._class = "Maslosoft.Ko.BalinDev.Models.DecimalFormatter";

    DecimalFormatter.prototype.value = 0;

    return DecimalFormatter;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Href = (function(superClass) {
    extend(Href, superClass);

    function Href() {
      return Href.__super__.constructor.apply(this, arguments);
    }

    Href.prototype._class = "Maslosoft.Ko.BalinDev.Models.Href";

    Href.prototype.filename = '';

    return Href;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Src = (function(superClass) {
    extend(Src, superClass);

    function Src() {
      return Src.__super__.constructor.apply(this, arguments);
    }

    Src.prototype._class = "Maslosoft.Ko.BalinDev.Models.Src";

    Src.prototype.filename = '';

    return Src;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.HtmlValue = (function(superClass) {
    extend(HtmlValue, superClass);

    function HtmlValue() {
      return HtmlValue.__super__.constructor.apply(this, arguments);
    }

    HtmlValue.prototype._class = "Maslosoft.Ko.BalinDev.Models.HtmlValue";

    HtmlValue.prototype.text = '';

    return HtmlValue;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.TextValue = (function(superClass) {
    extend(TextValue, superClass);

    function TextValue() {
      return TextValue.__super__.constructor.apply(this, arguments);
    }

    TextValue.prototype._class = "Maslosoft.Ko.BalinDev.Models.TextValue";

    TextValue.prototype.text = '';

    return TextValue;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.SortableHtmlValues = (function(superClass) {
    extend(SortableHtmlValues, superClass);

    function SortableHtmlValues() {
      return SortableHtmlValues.__super__.constructor.apply(this, arguments);
    }

    SortableHtmlValues.prototype._class = "Maslosoft.Ko.BalinDev.Models.SortableHtmlValues";

    SortableHtmlValues.prototype.title = '';

    SortableHtmlValues.prototype.items = [];

    return SortableHtmlValues;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Selected = (function(superClass) {
    extend(Selected, superClass);

    function Selected() {
      return Selected.__super__.constructor.apply(this, arguments);
    }

    Selected.prototype._class = "Maslosoft.Ko.BalinDev.Models.Selected";

    Selected.prototype.isSelected = false;

    return Selected;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Enum = (function(superClass) {
    extend(Enum, superClass);

    function Enum() {
      return Enum.__super__.constructor.apply(this, arguments);
    }

    Enum.prototype._class = "Maslosoft.Ko.BalinDev.Models.Enum";

    Enum.prototype.status = 0;

    return Enum;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Hidden = (function(superClass) {
    extend(Hidden, superClass);

    function Hidden() {
      return Hidden.__super__.constructor.apply(this, arguments);
    }

    Hidden.prototype._class = "Maslosoft.Ko.BalinDev.Models.Hidden";

    Hidden.prototype.show = true;

    return Hidden;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Icon = (function(superClass) {
    extend(Icon, superClass);

    function Icon() {
      return Icon.__super__.constructor.apply(this, arguments);
    }

    Icon.prototype._class = "Maslosoft.Ko.BalinDev.Models.Icon";

    Icon.prototype.icon = '';

    Icon.prototype.isImage = true;

    Icon.prototype.iconSize = 64;

    Icon.prototype.filename = '';

    Icon.prototype.updateDate = {
      sec: 21232323
    };

    return Icon;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Tooltip = (function(superClass) {
    extend(Tooltip, superClass);

    function Tooltip() {
      return Tooltip.__super__.constructor.apply(this, arguments);
    }

    Tooltip.prototype._class = "Maslosoft.Ko.BalinDev.Models.Tooltip";

    Tooltip.prototype.title = '';

    return Tooltip;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Asset = (function(superClass) {
    extend(Asset, superClass);

    function Asset() {
      return Asset.__super__.constructor.apply(this, arguments);
    }

    Asset.prototype._class = "Maslosoft.Ko.BalinDev.Models.Asset";

    Asset.prototype.url = '';

    Asset.prototype.updateDate = {
      sec: 21232323
    };

    return Asset;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.DateTime = (function(superClass) {
    extend(DateTime, superClass);

    function DateTime() {
      return DateTime.__super__.constructor.apply(this, arguments);
    }

    DateTime.prototype._class = "Maslosoft.Ko.BalinDev.Models.DateTime";

    DateTime.prototype.url = '';

    DateTime.prototype.date = 21232323;

    return DateTime;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Nested = (function(superClass) {
    extend(Nested, superClass);

    function Nested() {
      return Nested.__super__.constructor.apply(this, arguments);
    }

    Nested.prototype._class = "Maslosoft.Ko.BalinDev.Models.Nested";

    Nested.prototype.rawI18N = '';

    return Nested;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Video = (function(superClass) {
    extend(Video, superClass);

    function Video() {
      return Video.__super__.constructor.apply(this, arguments);
    }

    Video.prototype._class = "Maslosoft.Ko.BalinDev.Models.Video";

    Video.prototype.url = '';

    Video.prototype.title = '';

    return Video;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Videos = (function(superClass) {
    extend(Videos, superClass);

    function Videos() {
      return Videos.__super__.constructor.apply(this, arguments);
    }

    Videos.prototype._class = "Maslosoft.Ko.BalinDev.Models.Video";

    Videos.prototype.videos = [];

    return Videos;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.DatePicker = (function(superClass) {
    extend(DatePicker, superClass);

    function DatePicker() {
      return DatePicker.__super__.constructor.apply(this, arguments);
    }

    DatePicker.prototype._class = "Maslosoft.Ko.BalinDev.Models.DatePicker";

    DatePicker.prototype.date = 1473839950;

    return DatePicker;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.AclUser = (function(superClass) {
    extend(AclUser, superClass);

    function AclUser() {
      return AclUser.__super__.constructor.apply(this, arguments);
    }

    AclUser.prototype._class = "Maslosoft.Ko.BalinDev.Models.AclUser";

    AclUser.prototype.isGuest = true;

    return AclUser;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Options = (function(superClass) {
    extend(Options, superClass);

    Options.prototype._class = "Maslosoft.Ko.BalinDev.Models.Options";

    Options.prototype.selected = null;

    function Options(data) {
      if (data == null) {
        data = null;
      }
      Options.__super__.constructor.call(this, data);
    }

    return Options;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Widgets.MyWidget = (function() {
    var i, originalTitle;

    i = 0;

    originalTitle = '';

    MyWidget.prototype.title = '';

    function MyWidget() {
      this.log = bind(this.log, this);
      this.dispose = bind(this.dispose, this);
      this.init = bind(this.init, this);
      this.log("Create");
    }

    MyWidget.prototype.init = function(element) {
      if (!originalTitle) {
        originalTitle = this.title;
      }
      this.title = originalTitle + " #" + i;
      element.innerHTML = this.title;
      return this.log("Init");
    };

    MyWidget.prototype.dispose = function(element) {
      return this.log("Dispose");
    };

    MyWidget.prototype.log = function(message) {
      i++;
      return jQuery('#widgetLog').append("<div>" + i + ". " + message + "</div>");
    };

    return MyWidget;

  })();

  this.Maslosoft.Ko.BalinDev.Models.Columns = (function(superClass) {
    extend(Columns, superClass);

    function Columns() {
      return Columns.__super__.constructor.apply(this, arguments);
    }

    Columns.prototype.columns = null;

    Columns.prototype.sizes = null;

    return Columns;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.UiColumns = (function(superClass) {
    extend(UiColumns, superClass);

    function UiColumns() {
      return UiColumns.__super__.constructor.apply(this, arguments);
    }

    UiColumns.prototype.lg = 4;

    UiColumns.prototype.md = 4;

    UiColumns.prototype.sm = 2;

    UiColumns.prototype.xs = 2;

    return UiColumns;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Widgets.MyOtherWidget = (function() {
    var i, originalTitle;

    i = 0;

    originalTitle = '';

    MyOtherWidget.prototype.title = '';

    function MyOtherWidget() {
      this.log = bind(this.log, this);
      this.dispose = bind(this.dispose, this);
      this.init = bind(this.init, this);
      this.log("Create other");
    }

    MyOtherWidget.prototype.init = function(element) {
      if (!originalTitle) {
        originalTitle = this.title;
      }
      if (i > 1) {
        this.title = originalTitle + " #" + i;
      }
      element.innerHTML = this.title;
      return this.log("Init other");
    };

    MyOtherWidget.prototype.dispose = function(element) {
      return this.log("Dispose other");
    };

    MyOtherWidget.prototype.log = function(message) {
      i++;
      return jQuery('#widgetLog2').append("<div>" + i + ". " + message + "</div>");
    };

    return MyOtherWidget;

  })();

  this.Maslosoft.Ko.CssClasses = (function(superClass) {
    extend(CssClasses, superClass);

    function CssClasses() {
      return CssClasses.__super__.constructor.apply(this, arguments);
    }

    CssClasses.prototype._class = "Maslosoft.Ko.BalinDev.Models.CssClasses";

    CssClasses.prototype.classes = [];

    CssClasses.prototype.classList = '';

    return CssClasses;

  })(this.Maslosoft.Ko.Balin.Model);

}).call(this);
