###
Date picker
###
class @Maslosoft.Binder.DatePicker extends @Maslosoft.Binder.Picker

	constructor: (options) ->
		super new Maslosoft.Binder.DateOptions(options)
	
	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return value.data
		return value

	getOptions: (allBindingsAccessor) ->
		options = {
			lang: @options.lang
			sourceFormat: @options.sourceFormat
			displayFormat: @options.displayFormat
			# Format of pickadate is not compatible of this of moment
			format: @options.displayFormat.toLowerCase()
			forceParse: false
			todayHighlight: true
			showOnFocus: false
		}
		config = allBindingsAccessor.get('dateOptions') or []
		
		
		# Only in long notation set options
		if config
			for name, value of config

				# Skip data
				if name is 'data'
					continue

				# Skip template
				if name is 'template'
					continue

				# Special treatment for display format
				if name is 'format'
					options.displayFormat = value.toUpperCase()
				
				options[name] = value
		return options

	updateModel: (element, valueAccessor, allBindings) =>
		options = @getOptions allBindings
		modelValue = @getData valueAccessor
		elementValue = @getModelValue element.value, options
		
		# Update only if changed
		if modelValue isnt elementValue
			if valueAccessor().data
				
				ko.expressionRewriting.writeValueToProperty(ko.unwrap(valueAccessor()).data, allBindings, 'datePicker.data', elementValue)
			else
				ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue)
			

	#
	# Get display value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getDisplayValue: (value, options) =>
		if options.sourceFormat is 'unix'
			inputValue = moment.unix(value).format(options.displayFormat)
		else
			inputValue = moment(value, options.sourceFormat).format(options.displayFormat)
		return inputValue

	#
	# Get model value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getModelValue: (value, options) =>
		if options.sourceFormat is 'unix'
			modelValue = moment(value, options.displayFormat).unix()
		else
			modelValue = moment(value, options.displayFormat).format(options.sourceFormat)
		return modelValue

	#
	# Initialize datepicker
	#
	#
	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

		options = @getOptions allBindingsAccessor

		element.value = @getDisplayValue(@getData(valueAccessor), options)
		
		input = jQuery(element)

		if options.template
			template = options.template
		else
			template = '''
			<div class="input-group-addon">
				<a class="picker-trigger-link" style="cursor: pointer;">
					<i class="glyphicon glyphicon-calendar"></i>
				</a>
			</div>
			'''
		addon = jQuery(template)
		addon.insertAfter input
		
		trigger = addon.find('a.picker-trigger-link')

		input.datepicker(options)

		# Don't trigger picker change date, as date need to be parsed by datejs
		input.on 'changeDate', (e) =>
			return false

		# Here is actual date change handling
		input.on 'change', (e) =>
			parsedDate = Date.parse(element.value)
			if parsedDate and not e.isTrigger
				element.value = @getDisplayValue(Math.round(parsedDate.getTime() / 1000), options)
				@updateModel element, valueAccessor, allBindingsAccessor
				input.datepicker 'update'
				return true
			return false

		# Handle opened state
		isOpen = false
		input.on 'show', (e) =>
			isOpen = true

		input.on 'hide', (e) =>
			isOpen = false

		# Need mousedown or will no hide on second click
		trigger.on 'mousedown', (e) ->
			if isOpen
				input.datepicker('hide')
			else
				input.datepicker('show')
			e.stopPropagation()
			e.preventDefault()
			return
		return

	#
	# Update input after model change
	#
	#
	update: (element, valueAccessor, allBindingsAccessor) =>
		if valueAccessor().data
			
			ko.utils.setTextContent(element, valueAccessor().data)
		else
			ko.utils.setTextContent(element, valueAccessor())
		options = @getOptions allBindingsAccessor
		value = @getDisplayValue(@getData(valueAccessor), options)
		
		if element.value isnt value
			element.value = value