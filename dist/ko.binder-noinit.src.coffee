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

setRefByName = (name, value, context = window) ->
	args = Array.prototype.slice.call(arguments, 2)
	ns = name.split "."
	func = context
	for n, i in ns
		console.log i
		if i == ns.length - 1
			console.log n
			func[n] = value
		func = func[n]
	return func

escapeRegExp = (str) ->
	# $& means the whole matched string
	return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

entityMap =
	'&': '&amp;'
	'<': '&lt;'
	'>': '&gt;'
	'"': '&quot;'
	"'": '&#39;'
	'/': '&#x2F;'
	'`': '&#x60;'
	'=': '&#x3D;'


escapeHtml = (string) ->
	return String(string).replace(/[&<>"'`=\/]/g, (s) ->
		return entityMap[s]
	)

#
# Compare objects for equallness.
#
# Example:
# equals({x: 2}, {x: 2}); // Returns true
#
# Optionally skip properties (recursively) to compare:
# equals({x: 2, y: false}, {x: 2, y: true}, ['y']); // Returns true
# equals({y: false, x: 2, z: {x: 1, y: 1}}, {x: 2, y: true, z: {x: 1, y: 2}}, ['y']); // Returns true
#
# @link https://stackoverflow.com/a/6713782/5444623
#
#
equals = (x, y, skip = []) ->

	doSkip = (property) ->
		return skip.indexOf(property) != -1

	# if both x and y are null or undefined and exactly the same
	if x == y
		return true

	# if they are not strictly equal, they both need to be Objects
	if !(x instanceof Object) or !(y instanceof Object)
		return false

	# they must have the exact same prototype chain, the closest we can do is
	# test there constructor.
	if x.constructor != y.constructor
		return false

	for p of x
		if doSkip p
			continue

		# other properties were tested using x.constructor === y.constructor
		if !x.hasOwnProperty(p)
			continue

		# allows to compare x[ p ] and y[ p ] when set to undefined
		if !y.hasOwnProperty(p)
			return false

		# if they have the same strict value or identity then they are equal
		if x[p] == y[p]
			continue

		# Numbers, Strings, Functions, Booleans must be strictly equal
		if typeof x[p] != 'object'
			return false

		# Objects and Arrays must be tested recursively
		if !equals(x[p], y[p], skip)
			return false

	for p of y
		if doSkip p
			continue
		`p = p`
		# allows x[ p ] to be set to undefined
		if y.hasOwnProperty(p) and !x.hasOwnProperty(p)
			return false
	true

#
# Generate CSS hex color based on input string
#
#
#
stringToColour = (str) ->
	
	hash = 0
	i = 0
	i = 0
	while i < str.length
		hash = str.charCodeAt(i) + (hash << 5) - hash
		i++
	colour = '#'
	i = 0
	while i < 3
		value = hash >> i * 8 & 0xFF
		colour += ('00' + value.toString(16)).substr(-2)
		i++
	colour
"use strict"
if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko
	@Maslosoft.Ko = {}
if not @Maslosoft.Ko.Balin
	@Maslosoft.Ko.Balin = {}
if not @Maslosoft.Binder
	@Maslosoft.Binder = {}
if not @Maslosoft.Binder.Helpers
	@Maslosoft.Binder.Helpers = {}
if not @Maslosoft.Binder.Widgets
	@Maslosoft.Binder.Widgets = {}

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

#
# Base class for Maslosoft binding handlers
#
class @Maslosoft.Binder.Base

	#
	# Whenever to register binding handler as writable
	# @var boolean
	#
	writable: true

	#
	# @var @Maslosoft.Binder.Options
	#
	options: {}

	# Class constructor
	# @param options @Maslosoft.Binder.Options
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

class @Maslosoft.Binder.Options

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
class @Maslosoft.Binder.CssOptions extends @Maslosoft.Binder.Options
	
	className: 'active'

#
# Configuration class for date bindings
#
class @Maslosoft.Binder.DateOptions extends @Maslosoft.Binder.Options

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
class @Maslosoft.Binder.DateTimeOptions extends @Maslosoft.Binder.Options

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
class @Maslosoft.Binder.TimeAgoOptions extends @Maslosoft.Binder.Options

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
class @Maslosoft.Binder.TimeOptions extends @Maslosoft.Binder.Options

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
class @Maslosoft.Binder.ValidatorOptions extends @Maslosoft.Binder.Options

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



class @Maslosoft.Binder.BaseValidator

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
class @Maslosoft.Binder.CssClass extends @Maslosoft.Binder.Base

	writable: false

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if !!value
			ko.utils.toggleDomNodeCssClass(element, @options.className, true);
		else
			ko.utils.toggleDomNodeCssClass(element, @options.className, false);
		return

#
# CSS class binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.CssColumnsBase extends @Maslosoft.Binder.Base

	writable: false

	applyColumns: (element, sizes, config) =>

		newClasses = []
		for size, name of config
		# Remove previously set classes
			reName = name.replace '{num}', '\\d'
			name = name.replace '{num}', ''
			re = new RegExp("(?:^|\\s)#{reName}+(?!\\S)", 'g')
			element.className = element.className.replace(re, '')
			newClasses.push name + sizes[size];

		jQuery(element).addClass newClasses.join ' '
		return

#
# Moment formatter class
#
class @Maslosoft.Binder.MomentFormatter extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.Picker extends @Maslosoft.Binder.Base

#
# Base class for video related bindings
#
class @Maslosoft.Binder.Video extends @Maslosoft.Binder.Base

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


class @Maslosoft.Binder.WidgetUrl extends @Maslosoft.Binder.Base

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
		isPlain = false
		rels = []
		rel = element.getAttribute('rel')
		if rel
			rels = rel.split(' ')
			for relValue in rels
				if relValue is 'plain'
					isPlain = true
				if relValue is 'virtual'
					hasRel = true

		if not hasRel and not isPlain
			rels.push 'virtual'

		element.setAttribute('rel', rels.join(' '))
#
# Acl binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.Acl extends @Maslosoft.Binder.Base
	
	allow = null

	init: () =>
		if not Maslosoft.Binder.Acl.allow
			throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions")

		if typeof(Maslosoft.Binder.Acl.allow) isnt 'function'
			throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions")

	update: (element, valueAccessor) =>
		acl = @getValue(valueAccessor)
		value = Maslosoft.Binder.Acl.allow(acl)

		# Forward to visible
		ko.bindingHandlers.visible.update element, ->
			value
#
# Disabled binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.Active extends @Maslosoft.Binder.CssClass

	constructor: (options) ->
		super new Maslosoft.Binder.CssOptions({className: 'active'})

#
# Asset binding handler
#
class @Maslosoft.Binder.Asset extends @Maslosoft.Binder.Base

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
# Enum css class handler
#
class @Maslosoft.Binder.CssClasses extends @Maslosoft.Binder.Base

	getClassList: (valueAccessor) =>
		classes = @getValue valueAccessor
		if typeof(classes) is 'undefined'
			return ''
		if classes is null
			return ''
		if typeof(classes) is 'string'
			classList = classes
		else
			classList = classes.join(' ')

		return classList.replace(/^\s*/, '').replace(/\s*$/, '')

	init: (element, valueAccessor) =>
		initialClasses = @getClassList(valueAccessor)

		element.setAttribute('data-css-classes', initialClasses)

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		toRemove = element.getAttribute('data-css-classes')

		ko.utils.toggleDomNodeCssClass element, toRemove, false

		classesToAdd = @getClassList(valueAccessor)

		if classesToAdd
			ko.utils.toggleDomNodeCssClass element, classesToAdd, true

		element.setAttribute('data-css-classes', classesToAdd)
#
# Enum css class handler
#
class @Maslosoft.Binder.CssColumnSizes extends @Maslosoft.Binder.CssColumnsBase

	@columns = {
		'xs': 'col-xs-{num}',
		'sm': 'col-sm-{num}',
		'md': 'col-md-{num}',
		'lg': 'col-lg-{num}'
	}

	init: (element, valueAccessor) =>

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		sizes = @getValue valueAccessor
		@applyColumns element, sizes, CssColumnSizes.columns




#
# Enum css class handler
#
class @Maslosoft.Binder.CssColumns extends @Maslosoft.Binder.CssColumnsBase

	@columns = {
		'xs': 'col-xs-{num}',
		'sm': 'col-sm-{num}',
		'md': 'col-md-{num}',
		'lg': 'col-lg-{num}'
	}

	init: (element, valueAccessor) =>

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		columns = @getValue valueAccessor

		sizes = {}

		for size, name of CssColumns.columns
			value = parseInt columns[size]
			cols = parseInt 12 / value
			sizes[size] = cols

		@applyColumns element, sizes, CssColumns.columns

#
# Data binding handler
#
class @Maslosoft.Binder.Data extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.DataModel extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.DateFormatter extends @Maslosoft.Binder.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Binder.DateOptions(options)


###
Date picker
###
class @Maslosoft.Binder.DatePicker extends @Maslosoft.Binder.Picker

	constructor: (options) ->
		super new Maslosoft.Binder.DateOptions(options)
	
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
class @Maslosoft.Binder.DateTimeFormatter extends @Maslosoft.Binder.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Binder.DateTimeOptions(options)


#
# One-way decimal formatter
#
class @Maslosoft.Binder.DecimalFormatter extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.Disabled extends @Maslosoft.Binder.CssClass

	constructor: (options) ->
		super new Maslosoft.Binder.CssOptions({className: 'disabled'})

#
# Enum css class handler
#
class @Maslosoft.Binder.EnumCssClassFormatter extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		
		# Remove previously set classes
		for name in config.values
			re = new RegExp("(?:^|\\s)#{name}(?!\\S)", 'g')
			element.className = element.className.replace(re, '')

		element.className += ' ' + config.values[config.data]
		return

#
# Enum binding handler
#
class @Maslosoft.Binder.EnumFormatter extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		if typeof(config.values[config.data]) isnt 'undefined'
			element.innerHTML = config.values[config.data]
		else
			element.innerHTML = config.data
		return

#
# Eval binding handler
#
class @Maslosoft.Binder.Eval extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.Fancytree extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.FileSizeFormatter extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.GMap extends @Maslosoft.Binder.Base

  init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

  update: (element, valueAccessor, allBindingsAccessor, viewModel) =>

    value = @getValue(valueAccessor);



#
# Hidden binding handler, opposite to visible
#
class @Maslosoft.Binder.Hidden extends @Maslosoft.Binder.Base
	
	update: (element, valueAccessor) =>
		value = not @getValue(valueAccessor)
		ko.bindingHandlers.visible.update element, ->
			value

#
# Href binding handler
#
class @Maslosoft.Binder.Href extends @Maslosoft.Binder.Base

	bustLinks = (element) ->
		# Skip on non anchor elements
		if element.tagName.toLowerCase() isnt 'a'
			return
		defer = () ->
			for innerLink in jQuery(element).find('a')
				$il = jQuery(innerLink)
				$il.replaceWith($il.contents())
		setTimeout defer, 0

	ensureHrefOn = (element) ->
		if not element.href
			attr = document.createAttribute('href')
			attr.value = ''
			element.setAttributeNode(attr)
			element.setAttribute('href', '')
			jQuery(element).attr('href', '')

	init: (element, valueAccessor, allBindingsAccessor, context) =>

		href = @getValue(valueAccessor)

		# Add href attribute if binding have some value
		if not element.href and href
			ensureHrefOn element

		bustLinks element

		# Stop propagation handling
		stopPropagation = allBindingsAccessor.get('stopPropagation') or false
		if stopPropagation
			ko.utils.registerEventHandler element, "click", (e) ->
				e.stopPropagation()

	update: (element, valueAccessor, allBindings) =>

		bustLinks element

		href = @getValue(valueAccessor)

		if href
			target = allBindings.get('target') or ''
			# Ensure attribute
			ensureHrefOn element
			if element.getAttribute('href') isnt href
				element.setAttribute 'href', href
			if element.getAttribute('target') isnt target
				element.setAttribute 'target', target
		else
			# Remove attribute if empty
			element.removeAttribute 'href'
#
# HTML improved binding handler
#
class @Maslosoft.Binder.Html extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, context) ->
		return { 'controlsDescendantBindings': true }

	update: (element, valueAccessor, allBindings, context) =>
		# setHtml will unwrap the value if needed
		value = @getValue(valueAccessor)

		configuration = @getValue(allBindings).plugins

		pm = new PluginsManager(element)

		pm.from configuration

		value = pm.getElementValue element, value

		ko.utils.setHtml(element, value)

