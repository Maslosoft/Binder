
class @Maslosoft.Ko.Balin.Validator extends @Maslosoft.Ko.Balin.Base

	# Counter for id generator
	# @static
	idCounter = 0

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.ValidatorOptions()

	getElementValue: (element) ->
		# For inputs use value
		if element.tagName.toLowerCase() is 'input'
			return element.value

		# For textarea use value
		if element.tagName.toLowerCase() is 'textarea'
			return element.value

		# For rest use text value
		return element.textContent || element.innerText || ""

	# validate a.k.a ifs mess
	validate: (validator, element, value) =>
		parent = element.parentElement

		errors = parent.querySelector @options.errorMessages
		warnings = parent.querySelector @options.warningMessages
		messages = new Array
		validator.reset()
		isValid = false
		if validator.isValid(value)
			# Apply input error styles as needed
			if @options.inputError
				ko.utils.toggleDomNodeCssClass(element, @options.inputError, false);
			if @options.inputSuccess
				ko.utils.toggleDomNodeCssClass(element, @options.inputSuccess, true);

			# Apply parent styles as needed
			if parent
				if @options.parentError
					ko.utils.toggleDomNodeCssClass(parent, @options.parentError, false);
				if @options.parentSuccess
					ko.utils.toggleDomNodeCssClass(parent, @options.parentSuccess, true);

			# Reset error messages
			if errors
				errors.innerHTML = ''
			isValid = true
		else
			# Errors...
			messages = validator.getErrors()

			# Apply input error styles as needed
			if @options.inputError
				ko.utils.toggleDomNodeCssClass(element, @options.inputError, true);
			if @options.inputSuccess
				ko.utils.toggleDomNodeCssClass(element, @options.inputSuccess, false);

			# Apply parent styles as needed
			if parent
				if @options.parentError
					ko.utils.toggleDomNodeCssClass(parent, @options.parentError, true);
				if @options.parentSuccess
					ko.utils.toggleDomNodeCssClass(parent, @options.parentSuccess, false);

			# Show error messages
			if errors and messages
				errors.innerHTML = messages.join '<br />'
			isValid = false

		# Warnings, add only if no errors
		if typeof(validator.getWarnings) is 'function' and warnings
			messages = validator.getWarnings()

			# When valid, remove success and add warnings if applicable
			if isValid
				if messages.length
					# Apply input warning styles as needed
					if @options.inputWarning
						ko.utils.toggleDomNodeCssClass(element, @options.inputWarning, true);
					if @options.inputSuccess
						ko.utils.toggleDomNodeCssClass(element, @options.inputSuccess, false);

					# Apply parent styles as needed
					if parent
						if @options.parentWarning
							ko.utils.toggleDomNodeCssClass(parent, @options.parentWarning, true);
						if @options.parentSuccess
							ko.utils.toggleDomNodeCssClass(parent, @options.parentSuccess, false);

					# Show warnings
					if warnings and messages
						warnings.innerHTML = messages.join '<br />'
				else
					# Reset warnings
					# Remove input warning styles as needed
					if @options.inputWarning
						ko.utils.toggleDomNodeCssClass(element, @options.inputWarning, false);
					if @options.inputSuccess
						ko.utils.toggleDomNodeCssClass(element, @options.inputSuccess, true);

					# Remove parent styles as needed
					if parent
						if @options.parentWarning
							ko.utils.toggleDomNodeCssClass(parent, @options.parentWarning, false);
						if @options.parentSuccess
							ko.utils.toggleDomNodeCssClass(parent, @options.parentSuccess, true);
					if warnings
						warnings.innerHTML = ''
			# When not valid, remove warnings to not obstruct error messages
			else
				# Not valid, reset warnings
				# Remove input warning styles as needed
				if @options.inputWarning
					ko.utils.toggleDomNodeCssClass(element, @options.inputWarning, false);

				# Remove parent styles as needed
				if parent
					if @options.parentWarning
						ko.utils.toggleDomNodeCssClass(parent, @options.parentWarning, false);
				if warnings
					warnings.innerHTML = ''
		return isValid

		


	init: (element, valueAccessor, allBindingsAccessor, context) =>
		configuration = @getValue(valueAccessor)
		validators = new Array
		classField = @options.classField
		if configuration.constructor is Array
			cfg = configuration
		else
			cfg = [configuration]

		for config in cfg
#			console.log config

			if not config[classField]
				error "Parameter `#{classField}` must be defined for validator on element:", element
				continue

			if typeof(config[classField]) isnt 'function'
				error "Parameter `#{classField}` must be validator compatible class, binding defined on element:", element
				continue
			
			proto = config[classField].prototype

			if typeof(proto.isValid) isnt 'function' or typeof(proto.getErrors) isnt 'function' or typeof(proto.reset) isnt 'function'
				if typeof(config[classField].prototype.constructor) is 'function'
					name = config[classField].prototype.constructor.name
				else
					name = config[classField].toString()

				error "Parameter `#{classField}` (of type #{name}) must be validator compatible class, binding defined on element:", element
				continue

			# Store class name first
			className = config[classField]

			# Remove class key
			delete(config[classField])

			# Instantiate validator
			validators.push new className(config)

		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Balin-Validator-#{idCounter++}"

		# Get initial value to evaluate only if changed
		initialVal = @getElementValue(element)

		handler = (e) =>
			if e.type is 'update'
				console.log 'update..'
			# On some situations element might be null (sorting), ignore this case
			if not element then return

			# This is required in some scenarios, specifically when sorting htmlValue elements
			element = document.getElementById(element.id)
			if not element then return

			elementValue = @getElementValue(element)
			if e.type is 'update'
				console.log elementValue
			# Update only if changed
			if initialVal isnt elementValue
				initialVal = elementValue
				for validator in validators
					if not @validate(validator, element, elementValue)
						return

		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup, input", handler

		# This is to allow interation with tools which could modify content, also to work with drag and drop
		ko.utils.registerEventHandler document, "mouseup", handler


	update: (element, valueAccessor, allBindings) =>
		# NOTE: Will not trigger on value change, as it is not directly observing value.
		# Will trigger only on init
