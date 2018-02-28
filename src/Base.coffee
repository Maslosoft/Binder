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