#
# Html tree binding
#
# This simpy builds a nested ul>li struct
#
# data-bind="htmlTree: data"
#
class @Maslosoft.Binder.HtmlTree extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.HtmlValue extends @Maslosoft.Binder.Base

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
			element.id = "Maslosoft-Ko-Binder-HtmlValue-#{idCounter++}"

		configuration = @getValue(allBindingsAccessor).plugins
		pm = new PluginsManager(element)

		pm.from configuration

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
				elementValue = pm.getModelValue element, elementValue
				if modelValue isnt elementValue
					#console.log "Write: #{modelValue} = #{elementValue}"
					accessor(elementValue)
		
		# Handle update, but push update to end of queue
		deferHandler = (e) =>
			setTimeout handler, 0
		
		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		jQuery(element).on "keyup, input", handler

		# This is to allow interation with tools which could modify content, also to work with drag and drop
		jQuery(document).on "mouseup", deferHandler

		dispose = (toDispose) ->
			jQuery(toDispose).off "keyup, input", handler
			jQuery(document).off "mouseup", deferHandler

		ko.utils.domNodeDisposal.addDisposeCallback element, dispose

		return

	update: (element, valueAccessor, allBindings) =>
		value = @getValue(valueAccessor)

		configuration = @getValue(allBindings).plugins

		pm = new PluginsManager(element)

		pm.from configuration

		value = pm.getElementValue element, value
		#console.log value
		if @getElementValue(element) isnt value
			@setElementValue(element, value)
		return
