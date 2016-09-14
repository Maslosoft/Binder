###
Date picker
###
class @Maslosoft.Ko.Balin.DatePicker extends @Maslosoft.Ko.Balin.Picker

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateOptions(options)
	
	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return value.data
		return value

	getOptions: (valueAccessor) ->
		options = {
			# Format of pickadate is not compatible of this of moment
			format: @options.displayFormat.toLowerCase()
			forceParse: false
			todayHighlight: true
			showOnFocus: false
		}
		config = @getValue(valueAccessor) or []
		# Only in long notation set options
		if config.data
			for name, value of config

				# Skip data
				if name is 'data'
					continue

				# Skip template
				if name is 'template'
					continue

				# Special treatment for display format
				if name is 'format'
					options.displayFormat = value
				
				options[name] = value
		return options

	updateModel: (element, valueAccessor, allBindings) =>
		modelValue = @getData valueAccessor
		elementValue = @getModelValue element.value
		console.log element.value, modelValue, elementValue
		if ko.isWriteableObservable(valueAccessor) or true
			# Update only if changed
			if modelValue isnt elementValue
				ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue)
				val = elementValue
				console.log 'should update model...'
		else
			console.log 'not writeabe'

	#
	# Get display value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getDisplayValue: (value) =>
		if @options.sourceFormat is 'unix'
			inputValue = moment.unix(value).format(@options.displayFormat)
		else
			inputValue = moment(value, @options.sourceFormat).format(@options.displayFormat)
		return inputValue

	#
	# Get model value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getModelValue: (value) =>
		if @options.sourceFormat is 'unix'
			modelValue = moment(value, @options.displayFormat).unix()
		else
			modelValue = moment(value, @options.displayFormat).format(@options.sourceFormat)
		return modelValue

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

		options = @getOptions(valueAccessor)

		element.value = @getDisplayValue(@getData(valueAccessor))
		
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
				console.log e.isTrigger
				console.log "Change and parsed #{element.value}", e
				console.log "#{parsedDate}"
				element.value = @getDisplayValue(Math.round(parsedDate.getTime() / 1000))
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

	update: (element, valueAccessor) =>
		ko.utils.setTextContent(element, valueAccessor())
		value = @getDisplayValue(@getData(valueAccessor))
		if element.value isnt value
			element.value = value