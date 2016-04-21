
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

	isValid:() ->
		throw new Error('Validator must implement `isValid` method')

	getErrors: () ->
		return @messages

	#
	# Add error message with optional substitution params.
	#
	# Simple example:
	# ```coffee
	# @addError('My error message')
	#	```
	#
	# Automatic substitution with label example:
	# ```coffee
	# @addError('Attribute {attribute} message')
	#	```
	#
	# Will add error message: 'Attribute My attribute message'
	#
	# Substitution with params example:
	# ```coffee
	# @addError('Attribute {name} message', {name: 'John'})
	#	```
	#
	# Will add error message: 'Attribute John message'
	#
	addError: (errorMessage, params) ->

		# Raw is required for uniquness, see method end
		rawMessage = errorMessage

		# Apply atribute label first
		errorMessage = errorMessage.replace "{attribute}", @label

		# Apply from current validator
		for name, value of @
			errorMessage = errorMessage.replace "{#{name}}", value

		# Apply from params
		for name, value of params
			errorMessage = errorMessage.replace "{#{name}}", value

		# Finally try to apply from model
		for name, value of @model
			errorMessage = errorMessage.replace "{#{name}}", value


		# Ensure uniquness
		if not @rawMessages[rawMessage]
			@messages.push errorMessage
			@rawMessages[rawMessage] = true
