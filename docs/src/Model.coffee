if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko
	@Maslosoft.Ko = {}
if not @Maslosoft.Koe
	@Maslosoft.Koe = {}
if not @Maslosoft.BinderDev
	@Maslosoft.BinderDev = {}
if not @Maslosoft.BinderDev.Models
	@Maslosoft.BinderDev.Models = {}
if not @Maslosoft.BinderDev.Widgets
	@Maslosoft.BinderDev.Widgets = {}

class @Maslosoft.BinderDev.FancyTreeDropHandler

	constructor: (node, data) ->
		
	getNode: (node) =>
		console.log "Transform node..."
		console.log node
		return node

class @Maslosoft.Koe.TreeItem extends @Maslosoft.Binder.Model
	@idCounter = 0
	_class: "Maslosoft.Koe.TreeItem"
	id: 0
	title: ''
	description: ''
	children: null

	constructor: (data = null) ->
		@children = []
		super data
		@id = TreeItem.idCounter++


class @Maslosoft.Koe.Intro extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Intro"
	text: ''

class @Maslosoft.Koe.FileSizeFormatter extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.FileSizeFormatter"
	size: 0

class @Maslosoft.Koe.DecimalFormatter extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.DecimalFormatter"
	value: 0

class @Maslosoft.Koe.Href extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Href"
	filename: ''

class @Maslosoft.Koe.Src extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Src"
	filename: ''

class @Maslosoft.Koe.HtmlValue extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.HtmlValue"
	text: ''

class @Maslosoft.Koe.TextValue extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.TextValue"
	text: ''

class @Maslosoft.Koe.SortableHtmlValues extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.SortableHtmlValues"
	title: ''
	items: []

class @Maslosoft.Koe.Selected extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Selected"
	isSelected: false

class @Maslosoft.Koe.Enum extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Enum"
	status: 0

class @Maslosoft.Koe.Hidden extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Hidden"
	show: true

class @Maslosoft.Koe.Icon extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Icon"
	icon: ''
	isImage: true
	iconSize: 64
	filename: ''
	updateDate: {
		sec: 21232323
	}

class @Maslosoft.Koe.Id extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Id"
	id: ''

class @Maslosoft.Koe.Tooltip extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Tooltip"
	title: ''

class @Maslosoft.Koe.Asset extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Asset"
	url: ''
	updateDate: {
		sec: 21232323
	}

class @Maslosoft.Koe.DateTime extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.DateTime"
	url: ''
	date: 21232323

class @Maslosoft.Koe.Nested extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Nested"
	rawI18N: ''

class @Maslosoft.Koe.Video extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Video"
	url: ''
	title: ''

class @Maslosoft.Koe.Videos extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Video"
	videos: []

class @Maslosoft.Koe.DatePicker extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.DatePicker"
	date: 1473839950


class @Maslosoft.Koe.AclUser extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.AclUser"
	isGuest: true

class @Maslosoft.Koe.Options extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.Options"
	selected: null

	constructor: (data = null) ->
		super data
		
class @Maslosoft.BinderDev.Widgets.MyWidget
	
	i = 0
	
	originalTitle = ''
	
	title: ''
	
	
	constructor: () ->
		@log "Create"
	
	init: (element) =>
		if not originalTitle
			originalTitle = @title
		@title = "#{originalTitle} ##{i}"
		element.innerHTML = @title
		@log "Init"
		
	dispose: (element) =>
		@log "Dispose"
		
	log: (message) =>
		i++
		jQuery('#widgetLog').append "<div>#{i}. #{message}</div>"

class @Maslosoft.Koe.Columns  extends @Maslosoft.Binder.Model

	#
	#
	# @var Maslosoft.Koe.UiColumns
	#
	columns: null

	#
	#
	# @var Maslosoft.Koe.UiColumns
	#
	sizes: null

class @Maslosoft.Koe.UiColumns extends @Maslosoft.Binder.Model

	#
	# On HD displays
	#
	# @var integer
	#
	lg: 4

	#
	# On laptops
	#
	# @var integer
	#
	md: 4

	#
	# On tablets
	#
	# @var integer
	#
	sm: 2

	#
	# On small mobile
	#
	# @var integer
	#
	xs: 2


class @Maslosoft.BinderDev.Widgets.MyOtherWidget

	i = 0

	originalTitle = ''

	title: ''


	constructor: () ->
		@log "Create other"

	init: (element) =>
		if not originalTitle
			originalTitle = @title
		if i > 1
			@title = "#{originalTitle} ##{i}"
		element.innerHTML = @title
		@log "Init other"

	dispose: (element) =>
		@log "Dispose other"

	log: (message) =>
		i++
		jQuery('#widgetLog2').append "<div>#{i}. #{message}</div>"

class @Maslosoft.Koe.CssClasses extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Koe.CssClasses"
	classes: []
	classList: ''

class @Maslosoft.Koe.Smileys

	enabled: true

	@smileys:
		':)': 'smiley.png'
		':(': 'smiley-sad.png'
		'8)': 'smiley-cool.png'

	@dir: '../src/images'

	getModelValue: (element, value) =>

		if not @enabled
			return value

		# Convert images back to smileys

		val = jQuery("<div>#{value}</div>")
		for smiley, image of Smileys.smileys
			selector = "[data-smiley='#{smiley}']"
			#console.log selector
			for el in val.find(selector)
				jQuery(el).replaceWith(smiley)

		value = val.html()

		return value

	getElementValue: (element, value) =>
		if not @enabled
			return value


		# Update will cause caret jumping
		# in htmlValue binding. For this plugin this could suffice...
		# see for selection save restore: http://jsfiddle.net/Y8pJ7/8/
		for smiley, image of Smileys.smileys
			re = new RegExp(Maslosoft.Ko.escapeRegExp(smiley), 'g')
			value = value.replace re, "<img src='#{Smileys.dir}/#{image}' data-smiley='#{smiley}'/>"

		return value

class @Maslosoft.Koe.Map

	lat: 0
	lng: 0

	zoom: 10
	type: 'roadmap'

	markers: null

