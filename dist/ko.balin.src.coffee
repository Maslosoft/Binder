"use strict"

assert = (expr) ->
	if not console then return
	console.assert.apply console, arguments

log = (expr) ->
	if not console then return
	console.log.apply console, arguments

warn = (expr, element = null) ->
	if not console then return
	console.warn.apply console, arguments

error = (expr, element = null) ->
	if not console then return
	console.error.apply console, arguments

# from https://developer.mozilla.org/pl/docs/Web/JavaScript/Referencje/Obiekty/Array/isArray
if !Array.isArray
  Array.isArray = (arg) ->
    return Object.prototype.toString.call(arg) is '[object Array]'

isPlainObject = (obj) ->
	return !!obj and typeof(obj) is 'object' and obj.constructor is Object

# from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/keys
if !Object.keys
  Object.keys = do ->
    'use strict'
    hasOwnProperty = Object::hasOwnProperty
    hasDontEnumBug = !{ toString: null }.propertyIsEnumerable('toString')
    dontEnums = [
      'toString'
      'toLocaleString'
      'valueOf'
      'hasOwnProperty'
      'isPrototypeOf'
      'propertyIsEnumerable'
      'constructor'
    ]
    dontEnumsLength = dontEnums.length
    (obj) ->
      if typeof obj != 'object' and (typeof obj != 'function' or obj == null)
        throw new TypeError('Object.keys called on non-object')
      result = []
      prop = undefined
      i = undefined
      for prop of obj
        `prop = prop`
        if hasOwnProperty.call(obj, prop)
          result.push prop
      if hasDontEnumBug
        i = 0
        while i < dontEnumsLength
          if hasOwnProperty.call(obj, dontEnums[i])
            result.push dontEnums[i]
          i++
      result

"use strict"
if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko
	@Maslosoft.Ko = {}
if not @Maslosoft.Ko.Balin
	@Maslosoft.Ko.Balin = {}
if not @Maslosoft.Ko.Balin.Helpers
	@Maslosoft.Ko.Balin.Helpers = {}
if not @Maslosoft.Ko.Balin.Widgets
	@Maslosoft.Ko.Balin.Widgets = {}

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
		select2: Maslosoft.Ko.Balin.Select2
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

#
# Base class for Maslosoft binding handlers
#
class @Maslosoft.Ko.Balin.Base

	#
	# Whenever to register binding handler as writable
	# @var boolean
	#
	writable: true

	#
	# @var @Maslosoft.Ko.Balin.Options
	#
	options: {}

	# Class constructor
	# @param options @Maslosoft.Ko.Balin.Options
	#
	constructor: (options = {}) ->
		#	Set ref to current object, not prototype
		@options = {}
		for name, value of options
			@options[name] = value

	#
	# Get value from model
	#
	getValue: (valueAccessor, defaults = '') =>
		if typeof(valueAccessor) is 'function'
			value = ko.unwrap(valueAccessor())
		else
			value = ko.unwrap(valueAccessor)
		if @options.valueField
			if @options.ec5
				value = value[@options.valueField]
			else
				value = value[@options.valueField]()
				
		# Only use defaults when undefined
		if typeof(value) is 'undefined'
			return defaults
		return value

class @Maslosoft.Ko.Balin.Options

	# Set this if need to access complex date objects
	# @var string
	#
	valueField: null

	# Whenever to use ko ecmascript 5 plugin
	# Will autodetect if not set
	# @var boolean
	#
	ec5: null

	afterUpdate: null

	constructor: (values = {}) ->

		for index, value of values
			@[index] = value

		if @ec5 is null
			@ec5 = !!ko.track

		if @afterUpdate is null
			@afterUpdate = (element, value) ->
				


#
# Configuration class for css bindings
#
class @Maslosoft.Ko.Balin.CssOptions extends @Maslosoft.Ko.Balin.Options
	
	className: 'active'

#
# Configuration class for date bindings
#
class @Maslosoft.Ko.Balin.DateOptions extends @Maslosoft.Ko.Balin.Options

	#
	# Language for locale formatting
	# @var string
	#
	lang: 'en'

	# Date source format
	# @var string
	#
	sourceFormat: 'unix'

	# Date display format
	# @var string
	#
	displayFormat: 'YYYY-MM-DD'

#
# Configuration class for datetime bindings
#
class @Maslosoft.Ko.Balin.DateTimeOptions extends @Maslosoft.Ko.Balin.Options

	#
	# Language for locale formatting
	# @var string
	#
	lang: 'en'

	# DateTime source format
	# @var string
	#
	sourceFormat: 'unix'

	# DateTime display format
	# @var string
	#
	displayFormat: 'YYYY-MM-DD hh:mm'

#
# Configuration class for time bindings
#
class @Maslosoft.Ko.Balin.TimeAgoOptions extends @Maslosoft.Ko.Balin.Options

	#
	# Language for locale formatting
	# @var string
	#
	lang: 'en'

	# Time source format
	# @var string
	#
	sourceFormat: 'unix'

	# Time display format
	# @var string
	#
	displayFormat: 'hh:mm'

#
# Configuration class for time bindings
#
class @Maslosoft.Ko.Balin.TimeOptions extends @Maslosoft.Ko.Balin.Options

	#
	# Language for locale formatting
	# @var string
	#
	lang: 'en'

	# Time source format
	# @var string
	#
	sourceFormat: 'unix'

	# Time display format
	# @var string
	#
	displayFormat: 'hh:mm'

#
# Configuration class for css bindings
#
class @Maslosoft.Ko.Balin.ValidatorOptions extends @Maslosoft.Ko.Balin.Options

	#
	# Field for class name
	# @var string
	#
	classField: '_class'

	#
	# CSS selector to find parent element
	# @var string
	#
	parentSelector: '.form-group'

	#
	# Failed validation class name.
	# This class will be added to input if validation fails.
	# @var string
	#
	inputError: 'error'

	#
	# Failed validation parent class name.
	# This class will be added to parent of input if validation fails.
	# @var string
	#
	parentError: 'has-error'

	#
	# Warning validation class name.
	# This class will be added to input if validation has warnings.
	# @var string
	#
	inputWarning: 'warning'

	#
	# Warning validation parent class name.
	# This class will be added to parent of input if validation has warnings.
	# @var string
	#
	parentWarning: 'has-warning'

	#
	# Succeed validation class name.
	# This class will be added to input if validation succeds.
	# @var string
	#
	inputSuccess: 'success'

	#
	# Succeed validation parent class name.
	# This class will be added to parent of input if validation succeds.
	# @var string
	#
	parentSuccess: 'has-success'

	#
	# Selector for error messages. Will scope from input parent.
	# @var string
	#
	errorMessages: '.error-messages'

	#
	# Selector for warning messages. Will scope from input parent.
	# @var string
	#
	warningMessages: '.warning-messages'



class @Maslosoft.Ko.Balin.BaseValidator

	label: ''

	model: null

	messages: []

	rawMessages: []

	warningMessages: []

	rawWarningMessages: []

	constructor: (config) ->
		@reset()
		for index, value of config
			@[index] = null
			@[index] = value

	reset: () ->
		# Dereference/reset
		@messages = new Array
		@rawMessages = new Object
		@warningMessages = new Array
		@rawWarningMessages = new Object

	isValid:() ->
		throw new Error('Validator must implement `isValid` method')

	getErrors: () ->
		return @messages

	getWarnings: () ->
		return @warningMessages

	#
	# Add error message with optional substitution params.
	#
	# Simple example:
	# ```coffee
	# @addError('My error message')
	#	```
	#
	# Automatic substitution with label example:
	# ```coffee
	# @addError('Attribute {attribute} message')
	#	```
	#
	# Will add error message: 'Attribute My attribute message'
	#
	# Substitution with params example:
	# ```coffee
	# @addError('Attribute {name} message', {name: 'John'})
	#	```
	#
	# Will add error message: 'Attribute John message'
	#
	addError: (errorMessage, params) ->

		# Raw is required for uniquness, see method end
		rawMessage = errorMessage

		# Apply atribute label first
		errorMessage = errorMessage.replace "{attribute}", @label

		# Apply from current validator
		for name, value of @
			errorMessage = errorMessage.replace "{#{name}}", value

		# Apply from params
		for name, value of params
			errorMessage = errorMessage.replace "{#{name}}", value

		# Finally try to apply from model
		for name, value of @model
			errorMessage = errorMessage.replace "{#{name}}", value


		# Ensure uniquness
		if not @rawMessages[rawMessage]
			@messages.push errorMessage
			@rawMessages[rawMessage] = true

	#
	# Add warning message with optional substitution params.
	#
	# Simple example:
	# ```coffee
	# @addWarning('My error message')
	#	```
	#
	# Automatic substitution with label example:
	# ```coffee
	# @addWarning('Attribute {attribute} message')
	#	```
	#
	# Will add warning message: 'Attribute My attribute message'
	#
	# Substitution with params example:
	# ```coffee
	# @addWarning('Attribute {name} message', {name: 'John'})
	#	```
	#
	# Will add warning message: 'Attribute John message'
	#
	addWarning: (warningMessage, params) ->

		# Raw is required for uniquness, see method end
		rawMessage = warningMessage

		# Apply atribute label first
		warningMessage = warningMessage.replace "{attribute}", @label

		# Apply from current validator
		for name, value of @
			warningMessage = warningMessage.replace "{#{name}}", value

		# Apply from params
		for name, value of params
			warningMessage = warningMessage.replace "{#{name}}", value

		# Finally try to apply from model
		for name, value of @model
			warningMessage = warningMessage.replace "{#{name}}", value


		# Ensure uniquness
		if not @rawWarningMessages[rawMessage]
			@warningMessages.push warningMessage
			@rawWarningMessages[rawMessage] = true

#
# CSS class binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.CssClass extends @Maslosoft.Ko.Balin.Base

	writable: false

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if !!value
			ko.utils.toggleDomNodeCssClass(element, @options.className, true);
		else
			ko.utils.toggleDomNodeCssClass(element, @options.className, false);
		return

#
# Moment formatter class
#
class @Maslosoft.Ko.Balin.MomentFormatter extends @Maslosoft.Ko.Balin.Base

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		moment.locale @options.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@options.sourceFormat](value).format(@options.displayFormat)
		return

#
# Base class for date/time pickers
#
#
class @Maslosoft.Ko.Balin.Picker extends @Maslosoft.Ko.Balin.Base

