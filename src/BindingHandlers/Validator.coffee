
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

	validate: (validator, element, value) =>
		if validator.isValid(value)
			ko.utils.toggleDomNodeCssClass(element, @options.inputError, false);
			ko.utils.toggleDomNodeCssClass(element, @options.inputSuccess, true);
		else
			ko.utils.toggleDomNodeCssClass(element, @options.inputError, true);
			ko.utils.toggleDomNodeCssClass(element, @options.inputSuccess, false);


	init: (element, valueAccessor, allBindingsAccessor, context) =>
		config = @getValue(valueAccessor)

		# Store class name first
		className = config.class

		# Remove class key
		delete(config.class)

		# Instantiate validator
		validator = new className(config)

		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Balin-Validator-#{idCounter++}"

		# Get initial value to evaluate only if changed
		initialVal = @getElementValue(element)

		handler = (e) =>

			# On some situations element might be null (sorting), ignore this case
			if not element then return

			# This is required in some scenarios, specifically when sorting htmlValue elements
			element = document.getElementById(element.id)
			if not element then return
			
			elementValue = @getElementValue(element)
			# Update only if changed
			if initialVal isnt elementValue
				initialVal = elementValue
				@validate(validator, element, elementValue)

		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup, input", handler

		# This is to allow interation with tools which could modify content, also to work with drag and drop
		ko.utils.registerEventHandler document, "mouseup", handler


	update: (element, valueAccessor, allBindings) =>