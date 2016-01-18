if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}
if not @Maslosoft.Ko.BalinDev.Models
	@Maslosoft.Ko.BalinDev.Models = {}

class @Maslosoft.Ko.BalinDev.Models.TreeItem extends @Maslosoft.Ko.Balin.Model
	@idCounter = 0
	_class: "Maslosoft.Ko.BalinDev.Models.TreeItem"
	id: 0
	title: ''
	children: []

	constructor: (data = null) ->
		super data
		@id = TreeItem.idCounter++


class @Maslosoft.Ko.BalinDev.Models.Intro extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Intro"
	text: ''

class @Maslosoft.Ko.BalinDev.Models.FileSizeFormatter extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.FileSizeFormatter"
	size: 0

class @Maslosoft.Ko.BalinDev.Models.Href extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Href"
	filename: ''

class @Maslosoft.Ko.BalinDev.Models.Src extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Src"
	filename: ''

class @Maslosoft.Ko.BalinDev.Models.HtmlValue extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.HtmlValue"
	text: ''

class @Maslosoft.Ko.BalinDev.Models.TextValue extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.TextValue"
	text: ''

class @Maslosoft.Ko.BalinDev.Models.SortableHtmlValues extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.SortableHtmlValues"
	title: ''
	items: []

class @Maslosoft.Ko.BalinDev.Models.Selected extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Selected"
	isSelected: false

class @Maslosoft.Ko.BalinDev.Models.Enum extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Enum"
	status: 0

class @Maslosoft.Ko.BalinDev.Models.Hidden extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Hidden"
	show: true

class @Maslosoft.Ko.BalinDev.Models.Icon extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Icon"
	icon: ''
	isImage: true
	iconSize: 64
	updateDate: {
		sec: 21232323
	}

class @Maslosoft.Ko.BalinDev.Models.Tooltip extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Tooltip"
	title: ''

class @Maslosoft.Ko.BalinDev.Models.Asset extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Asset"
	url: ''
	updateDate: {
		sec: 21232323
	}

class @Maslosoft.Ko.BalinDev.Models.DateTime extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.DateTime"
	url: ''
	date: 21232323

class @Maslosoft.Ko.BalinDev.Models.Nested extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Nested"
	rawI18N: ''
