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
# @params Maslosoft.Ko.Balin.Base handler
#
@Maslosoft.Ko.Balin.register = (name, handler) ->

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
@Maslosoft.Ko.Balin.registerDefaults = (handlers = null) ->
	# In alphabetical order
	config = {
		acl: Maslosoft.Ko.Balin.Acl
		active: Maslosoft.Ko.Balin.Active
		action: Maslosoft.Ko.Balin.WidgetAction
		activity: Maslosoft.Ko.Balin.WidgetActivity
		asset: Maslosoft.Ko.Balin.Asset
		data: Maslosoft.Ko.Balin.Data
		dateFormatter: Maslosoft.Ko.Balin.DateFormatter
		datePicker: Maslosoft.Ko.Balin.DatePicker
		datePickerPickaDate: Maslosoft.Ko.Balin.PickaDate
		dateTimeFormatter: Maslosoft.Ko.Balin.DateTimeFormatter
		decimalFormatter: Maslosoft.Ko.Balin.DecimalFormatter
		disabled: Maslosoft.Ko.Balin.Disabled
		enumCssClassFormatter: Maslosoft.Ko.Balin.EnumCssClassFormatter
		enumFormatter: Maslosoft.Ko.Balin.EnumFormatter
		eval: Maslosoft.Ko.Balin.Eval
		fancytree: Maslosoft.Ko.Balin.Fancytree
		fileSizeFormatter: Maslosoft.Ko.Balin.FileSizeFormatter
		hidden: Maslosoft.Ko.Balin.Hidden
		href: Maslosoft.Ko.Balin.Href
		htmlTree: Maslosoft.Ko.Balin.HtmlTree
		htmlValue: Maslosoft.Ko.Balin.HtmlValue
		icon: Maslosoft.Ko.Balin.Icon
		log: Maslosoft.Ko.Balin.Log
		model: Maslosoft.Ko.Balin.DataModel
		src: Maslosoft.Ko.Balin.Src
		textValue: Maslosoft.Ko.Balin.TextValue
		textValueHlJs: Maslosoft.Ko.Balin.TextValueHLJS
		timeAgoFormatter: Maslosoft.Ko.Balin.TimeAgoFormatter
		timeFormatter: Maslosoft.Ko.Balin.TimeFormatter
		timePicker: Maslosoft.Ko.Balin.TimePicker
		tooltip: Maslosoft.Ko.Balin.Tooltip
		treegrid: Maslosoft.Ko.Balin.TreeGrid
		treegridnode: Maslosoft.Ko.Balin.TreeGridNode
		selected: Maslosoft.Ko.Balin.Selected
		validator: Maslosoft.Ko.Balin.Validator
		videoPlaylist: Maslosoft.Ko.Balin.VideoPlaylist
		videoThumb: Maslosoft.Ko.Balin.VideoThumb
	}

	if handlers isnt null
		for index, value of handlers
			Maslosoft.Ko.Balin.register(value, new config[value])
	else
		for index, value of config
			Maslosoft.Ko.Balin.register(index, new value)

#
# Register default set of event handlers, or part of default set
#
@Maslosoft.Ko.Balin.registerEvents = (handlers = null) ->
	config = {
		'dblclick',
		'mousedown',
		'mouseup',
		'mouseover',
		'mouseout',
	}
	if handlers isnt null
		for index, value of handlers
			Maslosoft.Ko.Balin.makeEventHandlerShortcut(value)
	else
		for index, value of config
			Maslosoft.Ko.Balin.makeEventHandlerShortcut(value)

@Maslosoft.Ko.Balin.makeEventHandlerShortcut = (eventName) ->
	ko.bindingHandlers[eventName] = init: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
		newValueAccessor = ->
			result = {}
			result[eventName] = valueAccessor()
			result

		ko.bindingHandlers["event"]["init"].call this, element, newValueAccessor, allBindings, viewModel, bindingContext

	return
