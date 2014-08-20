#
# Base class for Maslosoft binding handlers
#
class @Maslosoft.Ko.Balin.Base

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
	getValue: (valueAccessor) =>
		value = ko.unwrap(valueAccessor())
		if @options.valueField
			if @options.ec5
				value = value[@options.valueField]
			else
				value = value[@options.valueField]()
		return value
		
	#
	# Set value back to model
	#
	setValue: (valueAccessor, value) ->
		# TODO