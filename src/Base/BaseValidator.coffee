
class @Maslosoft.Ko.Balin.BaseValidator

	label: ''

	model: null

	messages: []

	rawMessages: []

	warningMessages: []

	rawWarningMessages: []

	constructor: (config) ->
		@reset()
		for index, value of config
			@[index] = null
			@[index] = value

	reset: () ->
		# Dereference/reset
		@messages = new Array
		@rawMessages = new Object
		@warningMessages = new Array
		@rawWarningMessages = new Object

	isValid:() ->
		throw new Error('Validator must implement `isValid` method')

	getErrors: () ->
		return @messages

	getWarnings: () ->
		return @warningMessages

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

	#
	# Add warning message with optional substitution params.
	#
	# Simple example:
	# ```coffee
	# @addWarning('My error message')
	#	```
	#
	# Automatic substitution with label example:
	# ```coffee
	# @addWarning('Attribute {attribute} message')
	#	```
	#
	# Will add warning message: 'Attribute My attribute message'
	#
	# Substitution with params example:
	# ```coffee
	# @addWarning('Attribute {name} message', {name: 'John'})
	#	```
	#
	# Will add warning message: 'Attribute John message'
	#
	addWarning: (warningMessage, params) ->

		# Raw is required for uniquness, see method end
		rawMessage = warningMessage

		# Apply atribute label first
		warningMessage = warningMessage.replace "{attribute}", @label

		# Apply from current validator
		for name, value of @
			warningMessage = warningMessage.replace "{#{name}}", value

		# Apply from params
		for name, value of params
			warningMessage = warningMessage.replace "{#{name}}", value

		# Finally try to apply from model
		for name, value of @model
			warningMessage = warningMessage.replace "{#{name}}", value


		# Ensure uniquness
		if not @rawWarningMessages[rawMessage]
			@warningMessages.push warningMessage
			@rawWarningMessages[rawMessage] = true
