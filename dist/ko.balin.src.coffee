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
# Register default set of binding handlers
#
@Maslosoft.Ko.Balin.registerDefaults = () ->
	Maslosoft.Ko.Balin.register('htmlValue', new Maslosoft.Ko.Balin.HtmlValue)
	
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

	constructor: (values = {}) ->

		for index, value of values
			@[index] = value

		if @ec5 is null
			@ec5 = !!ko.track


class @Maslosoft.Ko.Balin.DateTime extends @Maslosoft.Ko.Balin.Base

	constructor: (options) ->
		@options = new @Maslosoft.Ko.Balin.DateTimeOptions(options)

class @Maslosoft.Ko.Balin.DateTimeOptions extends @Maslosoft.Ko.Balin.Options

	# Time/Date display format
	# @var string
	#
	displayFormat: 'YYYY-MM-DD'
#
# One-way file size formatter
#
class @Maslosoft.Ko.Balin.FileSizeFormatter extends @Maslosoft.Ko.Balin.Base

	init: (element, valueAccessor, allBindingsAccessor, viewModel) ->

	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		value = @getValue(valueAccessor)
		format = (bytes) ->
			i = -1
			units = [
				" kB"
				" MB"
				" GB"
				" TB"
				"PB"
				"EB"
				"ZB"
				"YB"
			]
			loop
				bytes = bytes / 1024
				i++
				break unless bytes > 1024
			Math.max(bytes, 0.1).toFixed(1) + units[i]

		element.innerHTML = format(value)
		return
#
# Html value binding
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
		$(document).on "mouseup", handler
		return

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if element.innerHTML isnt value
#			console.log "Update: #{element.innerHTML} = #{value}"
			element.innerHTML = value
		return
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
#
# Base configuration class
#
class @Maslosoft.Ko.Balin.MomentOptions extends @Maslosoft.Ko.Balin.Options

	# Time/Date source format
	# @var string
	#
	sourceFormat: 'unix'

	# Time/Date display format
	# @var string
	#
	displayFormat: null
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