#
# Base class for video related bindings
#
class @Maslosoft.Ko.Balin.Video extends @Maslosoft.Ko.Balin.Base

	options = null
	adapters = null

	jQuery(document).ready () ->

		# Initalize thumbnails adapters
		options = new Maslosoft.Playlist.Options

		# Set adapters from options
		adapters = options.adapters

	#
	# Check is supported video url
	# @param url string
	# @return false|object
	#
	isVideoUrl: (url) =>
		for adapter in adapters
			if adapter.match url
				return adapter
		return false

	#
	# Will set image src attribute to video thumbnail,
	# or element background-image style if it's not image
	# @param url string
	# @param element DomElement
	#
	setThumb: (url, element) =>
		if adapter = @isVideoUrl url

			thumbCallback = (src) ->
				if element.tagName.toLowerCase() is 'img'
					element.src = src
				else
					jQuery(element).css 'background-image', "url('#{src}')"

			console.log url
			# Init adapter
			ad = new adapter
			ad.setUrl url
			ad.setThumb thumbCallback


class @Maslosoft.Ko.Balin.WidgetUrl extends @Maslosoft.Ko.Balin.Base

	getData: (element, valueAccessor, allBindings, bindingName) ->
		src = @getValue(valueAccessor)

		data = {}
		data.id = allBindings.get('widgetId') or src.id

		if allBindings.get('widget')
			data.id = allBindings.get('widget').id

		data[bindingName] = allBindings.get(bindingName) or src[bindingName]

		# Need to check for undefined here,
		# as params might be `0` or `` or `false`
		bindingParams = allBindings.get('params');
		if typeof(bindingParams) is undefined
			data.params = src.params
		else
			data.params = bindingParams
		
		data.params = @getValue(data.params)

		if typeof(src) is 'string'
			data[bindingName] = src
		
		return data

	createUrl: (widgetId, action, params, terminator) =>
		
		args = [];
		# Assign one value params
		
		if typeof(params) is 'string' or typeof(params) is 'number'
			# Skip empty strings
			if params isnt "" or typeof(params) is 'number'
				args.push "" + params
		else
			for name, value of params
				name = encodeURIComponent("" + name)
				value = encodeURIComponent("" + value)
				args.push "#{name}:#{value}"
		
		href = "#{terminator}#{widgetId}.#{action}";
		
		if args.length is 0
			return href;
		else
			args = args.join(',', args)
			return "#{href}=#{args}"

	setRel: (element) =>

		hasRel = false
		rels = []
		rel = element.getAttribute('rel')
		if rel
			rels = rel.split(' ')
			for relValue in rels
				if relValue is 'virtual'
					hasRel = true

		if not hasRel
			rels.push 'virtual'

		element.setAttribute('rel', rels.join(' '))
#
# Acl binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.Acl extends @Maslosoft.Ko.Balin.Base
	
	allow = null

	init: () =>
		if not Maslosoft.Ko.Balin.Acl.allow
			throw new Error("Acl binding handler requires Maslosoft.Ko.Balin.Acl.allow to be function checking permissions")

		if typeof(Maslosoft.Ko.Balin.Acl.allow) isnt 'function'
			throw new Error("Acl binding handler requires Maslosoft.Ko.Balin.Acl.allow to be function checking permissions")

	update: (element, valueAccessor) =>
		acl = @getValue(valueAccessor)
		value = Maslosoft.Ko.Balin.Acl.allow(acl)

		# Forward to visible
		ko.bindingHandlers.visible.update element, ->
			value
#
# Disabled binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.Active extends @Maslosoft.Ko.Balin.CssClass

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.CssOptions({className: 'active'})

#
# Asset binding handler
#
class @Maslosoft.Ko.Balin.Asset extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		$element = $(element)

		# Get dimensions defined by other bindings
		width = allBindings.get 'w' or allBindings.get 'width' or null
		height = allBindings.get 'h' or allBindings.get 'height' or null

		# Get propotional flag if set
		proportional = allBindings.get 'p' or allBindings.get 'proportional' or null

		model = @getValue(valueAccessor)

		# Try to get timestamp
		if model.updateDate
			date = model.updateDate
			sec = date.sec
		url = model.url

		# Create new url including width, height and if it should cropped proportionally
		src = []

		# Add base url of asset
		src.push url

		# Add width
		if width
			src.push "w/#{width}"

		# Add height
		if height
			src.push "h/#{height}"

		# Crop to provided dimensions if not proportional
		if proportional is false
			src.push "p/0"

		# Add timestamp
		if sec
			src.push sec

		# Join parts of url
		src = src.join '/'

		if $element.attr("src") != src
			$element.attr "src", src
		return

#
# Data binding handler
#
class @Maslosoft.Ko.Balin.Data extends @Maslosoft.Ko.Balin.Base

	getNamespacedHandler: (binding) ->
		return {
			update: (element, valueAccessor) =>
				value = @getValue(valueAccessor)
				if typeof(value) not in ['string', 'number']
					value = JSON.stringify(value)
				element.setAttribute('data-' + binding, value)
			}

#
# Model binding handler
# This is to bind selected model properties to data-model field
#
class @Maslosoft.Ko.Balin.DataModel extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindings) =>
		
		# Setup binding
		model = @getValue(valueAccessor)
		fields = allBindings.get("fields") or null

		# Bind all fields if not set `fields` binding
		if fields is null
			@bindModel(element, model)
			return

		# Bind only selected fields
		modelStub = {}
		for field in fields
			# Filter out undefined model fields
			if typeof(model[field]) is 'undefined'
				warn "Model field `#{field}` is undefined on element:", element
			else
				modelStub[field] = model[field]

			@bindModel(element, modelStub)


	bindModel: (element, model) ->

		# Do not stringify scalars
		if typeof(value) not in ['string', 'number']
			modelString = JSON.stringify(model)

		element.setAttribute('data-model', modelString)

#
# Date formatter
#
class @Maslosoft.Ko.Balin.DateFormatter extends @Maslosoft.Ko.Balin.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateOptions(options)


###
Date picker
###
class @Maslosoft.Ko.Balin.DatePicker extends @Maslosoft.Ko.Balin.Picker

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateOptions(options)
	
	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return value.data
		return value

	getOptions: (allBindingsAccessor) ->
		options = {
			lang: @options.lang
			sourceFormat: @options.sourceFormat
			displayFormat: @options.displayFormat
			# Format of pickadate is not compatible of this of moment
			format: @options.displayFormat.toLowerCase()
			forceParse: false
			todayHighlight: true
			showOnFocus: false
		}
		config = allBindingsAccessor.get('dateOptions') or []
		
		
		# Only in long notation set options
		if config
			for name, value of config

				# Skip data
				if name is 'data'
					continue

				# Skip template
				if name is 'template'
					continue

				# Special treatment for display format
				if name is 'format'
					options.displayFormat = value.toUpperCase()
				
				options[name] = value
		return options

	updateModel: (element, valueAccessor, allBindings) =>
		options = @getOptions allBindings
		modelValue = @getData valueAccessor
		elementValue = @getModelValue element.value, options
		
		# Update only if changed
		if modelValue isnt elementValue
			if valueAccessor().data
				
				ko.expressionRewriting.writeValueToProperty(ko.unwrap(valueAccessor()).data, allBindings, 'datePicker.data', elementValue)
			else
				ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue)
			

	#
	# Get display value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getDisplayValue: (value, options) =>
		if options.sourceFormat is 'unix'
			inputValue = moment.unix(value).format(options.displayFormat)
		else
			inputValue = moment(value, options.sourceFormat).format(options.displayFormat)
		return inputValue

	#
	# Get model value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getModelValue: (value, options) =>
		if options.sourceFormat is 'unix'
			modelValue = moment(value, options.displayFormat).unix()
		else
			modelValue = moment(value, options.displayFormat).format(options.sourceFormat)
		return modelValue

	#
	# Initialize datepicker
	#
	#
	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

		options = @getOptions allBindingsAccessor

		element.value = @getDisplayValue(@getData(valueAccessor), options)
		
		input = jQuery(element)

		if options.template
			template = options.template
		else
			template = '''
			<div class="input-group-addon">
				<a class="picker-trigger-link" style="cursor: pointer;">
					<i class="glyphicon glyphicon-calendar"></i>
				</a>
			</div>
			'''
		addon = jQuery(template)
		addon.insertAfter input
		
		trigger = addon.find('a.picker-trigger-link')

		input.datepicker(options)

		# Don't trigger picker change date, as date need to be parsed by datejs
		input.on 'changeDate', (e) =>
			return false

		# Here is actual date change handling
		input.on 'change', (e) =>
			parsedDate = Date.parse(element.value)
			if parsedDate and not e.isTrigger
				element.value = @getDisplayValue(Math.round(parsedDate.getTime() / 1000), options)
				@updateModel element, valueAccessor, allBindingsAccessor
				input.datepicker 'update'
				return true
			return false

		# Handle opened state
		isOpen = false
		input.on 'show', (e) =>
			isOpen = true

		input.on 'hide', (e) =>
			isOpen = false

		# Need mousedown or will no hide on second click
		trigger.on 'mousedown', (e) ->
			if isOpen
				input.datepicker('hide')
			else
				input.datepicker('show')
			e.stopPropagation()
			e.preventDefault()
			return
		return

	#
	# Update input after model change
	#
	#
	update: (element, valueAccessor, allBindingsAccessor) =>
		if valueAccessor().data
			
			ko.utils.setTextContent(element, valueAccessor().data)
		else
			ko.utils.setTextContent(element, valueAccessor())
		options = @getOptions allBindingsAccessor
		value = @getDisplayValue(@getData(valueAccessor), options)
		
		if element.value isnt value
			element.value = value
###
One-way date/time formatter
###
class @Maslosoft.Ko.Balin.DateTimeFormatter extends @Maslosoft.Ko.Balin.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateTimeOptions(options)