#
# Icon binding handler
# This is to select proper icon or scaled image thumbnail
#
class @Maslosoft.Binder.Icon extends @Maslosoft.Binder.Base
	
	update: (element, valueAccessor, allBindings) =>
		$element = $(element)
		model = @getValue(valueAccessor)

		extra = @getValue(allBindings)

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
			matched = src.match /[^\/]*?\.(jpg|jped|gif|png|svg)$/
			nameSuffix = matched[0]
			src = src.replace /[^\/]*?\.(jpg|jped|gif|png|svg)$/, ""

		if not nameSuffix and model.filename
			nameSuffix = model.filename

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

		if extra.cachebusting
			src = src + '?' + new Date().getTime()

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
class @Maslosoft.Binder.Log extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindings) =>
		console.log @getValue(valueAccessor), element

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		console.log @getValue(valueAccessor), element
###
Date picker
NOTE: Not recommended, as Pick A Date is not maintanted
###
class @Maslosoft.Binder.PickaDate extends @Maslosoft.Binder.Picker

	constructor: (options) ->
		super new Maslosoft.Binder.DateOptions(options)

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
class @Maslosoft.Binder.Select2 extends @Maslosoft.Binder.Base

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
class @Maslosoft.Binder.Selected extends@Maslosoft.Binder.CssClass

	constructor: (options) ->
		super new Maslosoft.Binder.CssOptions({className: 'selected'})

