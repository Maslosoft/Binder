if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko
	@Maslosoft.Ko = {}
if not @Maslosoft.Ko.Balin
	@Maslosoft.Ko.Balin = {}

#
# Register binding handler
# @param string name
# @params Maslosoft.Ko.Balin.Base handler
#
@Maslosoft.Ko.Balin.register = (name, handler) ->

	ko.bindingHandlers[name] = handler

	#Reassign options
	#ko.bindingHandlers[name].options = JSON.parse(JSON.stringify(handler.options))
	
	# Assign two way. Not sure if nessesary in current ko
	if handler.writable
		if ko.expressionRewriting and ko.expressionRewriting.twoWayBindings
			ko.expressionRewriting.twoWayBindings[name] = true

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
		dateFormatter: Maslosoft.Ko.Balin.DateFormatter
		dateTimeFormatter: Maslosoft.Ko.Balin.DateTimeFormatter
		disabled: Maslosoft.Ko.Balin.Disabled
		enumCssClassFormatter: Maslosoft.Ko.Balin.EnumCssClassFormatter
		enumFormatter: Maslosoft.Ko.Balin.EnumFormatter
		fancytree: Maslosoft.Ko.Balin.Fancytree
		fileSizeFormatter: Maslosoft.Ko.Balin.FileSizeFormatter
		hidden: Maslosoft.Ko.Balin.Hidden
		href: Maslosoft.Ko.Balin.Href
		htmlValue: Maslosoft.Ko.Balin.HtmlValue
		icon: Maslosoft.Ko.Balin.Icon
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
		return value or defaults

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
	
	inputError: 'error'
	parentError: 'has-error'
	inputSuccess: 'success'
	parentSuccess: 'has-success'


class @Maslosoft.Ko.Balin.BaseValidator

	constructor: (config) ->
		for index, value of config
			@[index] = value
#
# CSS class binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.CssClass extends @Maslosoft.Ko.Balin.Base

	writable: false

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if value
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


class @Maslosoft.Ko.Balin.WidgetUrl extends @Maslosoft.Ko.Balin.Base

	getData: (element, valueAccessor, allBindings, bindingName) ->
		src = @getValue(valueAccessor)

		data = {}
		data.id = allBindings.get('widgetId') or src.id

		if allBindings.get('widget')
			data.id = allBindings.get('widget').id

		data[bindingName] = allBindings.get(bindingName) or src[bindingName]
		data.params = allBindings.get('params') or src.params

		data.params = @getValue(data.params)
		
		if typeof(src) is 'string'
			data[bindingName] = src
		
		return data

	createUrl: (widgetId, action, params, terminator) =>
		
		args = [];
		if typeof(params) is 'string' or typeof(params) is 'number'
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
# Date formatter
#
class @Maslosoft.Ko.Balin.DateFormatter extends @Maslosoft.Ko.Balin.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateOptions(options)


###
One-way date/time formatter
###
class @Maslosoft.Ko.Balin.DateTimeFormatter extends @Maslosoft.Ko.Balin.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateTimeOptions(options)


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

		# Tree options
		options = valueAccessor().options or {}
		options.source = @getData(valueAccessor)

		jQuery(element).fancytree(options);

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue(valueAccessor)
		element = jQuery element

		handler = () =>

			if not element.find('.ui-fancytree').length then return
			
			element.fancytree 'option', 'source', @getData(valueAccessor)

			# Autoexpand handling
			if config.autoExpand
				element.fancytree('getRootNode').visit (node) ->
					node.setExpanded true
			element.focus()

		# Put rendering to end of queue to ensure bindings are evaluated
		setTimeout handler, 0
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
# Html value binding
# WARNING This MUST have parent context, or will not work
#
class @Maslosoft.Ko.Balin.HtmlValue extends @Maslosoft.Ko.Balin.Base

	# Counter for id generator
	idCounter = 0
	
	constructor: (options = {}) ->
		super(options)
		
		if ko.bindingHandlers.sortable and ko.bindingHandlers.sortable.options
			# Allow `contenteditable` to get focus
			ko.bindingHandlers.sortable.options.cancel = ':input,button,[contenteditable]'

	getElementValue: (element) ->
		return element.innerHTML

	setElementValue: (element, value) ->
		element.innerHTML = value

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		
		element.setAttribute('contenteditable', true)
		
		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Balin-HtmlValue-#{idCounter++}"

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

		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup, input", handler

		# This is to allow interation with tools which could modify content, also to work with drag and drop
		ko.utils.registerEventHandler document, "mouseup", handler
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
				src = src + model.updateDate.sec
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

		# Update src only if changed
		if $element.attr("src") != src
			$element.attr "src", src

		# Set max image dimentions
		$element.css
			maxWidth: size
			maxHeight: size

		return

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

