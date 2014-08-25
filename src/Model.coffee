#
# Model class with automatically applied knockout bindings
#
class @Maslosoft.Ko.Balin.Model
	
	constructor: (data = null) ->
		for name, value of data
			if typeof @[name] is 'undefined' then continue
			@[name] = ko.tracker.factory(value)
		ko.track(@)