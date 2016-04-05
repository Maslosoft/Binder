#
# Model class with automatically applied knockout bindings
#
class Handler
	constructor: (@parent, @field) ->

	get: (target, name, receiver) ->

		return target[name]
	set: (target, name, value, receiver) ->
		# console.log Object.keys(target[name]).length
		before = Object.keys(target).length
		target[name] = value
		after = Object.keys(target).length
		if before isnt after
			# ko.track receiver
			@parent[@field] = ko.tracker.factory(@parent[@field])
			# console.log receiver
			# console.log "New key #{name}"
		return true

	deleteProperty: (target, name) ->
		log target
		log "Delete property #{name}"
		delete target[name]
		log target
		@parent[@field] = ko.tracker.factory(@parent[@field])
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
			if typeof(@[name]) is 'object' and @[name].constructor isnt Array
				log "Proxy #{name}"
				@[name] = new Proxy(@[name], new Handler(@, name))

		ko.track(@)
