
#
# Validation manager.
#
# This class applies proper styles and messages to configured DOM elements.
#
#
#
class ValidationManager

	#
	# Input element
	# @var DomElement
	#
	element: null

	#
	# Parent of input element
	# @var DomElement
	#
	parent: null

	#
	# Errors container element
	# @var DomElement
	#
	errors: null

	#
	# Warnings container element
	# @var DomElement
	#
	warnings: null

	# Private
	toggle = ko.utils.toggleDomNodeCssClass

	#
	# Initialize validation manager
	#
	# @param validators Maslosoft.Ko.Balin.BaseValidator[]
	# @param options Maslosoft.Ko.Balin.ValidatorOptions
	#
	#
	constructor: (@validators, @options) ->

	#
	# Trigger validation and warnigs on all items
	#
	# @param element DomElement
	# @param value mixed
	#
	# @return bool
	#
	validate: (element, value) =>

		# Set current element here, as it could be changed in some case, ie sorting
		@setElement element

		# Trigger all validators
		for validator in @validators
			if not @validateOne validator, value
				return false

		# Loop again for warnings, or they would be overriden
		for validator in @validators
			# Ensure that validator handle warnings
			if typeof(validator.getWarnings) is 'function'
				@adviseOne validator, value

		return true

	#
	# Set working element. No need to call it directly, it is called by validate method.
	#
	# @param element DomElement
	#
	# @return ValidationManager
	#
	setElement: (@element) =>
		@parent = jQuery(@element).parents('.form-group')[0]

		@errors = @parent.querySelector @options.errorMessages
		@warnings = @parent.querySelector @options.warningMessages
		return @

	#
	# Apply validation of one validator
	#
	# @param validator Maslosoft.Ko.Balin.BaseValidator
	# @param element DomElement
	# @param value mixed
	#
	# @return bool
	#
	validateOne: (validator, value) =>
		# Reassign variables for local scope
		element = @element
		parent = @parent
		errors = @errors
		warnings = @warnings

		messages = new Array
		validator.reset()
		isValid = false
		if validator.isValid(value)
			# Apply input error styles as needed
			if @options.inputError
				toggle(element, @options.inputError, false);
			if @options.inputSuccess
				toggle(element, @options.inputSuccess, true);

			# Apply parent styles as needed
			if parent
				if @options.parentError
					toggle(parent, @options.parentError, false);
				if @options.parentSuccess
					toggle(parent, @options.parentSuccess, true);

			# Reset error messages
			if errors
				errors.innerHTML = ''
			isValid = true
		else
			# Errors...
			messages = validator.getErrors()

			# Apply input error styles as needed
			if @options.inputError
				toggle(element, @options.inputError, true);
			if @options.inputSuccess
				toggle(element, @options.inputSuccess, false);

			# Apply parent styles as needed
			if parent
				if @options.parentError
					toggle(parent, @options.parentError, true);
				if @options.parentSuccess
					toggle(parent, @options.parentSuccess, false);

			# Show error messages
			if errors and messages
				errors.innerHTML = messages.join '<br />'
			isValid = false

		#
		#
		# Warnings part - this is required here to reset warnings
		#
		#

		# Reset warnings regardless of validation result
		# Remove input warning styles as needed
		if @options.inputWarning
			toggle(element, @options.inputWarning, false);

		# Remove parent styles as needed
		if parent
			if @options.parentWarning
				toggle(parent, @options.parentWarning, false);
		if warnings
			warnings.innerHTML = ''

		return isValid

	#
	# Apply warnings of one input
	#
	# @param validator Maslosoft.Ko.Balin.BaseValidator
	# @param element DomElement
	# @param value mixed
	#
	# @return ValidationManager
	#
	adviseOne: (validator, value) =>
		# Reassign variables for local scope
		element = @element
		parent = @parent
		errors = @errors
		warnings = @warnings

		messages = validator.getWarnings()
		# If has warnings remove success and add warnings to any applicable element
		if messages.length

			# Apply input warning styles as needed
			if @options.inputWarning
				toggle(element, @options.inputWarning, true);
			if @options.inputSuccess
				toggle(element, @options.inputSuccess, false);

			# Apply parent styles as needed
			if parent
				if @options.parentWarning
					toggle(parent, @options.parentWarning, true);
				if @options.parentSuccess
					toggle(parent, @options.parentSuccess, false);

			# Show warnings
			if warnings
				warnings.innerHTML = messages.join '<br />'

		return @
