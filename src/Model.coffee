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