#
# Src binding handler
#
class @Maslosoft.Binder.Src extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, context) =>

	update: (element, valueAccessor) =>
		src = @getValue(valueAccessor)
		if element.src isnt src
			element.src = src
###
Select2
###
class @Maslosoft.Binder.Tags extends @Maslosoft.Binder.Base

	dropdownKillStyles = '''
<style>
	body.kill-all-select2-dropdowns .select2-dropdown {
		display: none !important;
	}
	body.kill-all-select2-dropdowns .select2-container--default.select2-container--open.select2-container--below .select2-selection--single, .select2-container--default.select2-container--open.select2-container--below .select2-selection--multiple
	{
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.select2-container--default.select2-container--focus .select2-selection--multiple {
		border-color: #66afe9;
		outline: 0;
		-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
		box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
	}
</style>
'''

	once = true

	setTags: (el, tags) =>

		options = el.find('option')
		if options.length
			options.remove()
#		for option, index in el.find('option')

		# Add options, all as selected - as these are our tags list
		for tag, index in tags
				opt = jQuery "<option selected='true'></option>"
				opt.val(tag)
				opt.text(tag)
				el.append opt

	init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) =>

		if element.tagName.toLowerCase() isnt 'select'
			throw new Error "Tags binding must be placed on `select` element"

		if once

			jQuery(dropdownKillStyles).appendTo 'head'
			once = false

		data = @getValue valueAccessor

		if data.data
			value = data.data
		else
			# Assume direct data passing
			value = data

		copy = JSON.parse JSON.stringify value

		el = jQuery element
		el.data 'tags', true
		el.attr 'multiple', true
		
		@setTags el, copy
		
		config = {
				placeholder: data.placeholder
				tags: true
				tokenSeparators: [',', ' ']
			}

		updateCSS = () ->
			if data.inputCss
				input = el.parent().find('.select2-search__field')
				input.addClass(data.inputCss);
				input.attr 'placeholder', data.placeholder

		if data.tagCss
			config.templateSelection = (selection, element) ->
				element.removeClass 'select2-selection__choice'
				element.addClass data.tagCss
				if selection.selected
					return jQuery "<span>#{selection.text}</span>"
				else
					return jQuery "<span>#{selection.text}</span>"


		handler = =>
			if value.removeAll
				value.removeAll()
			else
				value = []

			elementValue = el.val()
			if elementValue
				for tag, index in elementValue
					# Sometimes some comas and spaces might pop in
					tag = tag.replace(',', '').replace(' ', '').trim()

					if not tag then continue
					value.push tag
			updateCSS()


		# This prevents dropdown for tags
		dropDownKill = (e) =>
			haveTags = jQuery(e.target).data();
			if haveTags
				jQuery('body').toggleClass 'kill-all-select2-dropdowns', e.type == 'select2:opening'

		build = =>

			# Apply select2
			el.select2 config

			updateCSS()

			el.on 'change', handler
			el.on 'select2:select select2:unselect', handler
			el.on 'select2:opening select2:close', dropDownKill

			# Destroy select2 on element disposal
			ko.utils.domNodeDisposal.addDisposeCallback element, =>
				el.select2 'destroy'
				if handler isnt null
					el.off 'change', handler
					el.off 'select2:select select2:unselect', handler

		setTimeout build, 0

	update: (element, valueAccessor, allBindingsAccessor) =>
		data = @getValue(valueAccessor)

		if data.data
			value = data.data
		else
			# Assume direct data passing
			value = data

		copy = JSON.parse JSON.stringify value

		el = jQuery element

		maybeSet = =>

			# Not a best moment to update
			if el.val() is null
				elementTags = ''
			else
				elementTags = el.val().join(',').replace(/(,+)/g, ',').replace(/(\s+)/g, ' ')
			modelTags = value.join(',')

			if elementTags isnt modelTags
				@setTags el, copy


		setTimeout maybeSet, 0
