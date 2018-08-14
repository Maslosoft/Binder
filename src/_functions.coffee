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

#
# Preload image of element
# @param element DomElement
#
preload = (element, src) ->
	image = new Image
	image.src = src
	image.onload = () ->
		image = null
		console.log 'loaded...'
		element.attr "src", src