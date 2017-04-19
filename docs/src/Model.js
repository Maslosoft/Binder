(function() {
  var _ref, _ref1, _ref10, _ref11, _ref12, _ref13, _ref14, _ref15, _ref16, _ref17, _ref18, _ref19, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  if (!this.Maslosoft) {
    this.Maslosoft = {};
  }

  if (!this.Maslosoft.Ko.BalinDev) {
    this.Maslosoft.Ko.BalinDev = {};
  }

  if (!this.Maslosoft.Ko.BalinDev.Models) {
    this.Maslosoft.Ko.BalinDev.Models = {};
  }

  this.Maslosoft.Ko.BalinDev.FancyTreeDropHandler = (function() {
    function FancyTreeDropHandler(node, data) {
      this.getNode = __bind(this.getNode, this);
    }

    FancyTreeDropHandler.prototype.getNode = function(node) {
      console.log("Transform node...");
      console.log(node);
      return node;
    };

    return FancyTreeDropHandler;

  })();

  this.Maslosoft.Ko.BalinDev.Models.TreeItem = (function(_super) {
    __extends(TreeItem, _super);

    TreeItem.idCounter = 0;

    TreeItem.prototype._class = "Maslosoft.Ko.BalinDev.Models.TreeItem";

    TreeItem.prototype.id = 0;

    TreeItem.prototype.title = '';

    TreeItem.prototype.description = '';

    TreeItem.prototype.children = [];

    function TreeItem(data) {
      if (data == null) {
        data = null;
      }
      this.children = new Array;
      TreeItem.__super__.constructor.call(this, data);
      this.id = TreeItem.idCounter++;
    }

    return TreeItem;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Intro = (function(_super) {
    __extends(Intro, _super);

    function Intro() {
      _ref = Intro.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    Intro.prototype._class = "Maslosoft.Ko.BalinDev.Models.Intro";

    Intro.prototype.text = '';

    return Intro;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.FileSizeFormatter = (function(_super) {
    __extends(FileSizeFormatter, _super);

    function FileSizeFormatter() {
      _ref1 = FileSizeFormatter.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    FileSizeFormatter.prototype._class = "Maslosoft.Ko.BalinDev.Models.FileSizeFormatter";

    FileSizeFormatter.prototype.size = 0;

    return FileSizeFormatter;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.DecimalFormatter = (function(_super) {
    __extends(DecimalFormatter, _super);

    function DecimalFormatter() {
      _ref2 = DecimalFormatter.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    DecimalFormatter.prototype._class = "Maslosoft.Ko.BalinDev.Models.DecimalFormatter";

    DecimalFormatter.prototype.value = 0;

    return DecimalFormatter;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Href = (function(_super) {
    __extends(Href, _super);

    function Href() {
      _ref3 = Href.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    Href.prototype._class = "Maslosoft.Ko.BalinDev.Models.Href";

    Href.prototype.filename = '';

    return Href;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Src = (function(_super) {
    __extends(Src, _super);

    function Src() {
      _ref4 = Src.__super__.constructor.apply(this, arguments);
      return _ref4;
    }

    Src.prototype._class = "Maslosoft.Ko.BalinDev.Models.Src";

    Src.prototype.filename = '';

    return Src;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.HtmlValue = (function(_super) {
    __extends(HtmlValue, _super);

    function HtmlValue() {
      _ref5 = HtmlValue.__super__.constructor.apply(this, arguments);
      return _ref5;
    }

    HtmlValue.prototype._class = "Maslosoft.Ko.BalinDev.Models.HtmlValue";

    HtmlValue.prototype.text = '';

    return HtmlValue;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.TextValue = (function(_super) {
    __extends(TextValue, _super);

    function TextValue() {
      _ref6 = TextValue.__super__.constructor.apply(this, arguments);
      return _ref6;
    }

    TextValue.prototype._class = "Maslosoft.Ko.BalinDev.Models.TextValue";

    TextValue.prototype.text = '';

    return TextValue;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.SortableHtmlValues = (function(_super) {
    __extends(SortableHtmlValues, _super);

    function SortableHtmlValues() {
      _ref7 = SortableHtmlValues.__super__.constructor.apply(this, arguments);
      return _ref7;
    }

    SortableHtmlValues.prototype._class = "Maslosoft.Ko.BalinDev.Models.SortableHtmlValues";

    SortableHtmlValues.prototype.title = '';

    SortableHtmlValues.prototype.items = [];

    return SortableHtmlValues;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Selected = (function(_super) {
    __extends(Selected, _super);

    function Selected() {
      _ref8 = Selected.__super__.constructor.apply(this, arguments);
      return _ref8;
    }

    Selected.prototype._class = "Maslosoft.Ko.BalinDev.Models.Selected";

    Selected.prototype.isSelected = false;

    return Selected;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Enum = (function(_super) {
    __extends(Enum, _super);

    function Enum() {
      _ref9 = Enum.__super__.constructor.apply(this, arguments);
      return _ref9;
    }

    Enum.prototype._class = "Maslosoft.Ko.BalinDev.Models.Enum";

    Enum.prototype.status = 0;

    return Enum;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Hidden = (function(_super) {
    __extends(Hidden, _super);

    function Hidden() {
      _ref10 = Hidden.__super__.constructor.apply(this, arguments);
      return _ref10;
    }

    Hidden.prototype._class = "Maslosoft.Ko.BalinDev.Models.Hidden";

    Hidden.prototype.show = true;

    return Hidden;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Icon = (function(_super) {
    __extends(Icon, _super);

    function Icon() {
      _ref11 = Icon.__super__.constructor.apply(this, arguments);
      return _ref11;
    }

    Icon.prototype._class = "Maslosoft.Ko.BalinDev.Models.Icon";

    Icon.prototype.icon = '';

    Icon.prototype.isImage = true;

    Icon.prototype.iconSize = 64;

    Icon.prototype.updateDate = {
      sec: 21232323
    };

    return Icon;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Tooltip = (function(_super) {
    __extends(Tooltip, _super);

    function Tooltip() {
      _ref12 = Tooltip.__super__.constructor.apply(this, arguments);
      return _ref12;
    }

    Tooltip.prototype._class = "Maslosoft.Ko.BalinDev.Models.Tooltip";

    Tooltip.prototype.title = '';

    return Tooltip;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Asset = (function(_super) {
    __extends(Asset, _super);

    function Asset() {
      _ref13 = Asset.__super__.constructor.apply(this, arguments);
      return _ref13;
    }

    Asset.prototype._class = "Maslosoft.Ko.BalinDev.Models.Asset";

    Asset.prototype.url = '';

    Asset.prototype.updateDate = {
      sec: 21232323
    };

    return Asset;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.DateTime = (function(_super) {
    __extends(DateTime, _super);

    function DateTime() {
      _ref14 = DateTime.__super__.constructor.apply(this, arguments);
      return _ref14;
    }

    DateTime.prototype._class = "Maslosoft.Ko.BalinDev.Models.DateTime";

    DateTime.prototype.url = '';

    DateTime.prototype.date = 21232323;

    return DateTime;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Nested = (function(_super) {
    __extends(Nested, _super);

    function Nested() {
      _ref15 = Nested.__super__.constructor.apply(this, arguments);
      return _ref15;
    }

    Nested.prototype._class = "Maslosoft.Ko.BalinDev.Models.Nested";

    Nested.prototype.rawI18N = '';

    return Nested;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Video = (function(_super) {
    __extends(Video, _super);

    function Video() {
      _ref16 = Video.__super__.constructor.apply(this, arguments);
      return _ref16;
    }

    Video.prototype._class = "Maslosoft.Ko.BalinDev.Models.Video";

    Video.prototype.url = '';

    Video.prototype.title = '';

    return Video;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.Videos = (function(_super) {
    __extends(Videos, _super);

    function Videos() {
      _ref17 = Videos.__super__.constructor.apply(this, arguments);
      return _ref17;
    }

    Videos.prototype._class = "Maslosoft.Ko.BalinDev.Models.Video";

    Videos.prototype.videos = [];

    return Videos;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.DatePicker = (function(_super) {
    __extends(DatePicker, _super);

    function DatePicker() {
      _ref18 = DatePicker.__super__.constructor.apply(this, arguments);
      return _ref18;
    }

    DatePicker.prototype._class = "Maslosoft.Ko.BalinDev.Models.DatePicker";

    DatePicker.prototype.date = 1473839950;

    return DatePicker;

  })(this.Maslosoft.Ko.Balin.Model);

  this.Maslosoft.Ko.BalinDev.Models.AclUser = (function(_super) {
    __extends(AclUser, _super);

    function AclUser() {
      _ref19 = AclUser.__super__.constructor.apply(this, arguments);
      return _ref19;
    }

    AclUser.prototype._class = "Maslosoft.Ko.BalinDev.Models.AclUser";

    AclUser.prototype.isGuest = true;

    return AclUser;

  })(this.Maslosoft.Ko.Balin.Model);

}).call(this);