#
# One-way decimal formatter
#
class @Maslosoft.Ko.Balin.DecimalFormatter extends @Maslosoft.Ko.Balin.Base

	precision: 2

	decimalSeparator: ','

	thousandSeparator: ' '

	suffix: ''

	prefix: ''

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor) or 0
		value = parseFloat(value)

		config = {}
		names = ['precision', 'decimalSeparator', 'thousandSeparator', 'suffix', 'prefix']
		for name in names
			# Set global value
			config[name] = @[name]
			
			# Try to set value from bindings
			bound = allBindingsAccessor.get(name)
			if typeof(bound) isnt 'undefined'
				config[name] = @getValue bound
		
		###
		# Number.prototype.format(n, x, s, c)
		# @see http://stackoverflow.com/a/14428340/5444623
		# @param float   number: number to format
		# @param integer n: length of decimal
		# @param integer x: length of whole part
		# @param mixed   s: sections delimiter
		# @param mixed   c: decimal delimiter
		###
		format = (number, n = 2, x = 3, s = ' ', c = ',') ->
			re = '\\d(?=(\\d{' + (x or 3) + '})+' + (if n > 0 then '\\D' else '$') + ')'
			num = number.toFixed(Math.max(0, ~ ~n))
			(if c then num.replace('.', c) else num).replace new RegExp(re, 'g'), '$&' + (s or ',')


		formatted = format value, config.precision, 3, config.thousandSeparator, config.decimalSeparator

		element.innerHTML = config.prefix + formatted + config.suffix
#
# Disabled binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.Disabled extends @Maslosoft.Ko.Balin.CssClass

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.CssOptions({className: 'disabled'})

#
# Enum css class handler
#
class @Maslosoft.Ko.Balin.EnumCssClassFormatter extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		
		# Remove previosly set classes
		for name in config.values
			re = new RegExp("(?:^|\\s)#{name}(?!\\S)", 'g')
			element.className = element.className.replace(re, '')

		element.className += ' ' + config.values[config.data]
		return

#
# Enum binding handler
#
class @Maslosoft.Ko.Balin.EnumFormatter extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		element.innerHTML = config.values[config.data]
		return

#
# Eval binding handler
#
class @Maslosoft.Ko.Balin.Eval extends @Maslosoft.Ko.Balin.Base

	init: (element, valueAccessor) =>
		# Let bindings proceed as normal *only if* my value is false
		allowBindings = @getValue valueAccessor
		console.log allowBindings
		return { controlsDescendantBindings: !allowBindings }

	update: (element, valueAccessor) =>
		# Let bindings proceed as normal *only if* my value is false
		allowBindings = @getValue valueAccessor
		console.log allowBindings
		return { controlsDescendantBindings: !allowBindings }
#
# Fancytree binding
# TODO Allow sytaxes:
# data-bind="fancytree: data"
# data-bind="fancytree: {data: data}"
# data-bind="fancytree: {data: data, options: <fancyTree-options>, autoExpand: true|false}"
# TODO When using two or more trees from same data, only first one works properly
#
class @Maslosoft.Ko.Balin.Fancytree extends @Maslosoft.Ko.Balin.Base

	tree: null
	element: null

	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return value.data
		return value

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		tree = @getData(valueAccessor)
		# Tree options
		options = valueAccessor().options or {}
		events = @getValue(valueAccessor).on or false
		# Effects makes updates flickering, disable
		options.toggleEffect = false
		options.source = tree.children
		options.extensions = []

		# Events
		treeEvents = new TreeEvents tree, events, options

		# Accessors for dnd and draggable
		dnd = valueAccessor().dnd or false
		drag = valueAccessor().drag or false

		if dnd and drag
			throw new Error 'Cannot use both `dnd` and `drag`'

		# DND
		if dnd
			options.autoScroll = false
			options.extensions.push 'dnd'
			options.dnd = new TreeDnd tree, element, treeEvents
			
		# Draggable only
		if drag
			options.autoScroll = false
			options.extensions.push 'dnd'
			options.dnd = new TreeDrag tree, element

		# Node icon and renderer
		nodeIcon = valueAccessor().nodeIcon or false
		folderIcon = valueAccessor().folderIcon or false
		nodeRenderer = valueAccessor().nodeRenderer or false
		
		# Folder icon option
		if folderIcon and not nodeIcon
			warn "Option `folderIcon` require also `nodeIcon` or it will not work at all"
		
		if nodeIcon or nodeRenderer
			# Disable tree icon, as custom renderer will be used
			if nodeIcon
				options.icon = false
			
			# Create internal renderer instance
			renderer = new TreeNodeRenderer tree, options, nodeIcon, folderIcon
			
			# Custom title renderer
			if nodeRenderer
				renderer.setRenderer(new nodeRenderer(tree, options))
			
			options.renderNode = renderer.render

		jQuery(element).fancytree(options);

	handle: (element, valueAccessor, allBindingsAccessor) =>
		config = @getValue(valueAccessor)
		element = jQuery element
		handler = () =>

			if not element.find('.ui-fancytree').length then return

			element.fancytree 'option', 'source', @getData(valueAccessor).children

			# Autoexpand handling
			if config.autoExpand
				element.fancytree('getRootNode').visit (node) ->
					node.setExpanded true
			element.focus()

		# Put rendering to end of queue to ensure bindings are evaluated
		setTimeout handler, 0

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		@handle element, valueAccessor, allBindingsAccessor

#
# One-way file size formatter
#
class @Maslosoft.Ko.Balin.FileSizeFormatter extends @Maslosoft.Ko.Balin.Base

	units: {
		binary: [
				"kiB"
				"MiB"
				"GiB"
				"TiB"
				"PiB"
				"EiB"
				"ZiB"
				"YiB"
			],
		decimal: [
				"kB"
				"MB"
				"GB"
				"TB"
				"PB"
				"EB"
				"ZB"
				"YB"
		]
	}

	binary: true

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor) or 0
		#
		# TODO This should also be configurable via at binding
		#
		binary = @binary
		decimal = !@binary
		
		step = 1024 if binary
		step = 1000 if decimal
		format = (bytes) =>
			bytes = parseInt(bytes)
			if bytes < step
				return bytes + ' B'
			i = -1
			units = @units.binary if binary
			units = @units.decimal if decimal
			loop
				bytes = bytes / step
				i++
				break unless bytes > step
			if units[i]
				Math.max(bytes, 0.1).toFixed(1) + ' ' + units[i]
			else
				Math.max(bytes, 0.1).toFixed(1) + " ~*#{i * step} * #{step} B"

		element.innerHTML = format(value)
#
# GMap3 binding
# TODO Allow syntax:
# data-bind="gmap: config"
# TODO When using two or more trees from same data, only first one works properly
#
class @Maslosoft.Ko.Balin.GMap extends @Maslosoft.Ko.Balin.Base

  init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

  update: (element, valueAccessor, allBindingsAccessor, viewModel) =>

    value = @getValue(valueAccessor);



#
# Hidden binding handler, opposite to visible
#
class @Maslosoft.Ko.Balin.Hidden extends @Maslosoft.Ko.Balin.Base
	
	update: (element, valueAccessor) =>
		value = not @getValue(valueAccessor)
		ko.bindingHandlers.visible.update element, ->
			value

#
# Href binding handler
#
class @Maslosoft.Ko.Balin.Href extends @Maslosoft.Ko.Balin.Base
	
	init: (element, valueAccessor, allBindingsAccessor, context) =>
		if not element.href
			element.setAttribute('href', '')
		if element.tagName.toLowerCase() isnt 'a'
			console.warn('href binding should be used only on `a` tags')

		# Stop propagation handling
		stopPropagation = allBindingsAccessor.get('stopPropagation') or false
		if stopPropagation
			ko.utils.registerEventHandler element, "click", (e) ->
				e.stopPropagation()

	update: (element, valueAccessor, allBindings) =>
		href = @getValue(valueAccessor)
		target = allBindings.get('target') or ''
		if element.href isnt href
			element.href = href
		if element.target isnt target
			element.target = target
#
# Html tree binding
#
# This simpy builds a nested ul>li struct
#
# data-bind="htmlTree: data"
#
class @Maslosoft.Ko.Balin.HtmlTree extends @Maslosoft.Ko.Balin.Base

	@drawNode: (data) ->
		# wrapper = document.createElement 'ul'
		title = document.createElement 'li'
		title.innerHTML = data.title
		# wrapper.appendChild title
		if data.children and data.children.length > 0
			childWrapper = document.createElement 'ul'
			for node in data.children
				child = HtmlTree.drawNode(node)
				childWrapper.appendChild child
			title.appendChild childWrapper
		return title


	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return @getValue(value.data) or []
		return value

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		data = @getValue(valueAccessor)
		warn "HtmlTree is experimental, do not use"
		handler = () =>
			nodes = HtmlTree.drawNode data
			element.innerHTML = ''
			element.appendChild nodes

		# Put rendering to end of queue to ensure bindings are evaluated
		setTimeout handler, 0

#
# Html value binding
# WARNING This MUST have parent context, or will not work
#
class @Maslosoft.Ko.Balin.HtmlValue extends @Maslosoft.Ko.Balin.Base

	#
	# Counter for id generator
	# @private
	# @static
	#
	idCounter = 0
	
	constructor: (options = {}) ->
		super(options)
		
		if ko.bindingHandlers.sortable and ko.bindingHandlers.sortable.options
			# Allow `contenteditable` to get focus
			ko.bindingHandlers.sortable.options.cancel = ':input,button,[contenteditable]'

	#
	# Get value of element, this can be ovverriden, see TextValue for example.
	# Will return inner html of element.
	#
	# @param jQuery element
	# @return string
	#
	getElementValue: (element) ->
		return element.innerHTML

	#
	# Set value of element, this can be ovverriden, see TextValue for example
	# Value param should be valid html.
	#
	# @param jQuery element
	# @param string
	#
	setElementValue: (element, value) ->
		element.innerHTML = value

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		
		element.setAttribute('contenteditable', true)
		
		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Balin-HtmlValue-#{idCounter++}"

		# Handle update immediatelly
		handler = (e) =>
		
			# On some situations element might be null (sorting), ignore this case
			if not element then return

			# This is required in some scenarios, specifically when sorting htmlValue elements
			element = document.getElementById(element.id)
			if not element then return
			
			accessor = valueAccessor()
			modelValue = @getValue(valueAccessor)
			elementValue = @getElementValue(element)
			if ko.isWriteableObservable(accessor)
				# Update only if changed
				if modelValue isnt elementValue
#					console.log "Write: #{modelValue} = #{elementValue}"
					accessor(elementValue)
		
		# Handle update, but push update to end of queue
		deferHandler = (e) =>
			setTimeout handler, 0
		
		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup, input", handler

		# This is to allow interation with tools which could modify content, also to work with drag and drop
		ko.utils.registerEventHandler document, "mouseup", deferHandler
		return

	update: (element, valueAccessor, allBindings) =>
		value = @getValue(valueAccessor)
		if @getElementValue(element) isnt value
			@setElementValue(element, value)
		return
