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
