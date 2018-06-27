#
#
# Extra utils
#

#
# Debounce function
# @link https://john-dugan.com/javascript-debounce/
#
@Maslosoft.Ko.debounce = (func, wait, immediate) ->
  timeout = undefined
  ->
    context = this
    args = arguments

    later = ->
      timeout = null
      if !immediate
        func.apply context, args
      return

    callNow = immediate and !timeout
    clearTimeout timeout
    timeout = setTimeout(later, wait or 200)
    if callNow
      func.apply context, args
    return

#
# Register binding handler
# @param string name
# @params Maslosoft.Binder.Base handler
#
@Maslosoft.Binder.register = (name, handler) ->

	name2 = false
	if name.match /[A-Z]/
		name2 = name.toLowerCase()

	# Assign two way. Not sure if nessesary in current ko
	if handler.writable
		if ko.expressionRewriting and ko.expressionRewriting.twoWayBindings
			ko.expressionRewriting.twoWayBindings[name] = true
			if name2
				ko.expressionRewriting.twoWayBindings[name2] = true

	ko.bindingHandlers[name] = handler

	# Lower-case version of binding handler for punches
	if name2
		ko.bindingHandlers[name2] = handler

	#Reassign options
	#ko.bindingHandlers[name].options = JSON.parse(JSON.stringify(handler.options))


#
# Register default set of binding handlers, or part of default set
#
@Maslosoft.Binder.registerDefaults = (handlers = null) ->
	# In alphabetical order
	config = {
		acl: Maslosoft.Binder.Acl
		active: Maslosoft.Binder.Active
		action: Maslosoft.Binder.WidgetAction
		activity: Maslosoft.Binder.WidgetActivity
		asset: Maslosoft.Binder.Asset
		cssClasses: Maslosoft.Binder.CssClasses
		cssColumnSizes: Maslosoft.Binder.CssColumnSizes
		cssColumns: Maslosoft.Binder.CssColumns
		data: Maslosoft.Binder.Data
		dateFormatter: Maslosoft.Binder.DateFormatter
		datePicker: Maslosoft.Binder.DatePicker
		datePickerPickaDate: Maslosoft.Binder.PickaDate
		dateTimeFormatter: Maslosoft.Binder.DateTimeFormatter
		decimalFormatter: Maslosoft.Binder.DecimalFormatter
		disabled: Maslosoft.Binder.Disabled
		enumCssClassFormatter: Maslosoft.Binder.EnumCssClassFormatter
		enumFormatter: Maslosoft.Binder.EnumFormatter
		eval: Maslosoft.Binder.Eval
		fancytree: Maslosoft.Binder.Fancytree
		fileSizeFormatter: Maslosoft.Binder.FileSizeFormatter
		hidden: Maslosoft.Binder.Hidden
		href: Maslosoft.Binder.Href
		html: Maslosoft.Binder.Html
		htmlTree: Maslosoft.Binder.HtmlTree
		htmlValue: Maslosoft.Binder.HtmlValue
		icon: Maslosoft.Binder.Icon
		log: Maslosoft.Binder.Log
		model: Maslosoft.Binder.DataModel
		ref: Maslosoft.Binder.Widget
		src: Maslosoft.Binder.Src
		tags: Maslosoft.Binder.Tags
		text: Maslosoft.Binder.Text
		textToBg: Maslosoft.Binder.TextToBg
		textValue: Maslosoft.Binder.TextValue
		textValueHlJs: Maslosoft.Binder.TextValueHLJS
		timeAgoFormatter: Maslosoft.Binder.TimeAgoFormatter
		timeFormatter: Maslosoft.Binder.TimeFormatter
		timePicker: Maslosoft.Binder.TimePicker
		tooltip: Maslosoft.Binder.Tooltip
		treegrid: Maslosoft.Binder.TreeGrid
		treegridnode: Maslosoft.Binder.TreeGridNode
		selected: Maslosoft.Binder.Selected
		select2: Maslosoft.Binder.Select2
		validator: Maslosoft.Binder.Validator
		videoPlaylist: Maslosoft.Binder.VideoPlaylist
		videoThumb: Maslosoft.Binder.VideoThumb
		widget: Maslosoft.Binder.Widget
	}

	if handlers isnt null
		for index, value of handlers
			Maslosoft.Binder.register(value, new config[value])
	else
		for index, value of config
			Maslosoft.Binder.register(index, new value)

#
# Register default set of event handlers, or part of default set
#
@Maslosoft.Binder.registerEvents = (handlers = null) ->
	config = {
		'dblclick',
		'mousedown',
		'mouseup',
		'mouseover',
		'mouseout',
	}
	if handlers isnt null
		for index, value of handlers
			Maslosoft.Binder.makeEventHandlerShortcut(value)
	else
		for index, value of config
			Maslosoft.Binder.makeEventHandlerShortcut(value)

@Maslosoft.Binder.makeEventHandlerShortcut = (eventName) ->
	ko.bindingHandlers[eventName] = init: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
		newValueAccessor = ->
			result = {}
			result[eventName] = valueAccessor()
			result

		ko.bindingHandlers["event"]["init"].call this, element, newValueAccessor, allBindings, viewModel, bindingContext

	return