#
# Icon binding handler
# This is to select proper icon or scaled image thumbnail
#
class @Maslosoft.Ko.Balin.Icon extends @Maslosoft.Ko.Balin.Base
	
	update: (element, valueAccessor, allBindings) =>
		$element = $(element)
		model = @getValue(valueAccessor)

		iconField = allBindings.get("iconField") or 'icon'
		if not model
			if console
				console.warn 'Binding value for `icon` binding not defined, skipping. Element:'
				console.warn element
				console.warn (new Error).stack
			return
		src = model[iconField]

		isSvg = false
		if src.match /\.(svg)$/
			isSvg = true

		nameSuffix = ''
		if src.match /\.(jpg|jped|gif|png|svg)$/
			matched = src.match /[^\/]+?\.(jpg|jped|gif|png|svg)$/
			nameSuffix = matched[0]
			src = src.replace /[^\/]+?\.(jpg|jped|gif|png|svg)$/, ""

		# Get icon size
		# TODO This should be configurable with options
		if typeof model.iconSize is 'undefined'
			defaultSize = 16
		else
			defaultSize = model.iconSize

		size = allBindings.get("iconSize") or defaultSize
		regex = new RegExp("/" + defaultSize + "/", "g")

		# Check if it's image
		# TODO This should be configurable with options
		if typeof model.isImage is 'undefined'
			isImage = true
		else
			isImage = model.isImage

		# This is to not add scaling params for svg's
		if isSvg
			isImage = false

		# TODO This must be configurable with options
		if isImage
			# Get image thumbnail
			# End with /
			if not src.match(new RegExp("/$"))
				src = src + '/'
			# Dimentions are set
			if src.match(new RegExp("/w/", "g"))
				src = src.replace(regex, "/" + size + "/")
			# Dimentions are not set, set it here
			else
				src = src + "w/#{size}/h/#{size}/p/0/"
				
			# Add timestamp if set
			if model.updateDate
				date = null
				if model.updateDate.sec
					date = model.updateDate.sec
				else
					date = model.updateDate
				if typeof(date) is 'number'
					src = src + date
				if typeof(date) is 'string'
					src = src + date
		else
			# Calculate size steps for normal icons
			fixedSize = 16
			if size > 16
				fixedSize = 32
			if size > 32
				fixedSize = 48
			if size > 48
				fixedSize = 512
			src = src.replace(regex, "/" + fixedSize + "/")

		if src.match /\/$/
			src = src + nameSuffix
		else
			src = src + '/' + nameSuffix

		# Update src only if changed
		if $element.attr("src") != src
			$element.attr "src", src

		# Set max image dimentions
		$element.css
			width: "#{size}px"
			height: 'auto'
			maxWidth: '100%'

		return


#
# Log with element reference
#
#
class @Maslosoft.Ko.Balin.Log extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindings) =>
		console.log @getValue(valueAccessor), element

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		console.log @getValue(valueAccessor), element
###
Date picker
NOTE: Not recommended, as Pick A Date is not maintanted
###
class @Maslosoft.Ko.Balin.PickaDate extends @Maslosoft.Ko.Balin.Picker

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateOptions(options)

	updateModel: (element, valueAccessor, allBindings) =>
		modelValue = @getValue valueAccessor
		elementValue = @getModelValue element.value
		
		if ko.isWriteableObservable(valueAccessor) or true
			# Update only if changed
			if modelValue isnt elementValue
				ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue)
				val = elementValue
				
		else
			

	#
	# Get display value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getDisplayValue: (value) =>
		if @options.sourceFormat is 'unix'
			inputValue = moment.unix(value).format(@options.displayFormat)
		else
			inputValue = moment(value, @options.sourceFormat).format(@options.displayFormat)
		return inputValue

	#
	# Get model value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getModelValue: (value) =>
		if @options.sourceFormat is 'unix'
			modelValue = moment(value, @options.displayFormat).unix()
		else
			modelValue = moment(value, @options.displayFormat).format(@options.sourceFormat)
		return modelValue

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

		inputValue = @getDisplayValue(@getValue(valueAccessor))
		
		textInput = jQuery(element)
		textInput.val inputValue

		if @options.template
			template = @options.template
		else
			template = '''
			<div class="input-group-addon">
				<a class="picker-trigger-link" style="cursor: pointer;">
					<i class="glyphicon glyphicon-calendar"></i>
				</a>
			</div>
			'''
		pickerWrapper = jQuery(template)
		pickerWrapper.insertAfter textInput
		
		pickerElement = pickerWrapper.find('a.picker-trigger-link')
		

		options = {
			# Format of pickadate is not compatible of this of moment
			format: @options.displayFormat.toLowerCase()
			selectMonths: true
			selectYears: true
		}

		$inputDate = pickerElement.pickadate(options)
		picker = $inputDate.pickadate('picker')

		picker.on 'set', =>
			textInput.val picker.get('value')
			@updateModel element, valueAccessor, allBindingsAccessor
			return

		

		events = {}

		# On change or other events (paste etc.)
		events.change = () =>
			parsedDate = Date.parse(element.value)
			if parsedDate
				picker.set 'select', [
					parsedDate.getFullYear()
					parsedDate.getMonth()
					parsedDate.getDate()
				]
				@updateModel element, valueAccessor, allBindingsAccessor
			return

		events.keyup = (e) ->
			if e.which is 86 and e.ctrlKey
				events.change()
				
			return

			
		events.mouseup = events.change

		# Focus event of text input
		events.focus = () =>
			
			picker.open false
			return

		# Blur of text input
		events.blur = (e) =>
			# Don't hide picker when clicking picker itself
			if e.relatedTarget
				return
			
			picker.close()
			@updateModel element, valueAccessor, allBindingsAccessor
			return

		textInput.on events

		pickerElement.on 'click', (e) ->
			root = jQuery(picker.$root[0])
			# This seems to be only method
			# to discover if picker is really open
			isOpen = jQuery(root.children()[0]).height() > 0
			if isOpen
				picker.close()
			else
				picker.open(false)
			e.stopPropagation()
			e.preventDefault()
			return

		return

	update: (element, valueAccessor) =>
		ko.utils.setTextContent(element, valueAccessor())
		value = @getDisplayValue(@getValue(valueAccessor))
		if element.value isnt value
			element.value = value
###
Select2
###
class @Maslosoft.Ko.Balin.Select2 extends @Maslosoft.Ko.Balin.Base

	bindingName = 'select2'
	dataBindingName = "#{bindingName}Data"

	triggerChangeQuietly = (element, binding) ->
		isObservable = ko.isObservable(binding)
		originalEqualityComparer = undefined
		if isObservable
			originalEqualityComparer = binding.equalityComparer

			binding.equalityComparer = ->
				true

		$(element).trigger 'change'
		if isObservable
			binding.equalityComparer = originalEqualityComparer
		return

	init = (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
		bindingValue = ko.unwrap(valueAccessor())
		allBindings = allBindingsAccessor()
		ignoreChange = false
		dataChangeHandler = null
		subscription = null
		$(element).on 'select2:selecting select2:unselecting', ->
			ignoreChange = true
			return
		$(element).on 'select2:select select2:unselect', ->
			ignoreChange = false
			return
		if ko.isObservable(allBindings.value)
			subscription = allBindings.value.subscribe((value) ->
				if ignoreChange
					return
				triggerChangeQuietly element, @_target or @target
				return
			)
		else if ko.isObservable(allBindings.selectedOptions)
			subscription = allBindings.selectedOptions.subscribe((value) ->
				if ignoreChange
					return
				triggerChangeQuietly element, @_target or @target
				return
			)
		# Provide a hook for binding to the select2 "data" property; this property is read-only in select2 so not subscribing.
		if ko.isWriteableObservable(allBindings[dataBindingName])

			dataChangeHandler = ->
				if !$(element).data('select2')
					return
				allBindings[dataBindingName] $(element).select2('data')
				return

			$(element).on 'change', dataChangeHandler
		# Apply select2
		$(element).select2 bindingValue

		if allBindings.selectedOptions
			$(element).val(allBindings.selectedOptions).trigger('change')

		# Destroy select2 on element disposal
		ko.utils.domNodeDisposal.addDisposeCallback element, ->
			$(element).select2 'destroy'
			if dataChangeHandler != null
				$(element).off 'change', dataChangeHandler
			if subscription != null
				subscription.dispose()
			return
		return

	init: () =>
		args = arguments
		to = () ->
			init.apply null, args
		setTimeout to, 0

	update: (element, valueAccessor, allBindingsAccessor) =>
		return
		value = @getValue(valueAccessor)
		if element.value isnt value.data
			copy = JSON.parse JSON.stringify value.data
			$(element).val(copy);
			console.log "Update what?", element, value
#
# Selected binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.Selected extends@Maslosoft.Ko.Balin.CssClass

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.CssOptions({className: 'selected'})

#
# Src binding handler
#
class @Maslosoft.Ko.Balin.Src extends @Maslosoft.Ko.Balin.Base

	init: (element, valueAccessor, allBindingsAccessor, context) =>

	update: (element, valueAccessor) =>
		src = @getValue(valueAccessor)
		if element.src isnt src
			element.src = src
#
# Html text value binding
# WARNING This MUST have parent context, or will not work
#
class @Maslosoft.Ko.Balin.TextValue extends @Maslosoft.Ko.Balin.HtmlValue

	getElementValue: (element) ->
		return element.textContent || element.innerText || ""

	setElementValue: (element, value) ->
		if typeof element.textContent isnt 'undefined'
			element.textContent = value
		if typeof element.innerText isnt 'undefined'
			element.innerText = value

#
# Html text value binding
# WARNING This MUST have parent context, or will not work
#
class @Maslosoft.Ko.Balin.TextValueHLJS extends @Maslosoft.Ko.Balin.HtmlValue

	getElementValue: (element) ->
		return element.textContent || element.innerText || ""

	setElementValue: (element, value) ->
		if typeof element.textContent isnt 'undefined'
			element.textContent = value
			if hljs
				hljs.highlightBlock(element)
		if typeof element.innerText isnt 'undefined'
			element.innerText = value
			if hljs
				hljs.highlightBlock(element)


class @Maslosoft.Ko.Balin.TimeAgoFormatter extends @Maslosoft.Ko.Balin.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.TimeAgoOptions(options)

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@options.sourceFormat](value).fromNow()
		return

