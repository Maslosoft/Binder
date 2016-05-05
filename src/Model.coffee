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
			changed = true

		# Detect keys change
		before = Object.keys(target).length
		target[name] = value
		after = Object.keys(target).length
		if before isnt after
			changed = true
		
		# Notify change
		if changed
			ko.valueHasMutated(@parent, @field)
		return true

	deleteProperty: (target, name) ->
		delete target[name]
		# Notify change
		ko.valueHasMutated(@parent, @field)
		return true

initMap = new Map()

class @Maslosoft.Ko.Balin.Model

	constructor: (data = null) ->

		initialized = initMap.get @

		if not initialized
			initMap.set @, true
			# Reassign here is required - when using model with values from class prototype only
			for name, value of @

				@[name] = ko.tracker.factory(value)

				# Extra track of object properties.
				if @[name] and typeof(@[name]) is 'object'
					@[name] = new Proxy(@[name], new ModelProxyHandler(@, name))

		for name, value of data
			@[name] = value
		ko.track(@)
