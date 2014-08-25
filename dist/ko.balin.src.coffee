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
	if handler.writable
		ko.expressionRewriting.twoWayBindings[name] = true

#
# Register default set of binding handlers, or part of default set
#
@Maslosoft.Ko.Balin.registerDefaults = (handlers = null) ->
	config = {
		fancytree: Maslosoft.Ko.Balin.Fancytree,
		fileSizeFormatter: Maslosoft.Ko.Balin.FileSizeFormatter,
		href: Maslosoft.Ko.Balin.Href,
		htmlValue: Maslosoft.Ko.Balin.HtmlValue,
		src: Maslosoft.Ko.Balin.Src
		textValue: Maslosoft.Ko.Balin.TextValue
	}
	if handlers isnt null
		for index, value of handlers
			Maslosoft.Ko.Balin.register(value, new config[value])
	else
		for index, value of config
			Maslosoft.Ko.Balin.register(index, new value)
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
	options: null

	# Class constructor
	# @param options @Maslosoft.Ko.Balin.Options
	#
	constructor: (@options = {}) ->

	#
	# Get value from model
	#
	getValue: (valueAccessor, defaults = '') =>
		value = ko.unwrap(valueAccessor())
		if @options.valueField
			if @options.ec5
				value = value[@options.valueField]
			else
				value = value[@options.valueField]()
		return value or defaults
		
	#
	# Set value back to model
	#
	setValue: (valueAccessor, value) ->
		# TODO
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
				


class @Maslosoft.Ko.Balin.DateTime extends @Maslosoft.Ko.Balin.Base

	constructor: (options) ->
		@options = new @Maslosoft.Ko.Balin.DateTimeOptions(options)

###
One-way date/time formatter
###
class @Maslosoft.Ko.Balin.MomentFormatter extends @Maslosoft.Ko.Balin.Base
	
	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		moment.lang @options.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@sourceformat](value).format(@displayformat)
		return
class @Maslosoft.Ko.Balin.Fancytree extends @Maslosoft.Ko.Balin.Base

	tree: null
	element: null

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		options = {
			autoExpand: true
		}
		element = jQuery element

		handler = () =>

			if element.find('.ui-fancytree').length == 0
				return

			element.fancytree 'option', 'source', valueAccessor()
#				element.fancytree('getTree').getTree()
#				element.fancytree('getTree').reload(dp)
			#element.fancytree('getTree').init()
			if options.autoExpand
				element.fancytree('getRootNode').visit (node) ->
					node.setExpanded true
			element.focus()
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
# TODO Check if sortable is available, and if active, add `[contenteditable]` to `cancel` option
#
class @Maslosoft.Ko.Balin.HtmlValue extends @Maslosoft.Ko.Balin.Base

	# Counter for id generator
	idCounter = 0

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
			elementValue = element.innerHTML
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

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if element.innerHTML isnt value
#			console.log "Update: #{element.innerHTML} = #{value}"
			element.innerHTML = value
		return
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
# Html value binding
# WARNING This MUST have parent context, or will not work
# TODO Check if sortable is available, and if active, add `[contenteditable]` to `cancel` option
# TODO Refactor this, to inherit from HtmlValue
#
class @Maslosoft.Ko.Balin.TextValue extends @Maslosoft.Ko.Balin.Base

	# Counter for id generator
	idCounter = 0

	getText: (element) =>
		element.textContent || element.innerText || ""

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		element.setAttribute('contenteditable', true)

		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Balin-TextValue-#{idCounter++}"

		handler = (e) =>

			# On some situations element might be null (sorting), ignore this case
			if not element then return

			# This is required in some scenarios, specifically when sorting htmlValue elements
			element = document.getElementById(element.id)
			if not element then return

			accessor = valueAccessor()
			modelValue = @getValue(valueAccessor)
			elementValue = element.textContent || element.innerText || ""
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

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if typeof element.textContent isnt 'undefined'
			if element.textContent isnt value
				element.textContent = value
		if typeof element.innerText isnt 'undefined'
			if element.innerText isnt value
				element.innerText = value

		return
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
			ref = Maslosoft.Ko.objByName(className)
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

#class @Maslosoft.Ko.TrackTest extends @Maslosoft.Components.Model
#	name: ''
#	nested: null
#
#	_class: 'Maslosoft\\Ko\\TrackTest'
#	rawI18N: null
#	parentId: null
#
#class @Maslosoft.Ko.TrackTestNest extends @Maslosoft.Components.Model
#	_class: 'Maslosoft\\Ko\\TrackTestNest'
#	name: ''