
class @Maslosoft.Ko.Balin.BaseValidator

	label: ''

	model: null

	messages: []

	rawMessages: []

	constructor: (config) ->
		# Dereference
		@messages = new Array
		@rawMessages = new Object
		for index, value of config
			@[index] = null
			@[index] = value

	getErrors: () ->
		return @messages

	addError: (errorMessage, params) ->
		rawMessage = errorMessage
		for name, value of params
			errorMessage = errorMessage.replace "{#{name}}", value
		if not @rawMessages[rawMessage]
			@messages.push errorMessage
			@rawMessages[rawMessage] = true
