#
# Model class with automatically applied knockout bindings
#

# Stub to ignore fatals
if !window.Proxy
	console.warn 'Your browser does not support Proxy, will not work properly in some cases...'
	class window.Proxy

class ModelProxyHandler
	constructor: (@parent, @field) ->

	get: (target, name, receiver) ->

		return target[name]
	set: (target, name, value, receiver) ->
		before = Object.keys(target).length
		target[name] = value
		after = Object.keys(target).length
		if before isnt after
			# Notify change
			ko.valueHasMutated(@parent, @field)
		return true

	deleteProperty: (target, name) ->
		delete target[name]
		# Notify change
		ko.valueHasMutated(@parent, @field)
		return true

class @Maslosoft.Ko.Balin.Model

	constructor: (data = null) ->

		# Reassign here is required - when using model with values from class prototype only
		for name, value of @

			if data and typeof data[name] isnt 'undefined'
				@[name] = ko.tracker.factory(data[name])
			else
				@[name] = ko.tracker.factory(value)

			# Extra track of dynamic object properties
			if @[name] and typeof(@[name]) is 'object' and @[name].constructor isnt Array
				@[name] = new Proxy(@[name], new ModelProxyHandler(@, name))

		ko.track(@)