#
# HTML improved binding handler
#
class @Maslosoft.Binder.Text extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, context) ->
		return { 'controlsDescendantBindings': true }

	update: (element, valueAccessor, allBindings, context) =>
		# setHtml will unwrap the value if needed
		value = escapeHtml @getValue(valueAccessor)

		configuration = @getValue(allBindings).plugins

		pm = new PluginsManager(element)

		pm.from configuration

		value = pm.getElementValue element, value

		ko.utils.setHtml(element, value)

class @Maslosoft.Binder.TextToBg extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, context) ->


	update: (element, valueAccessor, allBindings, context) =>

		value = @getValue(valueAccessor)
		jQuery(element).css 'background-color', stringToColour(value)


#
# Html text value binding
# WARNING This MUST have parent context, or will not work
#
class @Maslosoft.Binder.TextValue extends @Maslosoft.Binder.HtmlValue

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
class @Maslosoft.Binder.TextValueHLJS extends @Maslosoft.Binder.HtmlValue

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


class @Maslosoft.Binder.TimeAgoFormatter extends @Maslosoft.Binder.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Binder.TimeAgoOptions(options)

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@options.sourceFormat](value).fromNow()
		return

#
# Date formatter
#
class @Maslosoft.Binder.TimeFormatter extends @Maslosoft.Binder.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Binder.TimeOptions(options)

###
Time picker
###
class @Maslosoft.Binder.TimePicker extends @Maslosoft.Binder.Base

	


#
# Tooltip binding handler
#
class @Maslosoft.Binder.Tooltip extends @Maslosoft.Binder.Base

	update: (element, valueAccessor) =>
		title = @getValue(valueAccessor)
		$(element).attr "title", title
		$(element).attr "data-original-title", title
		$(element).attr "rel", "tooltip"
		return

#
# Tree binding handler
#
class @Maslosoft.Binder.Tree extends @Maslosoft.Binder.Base

	update: (element, valueAccessor) =>
		
		return



class @Maslosoft.Binder.TreeGrid extends @Maslosoft.Binder.Base

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

			data = ko.observableArray []
			depths = ko.observableArray []
			depth = -1

			unwrapRecursive = (items) ->
				depth++
				for item in items
					hasChilds = item.children and item.children.length and item.children.length > 0
					extras = {
						depth: depth
						hasChilds: hasChilds
					}
					item._treeGrid = ko.tracker.factory extras
					data.push item
					depths.push depth
					if hasChilds
						unwrapRecursive item.children
						depth--

#			log unwrappedValue['data']
			if unwrappedValue['data']['children']
#				log('model init')
				unwrapRecursive unwrappedValue['data']['children']
			else