#
# Date formatter
#
class @Maslosoft.Ko.Balin.TimeFormatter extends @Maslosoft.Ko.Balin.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.TimeOptions(options)

###
Time picker
###
class @Maslosoft.Ko.Balin.TimePicker extends @Maslosoft.Ko.Balin.Base

	


#
# Tooltip binding handler
#
class @Maslosoft.Ko.Balin.Tooltip extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor) =>
		title = @getValue(valueAccessor)
		$(element).attr "title", title
		$(element).attr "data-original-title", title
		$(element).attr "rel", "tooltip"
		return

#
# Tree binding handler
#
class @Maslosoft.Ko.Balin.Tree extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor) =>
		
		return



class @Maslosoft.Ko.Balin.TreeGrid extends @Maslosoft.Ko.Balin.Base

	#
	#
	# @private
	#
	makeValueAccessor = (element, valueAccessor, bindingContext, widget) ->
		return () ->
			modelValue = valueAccessor()
			unwrappedValue = ko.utils.peekObservable(modelValue)
			# Unwrap without setting a dependency here
			# If unwrappedValue is the array, pass in the wrapped value on its own
			# The value will be unwrapped and tracked within the template binding
			# (See https://github.com/SteveSanderson/knockout/issues/523)
			if !unwrappedValue or typeof unwrappedValue.length == 'number'
				return {
					'foreach': modelValue
					'templateEngine': ko.nativeTemplateEngine.instance
				}

			data = []
			depths = []
			depth = -1

			unwrapRecursive = (items) ->
				depth++
				for item in items
					extras = {
						depth: depth
						hasChilds: !!item.children.length
					}
					item._treeGrid = ko.tracker.factory extras
					data.push item
					depths.push depth
					if item.children.length
						unwrapRecursive item.children
						depth--

			unwrapRecursive unwrappedValue['data']['children']
			
			if bindingContext
				bindingContext.tree = unwrappedValue['data']
				bindingContext.widget = widget


			# If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
			ko.utils.unwrapObservable modelValue
			{
				'foreach': data
				'depths': depths
				'as': unwrappedValue['as']
				'includeDestroyed': unwrappedValue['includeDestroyed']
				'afterAdd': unwrappedValue['afterAdd']
				'beforeRemove': unwrappedValue['beforeRemove']
				'afterRender': unwrappedValue['afterRender']
				'beforeMove': unwrappedValue['beforeMove']
				'afterMove': unwrappedValue['afterMove']
				'templateEngine': ko.nativeTemplateEngine.instance
			}

	init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

		value = @getValue valueAccessor
		activeClass = value.activeClass

		table = jQuery(element)
		table.on 'click', 'tr', (e) ->
			# Remove from all instances of `tr` tu support multiple
			# classes separated with space
			table.find('tr').removeClass activeClass
			jQuery(e.currentTarget).addClass activeClass

		widget = new Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView element, valueAccessor
		ko.bindingHandlers['template']['init'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
		return { controlsDescendantBindings: true }

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		widget = new Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView element, valueAccessor, 'update'

		return ko.bindingHandlers['template']['update'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);



#
# This is to create "nodes" cell, this is meant to be used with TreeGrid
# binding handler
#
#
#
class @Maslosoft.Ko.Balin.TreeGridNode extends @Maslosoft.Ko.Balin.Base

	init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		ko.utils.toggleDomNodeCssClass(element, 'tree-grid-drag-handle', true);
		#
		#
		# FIXME Instead of defer, use observable for depth!
		# There is still need to be some option to set it... Maybe add to tree item.
		#
		#
		#
		# Defer icon creation, as other bindings must be evaluated first,
		# like html, text, etc.
		defer = () =>
			html = []
			data = @getValue(valueAccessor)
			extras = data._treeGrid
			config = bindingContext.widget.config
			#console.log extras.hasChilds
			# TODO: Just accessing data.children causes havoc...
			nodeIcon = config.nodeIcon
			folderIcon = config.folderIcon
			if folderIcon and extras.hasChilds
#				console.log 'hmmm'
				nodeIcon = folderIcon
#			console.log "#{data.title}: #{extras.depth}", extras.hasChilds
#			console.log data
#			console.log ko.unwrap bindingContext.$index
#			if extras.hasChilds
			depth = extras.depth
			expanders = []
			expanders.push "<div class='collapsed' style='display:none;transform: rotate(-90deg);'>&#128899;</div>"
			expanders.push "<div class='expanded' style='transform: rotate(-45deg);'>&#128899;</div>"
			html.push "<a class='expander' style='cursor:pointer;text-decoration:none;width:1em;margin-left:#{depth}em;display:inline-block;'>#{expanders.join('')}</a>"
#			else
			depth = extras.depth + 1
			html.push "<i class='no-expander' style='margin-left:#{depth}em;display:inline-block;'></i>"
			html.push "<img src='#{nodeIcon}' style='width: 1em;height:1em;margin-top: -.3em;display: inline-block;'/>"
			element.innerHTML = html.join('') + element.innerHTML
			
#			console.log element
#			console.log bindingContext
		defer()
#		setTimeout defer, 0



#
#
# Validation binding handler
#
# @see ValidationManager
#
class @Maslosoft.Ko.Balin.Validator extends @Maslosoft.Ko.Balin.Base

	# Counter for id generator
	# @static
	idCounter = 0

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.ValidatorOptions()

	getElementValue: (element) ->
		# For inputs use value
		if element.tagName.toLowerCase() is 'input'
			return element.value

		# For textarea use value
		if element.tagName.toLowerCase() is 'textarea'
			return element.value

		# For rest use text value
		return element.textContent || element.innerText || ""

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		configuration = @getValue(valueAccessor)
		validators = new Array
		classField = @options.classField
		if configuration.constructor is Array
			cfg = configuration
		else
			cfg = [configuration]

		for config in cfg
#			console.log config

			if not config[classField]
				error "Parameter `#{classField}` must be defined for validator on element:", element
				continue

			if typeof(config[classField]) isnt 'function'
				error "Parameter `#{classField}` must be validator compatible class, binding defined on element:", element
				continue
			
			proto = config[classField].prototype

			if typeof(proto.isValid) isnt 'function' or typeof(proto.getErrors) isnt 'function' or typeof(proto.reset) isnt 'function'
				if typeof(config[classField].prototype.constructor) is 'function'
					name = config[classField].prototype.constructor.name
				else
					name = config[classField].toString()

				error "Parameter `#{classField}` (of type #{name}) must be validator compatible class, binding defined on element:", element
				continue

			# Store class name first, as it needts to be removed
			className = config[classField]

			# Remove class key, to not iterrupt validator configuration
			delete(config[classField])

			# Instantiate validator
			validators.push new className(config)

		manager = new ValidationManager(validators, @options)
		manager.init element

		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Balin-Validator-#{idCounter++}"

		# Get initial value to evaluate only if changed
		initialVal = @getElementValue(element)

		handler = (e) =>
			# On some situations element might be null (sorting), ignore this case
			if not element then return

			# This is required in some scenarios, specifically when sorting htmlValue elements
			element = document.getElementById(element.id)
			if not element then return

			elementValue = @getElementValue(element)
			
			# Validate only if changed
			if initialVal isnt elementValue
				initialVal = elementValue
				manager.validate element, elementValue

		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup, input", handler

		# This is to allow interation with tools which could modify content, also to work with drag and drop
		ko.utils.registerEventHandler document, "mouseup", handler


	update: (element, valueAccessor, allBindings) =>
		# NOTE: Will not trigger on value change, as it is not directly observing value.
		# Will trigger only on init

#
# Video PLaylist binding handler
#
class @Maslosoft.Ko.Balin.VideoPlaylist extends @Maslosoft.Ko.Balin.Video
	initVideos: null
	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return value.data
		return value

	init: (element, valueAccessor, allBindingsAccessor, context) =>


	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		data = @getData valueAccessor
		options = @getValue valueAccessor or {}
		urlField = options.urlField or 'url'
		titleField = options.urlField or 'title'

		html = []
		for video in data
			url = video[urlField]
			title = video[titleField]
			if @isVideoUrl url
				html.push "<a href='#{url}'>#{title}</a>"

		element.innerHTML = html.join "\n"
		if html.length
			ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', true);
			new Maslosoft.Playlist element
		else
			ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', false);

#
# Video PLaylist binding handler
#
class @Maslosoft.Ko.Balin.VideoThumb extends @Maslosoft.Ko.Balin.Video

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		
	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		url = @getValue(valueAccessor)

		@setThumb url, element

				

		

class @Maslosoft.Ko.Balin.WidgetAction extends @Maslosoft.Ko.Balin.WidgetUrl

	update: (element, valueAccessor, allBindings) =>

		data = @getData(element, valueAccessor, allBindings, 'action')
		href = @createUrl(data.id, data.action, data.params, '?')

		element.setAttribute('href', href)
		
		@setRel element


class @Maslosoft.Ko.Balin.WidgetActivity extends @Maslosoft.Ko.Balin.WidgetUrl

	update: (element, valueAccessor, allBindings) =>
		
		data = @getData(element, valueAccessor, allBindings, 'activity')
		href = @createUrl(data.id, data.activity, data.params, '#')

		element.setAttribute('href', href)

		@setRel element
			
class TreeDnd

	# Expand helps greatly when doing dnd
	autoExpandMS: 400

	# Prevent focus on click
	# When enabled will scroll to tree control on click, not really desirable
	# Cons: breaks keyboard navigation
	focusOnClick: false

	# These two are required, or view model might loop	
	preventVoidMoves: true
	preventRecursiveMoves: true

	#
	# Whole tree data
	# @var TreeItem[]
	#
	tree: null
	#
	# Node finder instance
	# @var TreeNodeFinder
	#
	finder: null

	#
	# Draggable options
	#
	#
	draggable: null

	#
	#
	# @var TreeEvents
	#
	events: null

	#
	# Tree html element
	#
	#
	@el = null

	# Private

	t = (node) ->
		return # Comment to log
		log "Node: #{node.title}"
		children = []
		if node.children and node.children.length > 0
			for childNode in node.children
				children.push childNode.title
			log "Children: #{children.join(',')}"

	constructor: (initialTree, element, @events, options) ->
		@draggable = {}
		@draggable.scroll = false
		
		@tree = {}
		@tree = initialTree
		@finder = new TreeNodeFinder @tree
		@el = jQuery element

	dragStart: (node, data) ->
		return true

	dragEnter: (node, data) ->
		return true

	dragEnd: (node, data) =>
		log 'drag end...'
		return true

	dragDrop: (node, data) =>

		hitMode = data.hitMode

		# Dragged element - either draggable or tree element
		dragged = data.draggable.element[0]

		# Event handler for drop
		@events.drop node, data

		if not data.otherNode
			# Drop from ourside tree
			ctx = ko.contextFor dragged

			# Handle drop event possible transformation of node
			current = @events.getNode(ctx.$data)

		else
			# From from within tree
			parent = @finder.find(data.otherNode.parent.data.id)

			# Find node
			# Handle drop event possible transformation of node
			current = @events.getNode(@finder.find(data.otherNode.data.id))

			if not @el.is dragged
				log 'From other instance...'
				# Drop from other tree instance
				data = ko.dataFor dragged
				log data
				setTimeout handler, 0

		target = @finder.find(node.data.id)
		targetParent = @finder.find(node.parent.data.id)


		# console.log "Parent: #{parent.title}"
		# console.log "Current: #{current.title}"
		# console.log "Target: #{target.title}"
		# console.log "TargetParent: #{targetParent.title}"
		# console.log hitMode


		# Update view model
		# Remove current element first
		if parent
			parent.children.remove current
		@tree.children.remove current

		if targetParent
			targetParent.children.remove current

		# Just push at target end
		if hitMode is 'over'
			# log hitMode
			# log "Target: #{target.title}"
			# log "Current: #{current.title}"
			target.children.push current

		# Insert before target - at target parent
		if hitMode is 'before'
			if targetParent
				# Move over some node
				index = targetParent.children.indexOf target
				targetParent.children.splice index, 0, current
			else
				# Move over root node
				index = @tree.children.indexOf target
				@tree.children.splice index, 0, current
			# console.log "indexOf: #{index} (before)"

		# Simply push at the end - but at targetParent
		if hitMode is 'after'
			if targetParent
				targetParent.children.push current
			else
				@tree.children.push current

		# NOTE: This could possibly work, but it doesn't.
		# This would update whole tree with new data. Some infinite recursion occurs.
		# @handle element, valueAccessor, allBindingsAccessor

		handler = (e) =>
			log e
			@el.fancytree 'option', 'source', @tree.children
			@el.fancytree('getRootNode').visit (node) ->
				node.setExpanded true
			@el.focus()
			log 'update tree..', @el

		setTimeout handler, 0
		# Move fancytree node separatelly
		# data.otherNode.moveTo(node, hitMode)

			# Expand node as it looks better if it is expanded after drop

		return true


class TreeDrag

	# Prevent focus on click
	# When enabled will scroll to tree control on click, not really desirable
	# Cons: breaks keyboard navigation
	focusOnClick: false

	#
	# Whole tree data
	# @var TreeItem[]
	#
	tree: null
	#
	# Node finder instance
	# @var TreeNodeFinder
	#
	finder: null

	#
	# Draggable options
	#
	#
	draggable: null

	#
	# Tree html element
	#
	#
	@el = null

	# Private

	t = (node) ->
		return # Comment to log
		log "Node: #{node.title}"
		children = []
		if node.children and node.children.length > 0
			for childNode in node.children
				children.push childNode.title
			log "Children: #{children.join(',')}"

	constructor: (initialTree, element, events, options) ->
		@draggable = {}
		@draggable.scroll = false

		@tree = {}
		@tree = initialTree
		@finder = new TreeNodeFinder @tree
		@el = jQuery element

	dragStart: (node, data) ->
		return true

	dragEnter: (node, data) ->
		return false

	dragEnd: (node, data) =>
		log 'drag end...'
		return true

	dragDrop: (node, data) =>
		return false
		hitMode = data.hitMode

		# Dragged element - either draggable or tree element
		dragged = data.draggable.element[0]

		if not data.otherNode
			# Drop from ourside tree
			ctx = ko.contextFor dragged
			current = ctx.$data
		else
			# From from within tree
			parent = @finder.find(data.otherNode.parent.data.id)
			current = @finder.find(data.otherNode.data.id)

			if not @el.is dragged
				log 'From other instance...'
				# Drop from other tree instance
				data = ko.dataFor dragged
				log data
				setTimeout handler, 0

		target = @finder.find(node.data.id)
		targetParent = @finder.find(node.parent.data.id)


		# console.log "Parent: #{parent.title}"
		# console.log "Current: #{current.title}"
		# console.log "Target: #{target.title}"
		# console.log "TargetParent: #{targetParent.title}"
		# console.log hitMode


		# Update view model
		# Remove current element first
		if parent
			parent.children.remove current
		@tree.children.remove current

		if targetParent
			targetParent.children.remove current

		# Just push at target end
		if hitMode is 'over'
			# log hitMode
			# log "Target: #{target.title}"
			# log "Current: #{current.title}"
			target.children.push current

		# Insert before target - at target parent
		if hitMode is 'before'
			if targetParent
				# Move over some node
				index = targetParent.children.indexOf target
				targetParent.children.splice index, 0, current
			else
				# Move over root node
				index = @tree.children.indexOf target
				@tree.children.splice index, 0, current
			# console.log "indexOf: #{index} (before)"

		# Simply push at the end - but at targetParent
		if hitMode is 'after'
			if targetParent
				targetParent.children.push current
			else
				@tree.children.push current

		# NOTE: This could possibly work, but it doesn't.
		# This would update whole tree with new data. Some infinite recursion occurs.
		# @handle element, valueAccessor, allBindingsAccessor

		handler = (e) =>
			log e
			@el.fancytree 'option', 'source', @tree.children
			@el.fancytree('getRootNode').visit (node) ->
				node.setExpanded true
			@el.focus()
			log 'update tree..', @el

		setTimeout handler, 0
		# Move fancytree node separatelly
		# data.otherNode.moveTo(node, hitMode)

			# Expand node as it looks better if it is expanded after drop

		return true


class TreeEvents
	#
	# Events defined by binding
	#
	events: null

	#
	# Drop event is handled differently
	# 
	#
	dropEvent: null

	#
	# Fancy tree options
	#
	#
	options: null

	# Private

	#
	# Finder instance
	# @var TreeNodeFinder
	#
	finder = null

	# Check whether should handle event
	doEvent = (data) ->

		# For most events just do event it has no target
		if typeof(data.targetType) is 'undefined'
			return true

		# For click and double click react only on title and icon click
		if data.targetType is 'title'
			return true
		if data.targetType is 'icon'
			return true

	# Stop event propagation
	stop = (event) ->
		event.stopPropagation()

	constructor: (initialTree, @events, @options) ->
		finder = new TreeNodeFinder initialTree

		@handle 'click'
		@handle 'dblclick'
		@handle 'activate'
		@handle 'deactivate'

	# Drop event
	drop: (node, data) =>
		log "Drop..."
		log @events
		if @events.drop
			@dropEvent = new @events.drop(node, data)
			log @dropEvent

	#
	# Handler to possibly recreate/transform node
	#
	#
	getNode: (node) =>
		log "Tree event drop..."
		log @dropEvent
		if @dropEvent and @dropEvent.getNode
			return @dropEvent.getNode node
		else
			return node

	handle: (type) =>
		if @events[type]
			@options[type] = (event, data) =>
				if doEvent data
					model = finder.find data.node.data.id
					@events[type] model, data, event
					stop event


class TreeNodeCache
  nodes = {}
  constructor: () ->
    # nodes = {}

  get: (id) ->
    if typeof(nodes[id]) is 'undefined'
      return false
    return nodes[id]

  set: (id, val) ->
    nodes[id] = val
class TreeNodeFinder
	# Private
	cache = new TreeNodeCache
	trees = []
	
	constructor: (initialTree) ->
		trees.push initialTree

	findNode = (node, id) ->
		if typeof(id) is 'undefined'
			return false
		if found = cache.get id
			return found
		if node.id is id
			return node
		if  node._id is id
			return node

		if node.children and node.children.length > 0
			for child in node.children
				foundNode = findNode(child, id)
				if foundNode isnt false
					cache.set id, foundNode
					return foundNode
		return false

	find: (id) ->
		for tree in trees
			node = findNode tree, id
			if node
				return node
		return false
		

class TreeNodeRenderer

	icon: ''
	
	folderIcon: ''
	
	renderer: null
	
	#
	# Node finder instance
	# @var TreeNodeFinder
	# @private
	#
	finder = null

	constructor: (tree, options, @icon, @folderIcon) ->
		finder = new TreeNodeFinder tree
		
	setRenderer: (@renderer) ->
		if typeof(@renderer.render) isnt 'function'
			console.error "Renderer must have function `render`"
	
	render: (event, data) =>
		node = data.node
		
		# Skip event from child nodes
		# If not skipped, double icons will appear on folder nodes
		# TODO Investigate if there is more reliable methos for this
		for index, val of data
			if index is 'originalEvent'
				return
		
		
		# Operate only on title, not whole node html
		# This will prevent destroying expanders etc.
		span = jQuery(node.span).find("> span.fancytree-title")
		
		# Use custom render
		if @renderer and @renderer.render
			model = finder.find node.data.id
			@renderer.render(model, span)
		
		# Apply icon if applicable
		if @icon or @folderIcon
		
			# Use html here (not node.title) as it might be altered by custom renderer
			html = span.html()
			
			# Check which icon to use
			if @folderIcon && node.children && node.children.length
				icon = @folderIcon
			else
				icon = @icon
			
			# Add icon tag just before title
			# This will ensure proper dnd for responsive icon size
			span.html("<i class='node-title-icon' style='background-image:url(#{icon})'></i> #{html}")

#
# Validation manager.
#
# This class applies proper styles and messages to configured DOM elements.
#
#
#
class ValidationManager

	#
	# Input element
	# @var DomElement
	#
	element: null

	#
	# Parent of input element
	# @var DomElement
	#
	parent: null

	#
	# Errors container element
	# @var DomElement
	#
	errors: null

	#
	# Warnings container element
	# @var DomElement
	#
	warnings: null

	# Private
	toggle = ko.utils.toggleDomNodeCssClass

	hide = (element) ->
		ko.utils.toggleDomNodeCssClass element, 'hide', true

	show = (element) ->
		ko.utils.toggleDomNodeCssClass element, 'hide', false



	#
	# Initialize validation manager
	#
	# @param validators Maslosoft.Ko.Balin.BaseValidator[]
	# @param options Maslosoft.Ko.Balin.ValidatorOptions
	#
	#
	constructor: (@validators, @options) ->

	#
	# Trigger validation and warnigs on all items
	#
	# @param element DomElement
	# @param value mixed
	#
	# @return bool
	#
	validate: (element, value) =>

		# Set current element here, as it could be changed in some case, ie sorting
		@setElement element

		# Trigger all validators
		for validator in @validators
			if not @validateOne validator, value
				return false

		# Loop again for warnings, or they would be overriden
		for validator in @validators
			# Ensure that validator handle warnings
			if typeof(validator.getWarnings) is 'function'
				@adviseOne validator, value

		return true

	#
	# Set working element. No need to call it directly, it is called by validate method.
	#
	# @param element DomElement
	#
	# @return ValidationManager
	#
	setElement: (@element) =>
		@parent = jQuery(@element).parents('.form-group')[0]

		@errors = @parent.querySelector @options.errorMessages
		@warnings = @parent.querySelector @options.warningMessages
		hide @errors
		hide @warnings
		return @

	#
	# Initialize element. This sets proper state of helper elements,
	# like error/warning messages container
	#
	# @param element DomElement
	#
	init: (element) =>
		@setElement element

	#
	# Apply validation of one validator
	#
	# @param validator Maslosoft.Ko.Balin.BaseValidator
	# @param element DomElement
	# @param value mixed
	#
	# @return bool
	#
	validateOne: (validator, value) =>
		# Reassign variables for local scope
		element = @element
		parent = @parent
		errors = @errors
		warnings = @warnings

		messages = new Array
		validator.reset()
		isValid = false
		if validator.isValid(value)
			# Apply input error styles as needed
			if @options.inputError
				toggle(element, @options.inputError, false);
			if @options.inputSuccess
				toggle(element, @options.inputSuccess, true);

			# Apply parent styles as needed
			if parent
				if @options.parentError
					toggle(parent, @options.parentError, false);
				if @options.parentSuccess
					toggle(parent, @options.parentSuccess, true);

			# Reset error messages
			if errors
				hide errors
				errors.innerHTML = ''
			isValid = true
		else
			# Errors...
			messages = validator.getErrors()

			# Apply input error styles as needed
			if @options.inputError
				toggle(element, @options.inputError, true);
			if @options.inputSuccess
				toggle(element, @options.inputSuccess, false);

			# Apply parent styles as needed
			if parent
				if @options.parentError
					toggle(parent, @options.parentError, true);
				if @options.parentSuccess
					toggle(parent, @options.parentSuccess, false);

			# Show error messages
			if errors and messages
				show errors
				errors.innerHTML = messages.join '<br />'
			isValid = false

		#
		#
		# Warnings part - this is required here to reset warnings
		#
		#

		# Reset warnings regardless of validation result
		# Remove input warning styles as needed
		if @options.inputWarning
			toggle(element, @options.inputWarning, false);

		# Remove parent styles as needed
		if parent
			if @options.parentWarning
				toggle(parent, @options.parentWarning, false);
		if warnings
			hide warnings
			warnings.innerHTML = ''

		return isValid

	#
	# Apply warnings of one input
	#
	# @param validator Maslosoft.Ko.Balin.BaseValidator
	# @param element DomElement
	# @param value mixed
	#
	# @return ValidationManager
	#
	adviseOne: (validator, value) =>
		# Reassign variables for local scope
		element = @element
		parent = @parent
		errors = @errors
		warnings = @warnings

		messages = validator.getWarnings()
		# If has warnings remove success and add warnings to any applicable element
		if messages.length

			# Apply input warning styles as needed
			if @options.inputWarning
				toggle(element, @options.inputWarning, true);
			if @options.inputSuccess
				toggle(element, @options.inputSuccess, false);

			# Apply parent styles as needed
			if parent
				if @options.parentWarning
					toggle(parent, @options.parentWarning, true);
				if @options.parentSuccess
					toggle(parent, @options.parentSuccess, false);

			# Show warnings if any
			if warnings
				show warnings
				warnings.innerHTML = messages.join '<br />'

		return @

if not @Maslosoft.Ko.Balin.Widgets.TreeGrid
	@Maslosoft.Ko.Balin.Widgets.TreeGrid = {}


class Maslosoft.Ko.Balin.Widgets.TreeGrid.Dnd

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	#
	# Drag helper
	#
	# @var jQuery element
	#
	helper: null

	#
	# Drop indicator
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.DropIndicator
	#
	indicator = null

	#
	# Element over which currently item is dragged
	# @var jQuery element
	#
	draggedOver = null

	#
	# Element currently dragged
	# @var HTMLElement
	#
	dragged = null

	#
	# Hit mode
	# @var string
	#
	hitMode = null

	#
	# Previous hit mode, this is used for rate limit of hitMode detection
	# @var string
	#
	prevHitMode = null

	#
	# Whether drop event occured, this is required for edge cases
	# @var boolean
	#
	didDrop = false

	constructor: (@grid) ->
		
		# DND must be explicitly enabled
		if not @grid.config.dnd
			return

		if @grid.context is 'init'
			# handle disposal
			ko.utils.domNodeDisposal.addDisposeCallback @grid.element.get(0), () ->
				@grid.element.draggable("destroy")
				@grid.element.droppable("destroy")

			@grid.element.on 'mousemove', '> tr', @move

		if not indicator
			indicator = new Maslosoft.Ko.Balin.Widgets.TreeGrid.DropIndicator @grid

		defer = () =>
			draggableOptions = {
				handle: '.tree-grid-drag-handle'
				cancel: '.expander'
				revert: false
				cursor: 'pointer'
				cursorAt: { top: 5, left: 5 }
				start: @dragStart
				drag: @drag
				stop: @stop
				helper: @dragHelper
			}
			droppableOptions = {
				drop: @drop
				over: @over
			}
			@grid.element.find('> tr').draggable(draggableOptions)
			@grid.element.find('> tr').droppable(droppableOptions)

		setTimeout defer, 0

	#
	# On drag start
	#
	#
	dragStart: (e) =>
		dragged = e.target
		# data = ko.dataFor e.target
		# console.log "Started #{data.title}"

	drag: (e, helper) =>

	#
	# Drop if stopped dragging without dropping
	# This is required when dragging near top or bottom of container
	#
	#
	stop: (e) =>
		if not didDrop
			@drop e

	#
	# Drop in a normal manner, see also `stop` for edge case
	# TODO Freeze cell width containing nodes, or flicker might occur. 
	# Freeze must be released on timeout
	#
	drop: (e) =>
		didDrop = true
		if not dragged
			return @clear()
		if not draggedOver
			return @clear()
		if not draggedOver.get(0)
			return @clear()
		current = ko.dataFor dragged
		over = ko.dataFor draggedOver.get(0)
		overParent = @grid.getParent over
		# console.log "Drop #{current.title} over #{over.title}"
		# console.log arguments

		@grid.remove current
		
		if hitMode is 'over'
			# Most obvious case, when dragged node is directly over
			# dropped node, inser current node as it's last child
			over.children.push current
		if hitMode is 'before'
			# Insert node before current node, this is case when
			# insert mark is before dragged over node
			index = overParent.children.indexOf over
			overParent.children.splice index, 0, current
		if hitMode is 'after'
			# When node has childs, then add just at beginning
			# to match visual position of dragged node
			if over.children.length
				overParent.children.splice 0, 0, current
			else
				# When not having childs, it means that node is
				# last on the level so insert as a last node
				overParent.children.push current
		@clear()

	#
	# Handle over state to get element to be about to be dropped
	# This is bound to droppable `over`
	#
	over: (e) =>
		# Dont stop propagation, just detect row
		if e.target.tagName.toLowerCase() is 'tr'

			# Limit updates to only when dragging over different items
			if draggedOver isnt e.target
				draggedOver = jQuery e.target
				@dragOver e

	#
	# On drag over, evaluated only if entering different element or hit mode
	#
	# 
	#
	#
	#
	dragOver: (e) =>
		if indicator
			data = ko.dataFor draggedOver.get(0)
			# FIXME TEMP Allow dropping only on items not containing `t` in title
			if data.title.toLowerCase().indexOf('t') is -1
				indicator.accept()
			else
				indicator.deny()
			indicator.precise.over draggedOver, hitMode

	#
	# Move handler for mousemove for precise position calculation
	# * Detect over which tree element is cursor and if it's more
	# on top/bottom edge or on center
	#
	move: (e) =>
		if dragged
			# Dragged over itself must be handled here,
			# as it is not evaluated on `over`
			if e.currentTarget is dragged
				if not draggedOver or dragged isnt draggedOver.get(0)
					# console.log dragged
					e.target = dragged
					@over e

		if draggedOver
			
			offset = draggedOver.offset()

			pos = {}
			pos.x = e.pageX - offset.left
			pos.y = e.pageY - offset.top

			rel = {}
			rel.x = pos.x / draggedOver.outerWidth(true)
			rel.y = pos.y / draggedOver.outerHeight(true)
			hitMode = 'over'
			if rel.y > 0.65
				hitMode = 'after'
			if rel.y <= 0.25
				hitMode = 'before'

			# Rate limiting for hit mode
			if prevHitMode isnt hitMode
				prevHitMode = hitMode
				e.target = draggedOver
				@dragOver e


	#
	# Reset apropriate things on drop
	#
	#
	clear: () =>
		draggedOver = null
		dragged = null
		hitMode = null
		prevHitMode = null
		didDrop = false
		# Destroy helpers and indicators
		if @helper
			@helper.hide()
			@helper = null
		if indicator
			indicator.hide()

	#
	# Initialize drag helper
	#
	#
	dragHelper: (e) =>
		
		tbody = jQuery(e.currentTarget).parent()
		cell = tbody.find('.tree-grid-drag-handle').parents('td').first()
		item = cell.clone()
		item.find('.expander .expanded').remove()
		item.find('.expander .collapsed').remove()
		item.find('.expander').remove()
		item.find('.no-expander').remove()
		dropIndicator = "<span class='drop-indicator'>&times;</span>"
		@helper = jQuery("<div style='white-space:nowrap;'>#{dropIndicator}#{item.html()}</div>")
		@helper.css("pointer-events","none")
		
		indicator.attach @helper.find('.drop-indicator')
		return @helper


class Maslosoft.Ko.Balin.Widgets.TreeGrid.DropIndicator

	#
	# Precise indicator holder
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.InsertIndicator
	#
	@precise: null

	#
	# Indicator element instance boud to draggable
	# @var jQuery element
	#
	@element: null

	constructor: (@grid) ->

		@precise = new Maslosoft.Ko.Balin.Widgets.TreeGrid.InsertIndicator @grid

	attach: (@element) ->
		@element.css 'font-size': '1.5em'
		@element.css 'width': '1em'
		@element.css 'height': '1em'
		@element.css 'position': 'absolute'
		# 1/2 of font size
		@element.css 'left': '-.75em'
		# 1/4 of font size
		@element.css 'top': '-.35em'

	hide: () ->
		@element.hide()
		@precise.hide()

	show: () ->
		@element.show()
		@precise.show()

	accept: () ->
		@element.html('&check;')
		@element.css 'color': 'green'
		@precise.accept()

	deny: () ->
		@element.html('&times;')
		@element.css 'color': 'red'
		@precise.deny()

class Maslosoft.Ko.Balin.Widgets.TreeGrid.Events

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	constructor: (@grid, context) ->
	
		if not @grid.config.on
			return

class Maslosoft.Ko.Balin.Widgets.TreeGrid.Expanders

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	constructor: (@grid, context) ->

		# Expanders explicitly disabled
		if @grid.config.expanders is false
			return

		# Initialize click handlers only on init
		if @grid.context is 'init'
			@grid.element.on 'mousedown', '.expander', @handler

		if @grid.context is 'update'
			@updateExpanders()

	updateExpanders: () =>

		one = (item, data) =>
			hasChildren = !!data.children.length
			if hasChildren
				item.find('.no-expander').hide()
				item.find('.expander').show()
			else
				item.find('.expander').hide()
				item.find('.no-expander').show()
			item.find('.debug').html data.children.length
		defer = () =>
			@grid.visit one

#		defer()
		setTimeout defer, 0

	handler: (e) =>
		current = ko.contextFor(e.target).$data

		depth = -1
		show = false

		log "clicked on expander #{current.title}"

		initOne = (item, data) =>
			itemDepth = data._treeGrid.depth
			if data is current
				depth = itemDepth
				el = item.find('.expander')
				if el.find('.expanded:visible').length
					el.find('.expanded').hide()
					el.find('.collapsed').show()
					show = false
				else
					el.find('.collapsed').hide()
					el.find('.expanded').show()
					show = true
				# Current item should be left intact, so skip to next item
				return

			# Not found yet, so continue
			if depth is -1 then return

			# Found item on same depth, skip further changes
			if itemDepth is depth
				depth = -1
				return

			# toggle all one depth lower
			if itemDepth - 1 is depth
				if show
					item.show()
				else
					item.hide()

		# TODO 1. Hide also deeper items if parent of them expanded
		# and show them back if parent of them is expanded

		@grid.visit initOne


#
# Insert indicator
#
#
#

class Maslosoft.Ko.Balin.Widgets.TreeGrid.InsertIndicator

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	#
	#
	# @private
	# @static
	#
	initialized = false

	#
	# Indicator main wrapper
	# @var jQuery element
	# @private
	# @static
	#
	indicator = null

	#
	# Indicator coarse item
	# @var jQuery element
	# @private
	# @static
	#
	coarse = null

	#
	# Indicator precise item
	# @var jQuery element
	# @private
	# @static
	#
	precise = null

	constructor: (@grid) ->

		if not initialized
			@create()
			initialized = true

	hide: () ->
		indicator.hide()

	show: () ->
		indicator.show()

	accept: () ->
		indicator.css color: 'green'

	deny: () ->
		indicator.css color: 'red'

	#
	# Place over element, with hitMode param
	#
	#
	over: (element, hitMode = 'over') ->
		
		if hitMode is 'over'
			@precise false
		else
			@precise true

		node = element.find('.tree-grid-drag-handle')
		expander = element.find('.expander')
		noExpander = element.find('.no-expander')
		widthOffset = 0
		offset = node.offset()
		mid = indicator.outerHeight(true) / 2
		
		if hitMode is 'over'
			nodeMid = node.outerHeight(true) / 2
			top = offset.top + nodeMid - mid

		if hitMode is 'before'
			top = offset.top - mid

		if hitMode is 'after'
			top = offset.top + node.outerHeight(true) - mid

		left = offset.left + widthOffset

		indicator.css left: left
		indicator.css top: top

		@show()


	#
	# Show or hide precise indicator
	#
	#
	precise: (showPrecise = true) ->
		if showPrecise
			precise.show()
		else
			precise.hide()

	create: () ->
		indicator = jQuery '''
		<div class="tree-grid-insert-indicator" style="display:none;position:absolute;color:green;line-height: 1em;">
			<span class="tree-grid-insert-indicator-coarse" style="font-size: 1.5em;">
				&#9654;
			</span>
			<span class="tree-grid-insert-indicator-precise" style="font-size:1.4em;">
				&#11835;
			</span>
		</div>
		'''
		indicator.appendTo 'body'
		coarse = indicator.find '.tree-grid-insert-indicator-coarse'
		precise = indicator.find '.tree-grid-insert-indicator-precise'
		
		indicator.show()

class Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView

	#
	# Plugins for tree grid
	#
	# NOTE: Order of plugins *might* be important, especially for built-in plugins
	#
	# @var Object[]
	#
	@plugins = [
		Maslosoft.Ko.Balin.Widgets.TreeGrid.Expanders
		Maslosoft.Ko.Balin.Widgets.TreeGrid.Dnd
		Maslosoft.Ko.Balin.Widgets.TreeGrid.Events
	]

	#
	# Tbody element - root of tree
	#
	# @var jQuery element
	#
	element: null

	#
	# Configuration of binding
	#
	# @var Object
	#
	config: null

	constructor: (element, valueAccessor = null, @context = 'init') ->

		@element = jQuery element
		
		if valueAccessor
			@config = {}
			@config = ko.unwrap(valueAccessor())

			for plugin in TreeGridView.plugins
				new plugin(@)

#			console.log data

	#
	# Visit each node and apply callback.
	# Callback accepts two parameters:
	#
	# * element - contains current row jQuery element
	# * data - contains data attached to element
	#
	#
	visit: (callback) ->
		items = @element.find('> tr')
		for item in items
			data = ko.dataFor(item)
			callback(jQuery(item), data)

	#
	# Visit each node starting from tree root and apply callback.
	# Callback accepts two parameters:
	#
	# * parent - contains current element parent item, might be null
	# * data - contains data attached to element
	#
	#
	visitRecursive: (callback, model = null) =>
		if not model
			ctx = ko.contextFor @element.get(0)
			model = ctx.tree
			callback null, model
			for child in model.children
				callback model, child
				@visitRecursive callback, child
		else
			for child in model.children
				callback model, child
				@visitRecursive callback, child

	getParent: (model) =>
		found = null
		one = (parent, data) ->
			if data is model
				found = parent
		@visitRecursive one
		return found

	remove: (model) =>
		one = (parent, data) ->
			if parent and parent.children
				parent.children.remove model
				
		@visitRecursive one

	expandAll: () ->

	collapseAll: () ->

@Maslosoft.Ko.getType = (type) ->
	if x and typeof x is 'object'
		if x.constructor is Date then return 'date'
		if x.constructor is Array then return 'array'
	return typeof x

@Maslosoft.Ko.objByName = (name, context = window) ->
	args = Array.prototype.slice.call(arguments, 2)
	ns = name.split "."
	func = context
	part = []
	for n, i in ns
		part.push n
		if typeof func[n] is 'undefined'
			throw new Error "Name part `#{part.join('.')}` not found while accesing #{name}"
		func = func[n]
	return func

class @Maslosoft.Ko.Track

	factory: (data) =>
		# Return if falsey value
		if not data then return data

		# Check if has prototype
		if data._class
			# Convert PHP class name to js class name
			className = data._class.replace(/\\/g, '.')
			try
				ref = Maslosoft.Ko.objByName(className)
			catch Error
				console.warn("Could not resolve class name `#{className}`")

			if ref
				return new ref(data)
			else
				console.warn("Class `#{className}` not found, using default object")
				console.debug(data)

		# Track generic object
		if typeof(data) is 'object'
			data = ko.track(data, {deep: true})
			# Check if array (different loop used here)
			if Array.isArray data
				for model, index in data
					data[index] = @factory model
			else
				for name, value of data
					data[name] = @factory(value)
		
		return data

	fromJs: (model, jsData) =>
		for name, value of jsData
			if typeof(value) is 'object'
				if model[name]
					@fromJs model[name], value
				else
					model[name] = @factory value
			else
				model[name] = value

ko.tracker = new @Maslosoft.Ko.Track

#
# Model class with automatically applied knockout bindings
#

# Stub to ignore fatals
if !window.Proxy
	console.warn 'Your browser does not support Proxy, will not work properly in some cases...'
	class window.Proxy

class ModelProxyHandler
	constructor: (@parent, @field) ->

	set: (target, name, value, receiver) ->
		changed = false

		# Detect value change
		if target[name] isnt value
#			log "Changed: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
			changed = true

		# Detect keys change
		before = Object.keys(target).length
		target[name] = value
		after = Object.keys(target).length
		if before isnt after
#			log "New key: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
			changed = true
		
		# Notify change
		if changed
			ko.valueHasMutated(@parent, @field)
		return true

	deleteProperty: (target, name) ->
		delete target[name]
		# Notify change
#		log "Deleted: #{@parent.constructor.name}.#{@field} @ #{target.constructor.name}.#{name}"
		ko.valueHasMutated(@parent, @field)
		return true

# Map for concrete objects initializations
if WeakMap
	initMap = new WeakMap()
else
	initMap = new Map()

class @Maslosoft.Ko.Balin.Model

	constructor: (data = null) ->

		initialized = initMap.get @

		# Dereference first
		for name, value of @
			if isPlainObject @[name]
				@[name] = {}
			if Array.isArray @[name]
				@[name] = []

		# Initialize new object
		if not initialized
			initMap.set @, true
			# Reassign here is required - when using model with values from class prototype only
			for name, value of @

				@[name] = ko.tracker.factory(value)

				# Extra track of object properties.
				if isPlainObject @[name]
					@[name] = new Proxy(@[name], new ModelProxyHandler(@, name))

		# Apply data
		for name, value of data
			@[name] = ko.tracker.factory(value)

		# Track plain objects always
		for name, value of @
			if isPlainObject @[name]
				@[name] = new Proxy(@[name], new ModelProxyHandler(@, name))
		ko.track(@, {deep: true})

@Maslosoft.Ko.Balin.registerDefaults()
ko.punches.enableAll()
