#
# Register binding handler
# @param string name
# @params Maslosoft.Ko.Balin.Base handler
#
@Maslosoft.Ko.Balin.register = (name, handler) ->

	ko.bindingHandlers[name] = handler

	# Lower-case version of binding handler for punches
	name2 = false
	if name.match /[A-Z]/
		name2 = name.toLowerCase()
		ko.bindingHandlers[name2] = handler

	#Reassign options
	#ko.bindingHandlers[name].options = JSON.parse(JSON.stringify(handler.options))

	# Assign two way. Not sure if nessesary in current ko
	if handler.writable
		if ko.expressionRewriting and ko.expressionRewriting.twoWayBindings
			ko.expressionRewriting.twoWayBindings[name] = true
			if name2
				ko.expressionRewriting.twoWayBindings[name2] = true

#
# Register default set of binding handlers, or part of default set
#
@Maslosoft.Ko.Balin.registerDefaults = (handlers = null) ->
	# In alphabetical order
	config = {
		active: Maslosoft.Ko.Balin.Active
		action: Maslosoft.Ko.Balin.WidgetAction
		activity: Maslosoft.Ko.Balin.WidgetActivity
		asset: Maslosoft.Ko.Balin.Asset
		data: Maslosoft.Ko.Balin.Data
		dateFormatter: Maslosoft.Ko.Balin.DateFormatter
		dateTimeFormatter: Maslosoft.Ko.Balin.DateTimeFormatter
		disabled: Maslosoft.Ko.Balin.Disabled
		enumCssClassFormatter: Maslosoft.Ko.Balin.EnumCssClassFormatter
		enumFormatter: Maslosoft.Ko.Balin.EnumFormatter
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
		tooltip: Maslosoft.Ko.Balin.Tooltip
		timeAgoFormatter: Maslosoft.Ko.Balin.TimeAgoFormatter
		timeFormatter: Maslosoft.Ko.Balin.TimeFormatter
		selected: Maslosoft.Ko.Balin.Selected
		validator: Maslosoft.Ko.Balin.Validator
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