#				log('array init')
				unwrapRecursive unwrappedValue['data']
			
			if bindingContext
				bindingContext.tree = unwrappedValue['data']
				bindingContext.data = data
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

		if activeClass
			activeClassHandler = (e) ->
				# Remove from all instances of `tr` tu support multiple
				# classes separated with space
				table.find('tr').removeClass activeClass
				jQuery(e.currentTarget).addClass activeClass
				return true
			table.on 'click', 'tr', activeClassHandler

			dispose = (toDispose) ->
				jQuery(toDispose).off "click", 'tr', activeClassHandler

			ko.utils.domNodeDisposal.addDisposeCallback element, dispose

		widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView element, valueAccessor
		ko.bindingHandlers['template']['init'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
		return { controlsDescendantBindings: true }

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView element, valueAccessor, 'update'

		return ko.bindingHandlers['template']['update'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);



#
# This is to create "nodes" cell, this is meant to be used with TreeGrid
# binding handler
#
#
#
class @Maslosoft.Binder.TreeGridNode extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		ko.utils.toggleDomNodeCssClass(element, 'tree-grid-drag-handle', true);

		#
		# Defer icon creation, as other bindings must be evaluated first,
		# like html, text, etc.
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
		depth = extras.depth
		expanders = []
		expanders.push "<div class='collapsed' style='display:none;transform: rotate(-90deg);'>&#128899;</div>"
		expanders.push "<div class='expanded' style='transform: rotate(-45deg);'>&#128899;</div>"
		html.push "<a class='expander' style='cursor:pointer;text-decoration:none;width:1em;margin-left:#{depth}em;display:inline-block;'>#{expanders.join('')}</a>"
		depth = extras.depth + 1
		html.push "<i class='no-expander' style='margin-left:#{depth}em;display:inline-block;'></i>"
		html.push "<img src='#{nodeIcon}' style='width: 1em;height:1em;margin-top: -.3em;display: inline-block;'/>"
		element.innerHTML = html.join('') + element.innerHTML



#
#
# Validation binding handler
#
# @see ValidationManager
#
class @Maslosoft.Binder.Validator extends @Maslosoft.Binder.Base

	# Counter for id generator
	# @static
	idCounter = 0

	constructor: (options) ->
		super new Maslosoft.Binder.ValidatorOptions()

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
		classField = @options.classField

		pm = new PluginsManager element, classField

		validators = pm.from configuration


#   TODO Maybe below code should be used to check if class is validator compatible
#		proto = config[classField].prototype
#
#		if typeof(proto.isValid) isnt 'function' or typeof(proto.getErrors) isnt 'function' or typeof(proto.reset) isnt 'function'
#			if typeof(config[classField].prototype.constructor) is 'function'
#				name = config[classField].prototype.constructor.name
#			else
#				name = config[classField].toString()
#
#			error "Parameter `#{classField}` (of type #{name}) must be validator compatible class, binding defined on element:", element
#			continue


		manager = new ValidationManager(validators, @options)
		manager.init element

		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Binder-Validator-#{idCounter++}"

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

		# This is to allow interaction with tools which could modify content,
		# also to work with drag and drop
		ko.utils.registerEventHandler document, "mouseup", handler


	update: (element, valueAccessor, allBindings) =>
		# NOTE: Will not trigger on value change, as it is not directly observing value.
		# Will trigger only on init

#
# Video PLaylist binding handler
#
class @Maslosoft.Binder.VideoPlaylist extends @Maslosoft.Binder.Video
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
class @Maslosoft.Binder.VideoThumb extends @Maslosoft.Binder.Video

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		
	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		url = @getValue(valueAccessor)

		@setThumb url, element

				

		

class @Maslosoft.Binder.Widget extends @Maslosoft.Binder.Base
	
	init: (element, valueAccessor, allBindings, context) =>
		
		className = @getValue valueAccessor

		ref = allBindings.get 'ref'

		# Ref is string, try to create new widget and set ref
		if typeof(ref) is 'string' or not ref

			if typeof(className) isnt 'function' then return

			if typeof(className.constructor) isnt 'function' then return

			try
				widget = new className
			catch Error
				return
			if ref
				setRefByName ref, widget


			if ref
				ref = widget
		else
#			console.log 'By ref...'
#			console.log ref, typeof(ref)
			if typeof(ref) is 'object'
#				console.log 'Assign ref...'
				widget = ref

		params = allBindings.get 'params'
		
		if params
			for name, value of params
				widget[name] = value

		if typeof(widget.init) is 'function'
			widget.init(element)
		
		if typeof(widget.dispose) is 'function'
			ko.utils.domNodeDisposal.addDisposeCallback element, widget.dispose
		
	update: (element, valueAccessor) =>

class @Maslosoft.Binder.WidgetAction extends @Maslosoft.Binder.WidgetUrl

	update: (element, valueAccessor, allBindings) =>

		data = @getData(element, valueAccessor, allBindings, 'action')
		href = @createUrl(data.id, data.action, data.params, '?')

		element.setAttribute('href', href)
		
		@setRel element


class @Maslosoft.Binder.WidgetActivity extends @Maslosoft.Binder.WidgetUrl

	update: (element, valueAccessor, allBindings) =>
		
		data = @getData(element, valueAccessor, allBindings, 'activity')
		href = @createUrl(data.id, data.activity, data.params, '#')

		element.setAttribute('href', href)

		@setRel element
			


class PluginsManager

	classField: '_class'

	element: null

	#
	#
	# @var object[]
	#
	plugins: null

	constructor: (@element = null, @classField = '_class') ->
		@plugins = new Array

	#
	# Create configured instances out of configuration
	# containing _class and optional params
	#
	# Example configuration for one plugin:
	# ```
	# {
	# 	_class: Maslosoft.BinderDev.RegExpValidator,
	# 	pattern: '^[a-z]+$',
	# 	allowEmpty: false
	# }
	# ```
	#
	# Example configuration for many plugins:
	# ```
	# [
	# 	{
	# 		_class: Maslosoft.BinderDev.EmailValidator,
	# 		label: 'E-mail'
	# 	},
	# 	{
	# 		_class: Maslosoft.BinderDev.RequiredValidator,
	# 		label: 'E-mail'
	# 	}
	# ]
	# ```
	#
	# @param object
	# @return object[]
	#
	from: (configuration) ->

		element = @element
		classField = @classField
		@plugins = new Array

		if ko.isObservable configuration
			configuration = ko.unwrap configuration

		if not configuration
			return @plugins

		if configuration.constructor is Array
			cfg = configuration
		else
			cfg = [configuration]

#		console.log cfg
		for config in cfg

			if not config[classField]
				error "Parameter `#{classField}` must be defined for plugin on element:", element
				continue

			if typeof(config[classField]) isnt 'function'
				error "Parameter `#{classField}` must be plugin compatible class, binding defined on element:", element
				continue

			# Store class name first, as it needs to be removed
			className = config[classField]

			# Remove class key, to not interrupt plugin configuration
			delete(config[classField])

			# Instantiate plugin
			plugin = new className
			for index, value of config
				plugin[index] = null
				plugin[index] = value

			@plugins.push plugin

			return @plugins

	getElementValue: (element, value) =>

		for plugin in @plugins
			if typeof(plugin.getElementValue) is 'function'
				value = plugin.getElementValue element, value
		return value

	getModelValue: (element, value) =>

		for plugin in @plugins
			if typeof(plugin.getModelValue) is 'function'
				value = plugin.getModelValue element, value
		return value
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
	# @param validators Maslosoft.Binder.BaseValidator[]
	# @param options Maslosoft.Binder.ValidatorOptions
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
	# @param validator Maslosoft.Binder.BaseValidator
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
	# @param validator Maslosoft.Binder.BaseValidator
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

if not @Maslosoft.Binder.Widgets.TreeGrid
	@Maslosoft.Binder.Widgets.TreeGrid = {}


class Maslosoft.Binder.Widgets.TreeGrid.Dnd

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView
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
	# @var Maslosoft.Binder.Widgets.TreeGrid.DropIndicator
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
				try
					if @grid.element
						@grid.element.draggable("destroy")
						@grid.element.droppable("destroy")
				catch e
					console.log e.message

			@grid.element.on 'mousemove', '> tr', @move

		if not indicator
			indicator = new Maslosoft.Binder.Widgets.TreeGrid.DropIndicator @grid

		defer = () =>
			draggableOptions = {
				handle: '.tree-grid-drag-handle'
				cancel: '.expander, input, *[contenteditable], .no-drag'
				revert: false
				cursor: 'pointer'
				cursorAt: { top: 5, left: 5 }
				start: @dragStart
				drag: @drag
				stop: @stop
				helper: @dragHelper
			}
			droppableOptions = {
				tolerance: "pointer"
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
	stop: (e, ui) =>
		if not didDrop
			@drop e, ui

	#
	# Drop in a normal manner, see also `stop` for edge case
	#
	drop: (e, ui) =>
		didDrop = true

		if not dragged
			return @clear()
		if not draggedOver
			return @clear()
		if not draggedOver.get(0)
			return @clear()
		current = ko.dataFor dragged
		over = ko.dataFor draggedOver.get(0)

		if not @grid.canDrop dragged, draggedOver, hitMode
			return @clear()

		@grid.freeze()

		overParent = @grid.getParent over
		root = @grid.getRoot()

		# console.log "Drop #{current.title} over #{over.title}"
		# console.log arguments
#		log "CURR " + current.title
#		log "OVER " + over.title
#		log "PRNT " + overParent.title
#		log "HITM " + hitMode

		if overParent.children
			# Model initialized
			parentChilds = overParent.children
		else
			# Array initialized
			parentChilds = overParent

		dropDelay = () =>

			@grid.remove current

			if hitMode is 'over'
				# Most obvious case, when dragged node is directly over
				# dropped node, insert current node as it's last child
				over.children.push current

			if hitMode is 'before'
				# Insert node before current node, this is case when
				# insert mark is before dragged over node
				index = parentChilds.indexOf over
				parentChilds.splice index, 0, current

			if hitMode is 'after'

				# When node has children, then add just at beginning
				# to match visual position of dragged node
				if over.children.length
					parentChilds.splice 0, 0, current
				else
					# When not having children, it means that node is
					# last on the level so insert as a last node
					parentChilds.push current

			# Special case for last item. This allow adding node to top
			# level on the end of tree. Without this, it would be
			# impossible to move node to the end if last node is not top node.
			#
			# TODO for some reason view does not update on push
			#
			if hitMode is 'last'
#				log "Delayed Drop on end of table..."
				if root.children
					root.children.push current
				else
					#
					#
					# TODO Neither push or splice at end works!
					# It *does* add to view model but does not update UI!
					# However splice at beginning works properly!!!111
					#
					#

#					root.splice root.length, 0, current
					root.push current

			@clear()

		# Delay a bit to reduce flickering
		# See also TreeGridView.thaw() - this value should be lower than that in thaw
		dropDelay()
#		setTimeout dropDelay, 50

	#
	# Handle over state to get element to be about to be dropped
	# This is bound to dropable `over`
	#
	over: (e) =>
		# Don't stop propagation, just detect row
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
			indicator.precise.over dragged, draggedOver, hitMode, indicator

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

			if hitMode is 'after'
				# Last elem and after - switch to last hitmode
				if @grid.isLast(ko.dataFor(draggedOver.get(0)))
					hitMode = 'last'

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
		@grid.thaw()
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




class Maslosoft.Binder.Widgets.TreeGrid.DropIndicator

	#
	# Precise indicator holder
	# @var Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator
	#
	@precise: null

	#
	# Indicator element instance boud to draggable
	# @var jQuery element
	#
	@element: null

	constructor: (@grid) ->

		@precise = new Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator @grid

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

class Maslosoft.Binder.Widgets.TreeGrid.Events

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	constructor: (@grid, context) ->
	
		if not @grid.config.on
			return

class Maslosoft.Binder.Widgets.TreeGrid.Expanders

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView
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
			hasChildren = data.children && data.children.length
			if hasChildren
				item.find('.no-expander').hide()
				item.find('.expander').show()
			else
				item.find('.expander').hide()
				item.find('.no-expander').show()
#			item.find('.debug').html data.children.length
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

class Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView
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
	over: (dragged, draggedOver, hitMode = 'over', accepter) ->

		@accept()
		accepter.accept()

		if hitMode is 'over'
			@precise false
		else
			@precise true

		if @grid.canDrop dragged, draggedOver, hitMode
			@accept()
			accepter.accept()
		else
			@deny()
			accepter.deny()

		node = draggedOver.find('.tree-grid-drag-handle')

		widthOffset = 0
		midFactor = 1.5

		offset = node.offset()
		mid = indicator.outerHeight(true) / midFactor
		
		if hitMode is 'over'
			nodeMid = node.outerHeight(true) / midFactor
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
		<div class="tree-grid-insert-indicator" style="display:none;position:absolute;z-index: 10000;color:green;line-height: 1em;">
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

class Maslosoft.Binder.Widgets.TreeGrid.TreeGridView

	#
	# Plugins for tree grid
	#
	# NOTE: Order of plugins *might* be important, especially for built-in plugins
	#
	# @var Object[]
	#
	@plugins = [
		Maslosoft.Binder.Widgets.TreeGrid.Expanders
		Maslosoft.Binder.Widgets.TreeGrid.Dnd
		Maslosoft.Binder.Widgets.TreeGrid.Events
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
			model = @getRoot()
			callback null, model
			if model.children and model.children.length
				for child in model.children
					callback model, child
					@visitRecursive callback, child
			# Array node
			if model.length
				for child in model
					callback model, child
					@visitRecursive callback, child
		else
			if model.children and model.children.length
				for child in model.children
					callback model, child
					@visitRecursive callback, child
			# Array node
			if model.length
				for child in model
					callback model, child
					@visitRecursive callback, child

	getParent: (model) =>
		found = null

		one = (parent, data) ->
			if data is model
				found = parent
		# Don't set model here to start from root
		@visitRecursive one
		return found

	getRoot: () =>
		ctx = ko.contextFor @element.get(0)
		return ctx.tree

	getContext: () =>
		return ko.contextFor @element.get(0)

	#
	# Check if parent have child
	#
	#
	have: (parent, child) =>

		found = false

		one = (parent, data) ->
			if data is child
				found = true

		# Start from parent here
		@visitRecursive one, parent
		return found

	#
	# Check if it is last on list of table rows
	#
	#
	isLast: (model) =>
		lastRow = @element.find('> tr:last()')
		last = ko.dataFor lastRow.get(0)
		if model is last
			return true
		return false

	#
	# Check if can actually drop on draggedOver
	#
	canDrop: (dragged, draggedOver, hitMode) =>
		current = ko.dataFor dragged
		over = ko.dataFor draggedOver.get(0)

#		log current.title
#		log over.title

		# Allow adding to the end of table
		if hitMode is 'last'
			return true

		# Allow adding to the end of list
		if hitMode is 'after'
			return true

		# Forbid dropping on itself
		if current is over
			return false;

		# Forbid dropping on children of current node
		if @have current, over
			return false

		return true

	remove: (model) =>
		one = (parent, data) ->
			if parent
				# Model initialized
				if parent.children
					parent.children.remove model
				# Array initialized
				else
					parent.remove model

		# Don't set model here to start from root
		@visitRecursive one

	expandAll: () ->

	collapseAll: () ->


	cellsStyles = []

	#
	# Set widths of table cells to strict values.
	# This prevents flickering table when moving nodes.
	#
	#
	freeze: () =>

		# Reset stored width values
		cellsStyles = []
		cells = @element.find('> tr:first() td')

		for cell in cells
#			log cell
			cellsStyles.push cell.style
			$cell = jQuery cell
#			log $cell.width()
			$cell.css 'width', $cell.width() + 'px'


	#
	# Set widths of table cells back to original style, set by freeze()
	#
	#
	thaw: () =>
		defer = () =>
			cells = @element.find('> tr:first-child() td')

			for cell, index in cells
				cell.style = cellsStyles[index]
		# Unfreezing takes some time...
		# This needs to be delayed a bit or flicker will still occur
		setTimeout defer, 150
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

class @Maslosoft.Binder.Model

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

# For backward compatibility
@Maslosoft.Ko.Balin = @Maslosoft.Binder

@Maslosoft.Ko.escapeRegExp = escapeRegExp

@Maslosoft.Ko.escapeHtml = escapeHtml

@Maslosoft.Ko.equals = equals

@Maslosoft.Ko.stringToColour = stringToColour