#
# Tooltip binding handler
#
class @Maslosoft.Ko.Balin.Tooltip extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor) =>
		title = @getValue(valueAccessor)
		$(element).attr "title", title
		$(element).attr "rel", "tooltip"
		return


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

	validate: (validator, element, value) =>
		parent = element.parentElement
		
		if validator.isValid(value)
			# Apply input error styles as needed
			if @options.inputError
				ko.utils.toggleDomNodeCssClass(element, @options.inputError, false);
			if @options.inputSuccess
				ko.utils.toggleDomNodeCssClass(element, @options.inputSuccess, true);

			# Apply parent styles as needed
			if parent
				if @options.parentError
					ko.utils.toggleDomNodeCssClass(parent, @options.parentError, false);
				if @options.parentSuccess
					ko.utils.toggleDomNodeCssClass(parent, @options.parentSuccess, true);
		else
			# Errors...
			console.log validator.getErrors()

			# Apply input error styles as needed
			if @options.inputError
				ko.utils.toggleDomNodeCssClass(element, @options.inputError, true);
			if @options.inputSuccess
				ko.utils.toggleDomNodeCssClass(element, @options.inputSuccess, false);

			# Apply parent styles as needed
			if parent
				if @options.parentError
					ko.utils.toggleDomNodeCssClass(parent, @options.parentError, true);
				if @options.parentSuccess
					ko.utils.toggleDomNodeCssClass(parent, @options.parentSuccess, false);


	init: (element, valueAccessor, allBindingsAccessor, context) =>
		config = @getValue(valueAccessor)

		# Store class name first
		className = config.class

		# Remove class key
		delete(config.class)

		# Instantiate validator
		validator = new className(config)

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
			# Update only if changed
			if initialVal isnt elementValue
				initialVal = elementValue
				@validate(validator, element, elementValue)

		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup, input", handler

		# This is to allow interation with tools which could modify content, also to work with drag and drop
		ko.utils.registerEventHandler document, "mouseup", handler


	update: (element, valueAccessor, allBindings) =>

class @Maslosoft.Ko.Balin.WidgetAction extends @Maslosoft.Ko.Balin.WidgetUrl

	update: (element, valueAccessor, allBindings) =>

		data = @getData(element, valueAccessor, allBindings, 'action')
		href = @createUrl(data.id, data.action, data.params, '?')

		element.setAttribute('href', href)
		element.setAttribute('rel', 'virtual')


class @Maslosoft.Ko.Balin.WidgetActivity extends @Maslosoft.Ko.Balin.WidgetUrl

	update: (element, valueAccessor, allBindings) =>
		
		data = @getData(element, valueAccessor, allBindings, 'activity')
		href = @createUrl(data.id, data.activity, data.params, '#')

		element.setAttribute('href', href)
		element.setAttribute('rel', 'virtual')
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
		if typeof data is 'object'
			for name, value of data
				data[name] = @factory(value)
			data = ko.track(data)
			
		return data
		
		

ko.tracker = new @Maslosoft.Ko.Track
#
# Model class with automatically applied knockout bindings
#
class @Maslosoft.Ko.Balin.Model
	
	constructor: (data = null) ->

		# Reassign here is required - when using model with values from class prototype only
		for name, value of @
			if data and typeof data[name] isnt 'undefined'
				@[name] = ko.tracker.factory(data[name])
			else
				@[name] = ko.tracker.factory(value)

		ko.track(@)
@Maslosoft.Ko.Balin.registerDefaults()
