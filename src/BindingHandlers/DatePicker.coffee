###
Date picker
###
class @Maslosoft.Binder.DatePicker extends @Maslosoft.Binder.Picker

	constructor: (options) ->
		super new Maslosoft.Binder.DateOptions(options)
	
	getData: (valueAccessor) ->
		if not valueAccessor
			return ''
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
		accessor = valueAccessor()
		# Update only if changed
		if modelValue isnt elementValue
			if accessor and accessor.data
				
				ko.expressionRewriting.writeValueToProperty(ko.unwrap(valueAccessor()).data, allBindings, 'datePicker.data', elementValue)
			else
				ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue)
			

	#
	# Get display value from model value according to formatting options
	# @param string|int value
	# @return string|int
	#
	getDisplayValue: (value, options) =>
		#console.log value
		if not value
			return ''
		if value and value.length is 0
			return ''
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
		if not value
			return null
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

		value = @getDisplayValue(@getData(valueAccessor), options)
		#console.log value
		if not value
			element.value = ''
		else
			element.value = value
		
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
		addon.insertBefore input
		
		trigger = addon.find('a.picker-trigger-link')

		input.datepicker(options)

		# Trigger only when value has changed, but do not update
		# picker, ie someone is typing-in date
		onChangeValue = (e) =>
			value = input.datepicker('getDate')
			#console.log value, element.value
			if value
				@updateModel element, valueAccessor, allBindingsAccessor
				#console.log 'Changing model... onChangeValue'
			return false

		# When date is changed and change is confirmed
		onChange = (e) =>
			parsedDate = Date.parse(element.value)
			if parsedDate and not e.isTrigger
				element.value = @getDisplayValue(Math.round(parsedDate.getTime() / 1000), options)
				@updateModel element, valueAccessor, allBindingsAccessor
				input.datepicker 'update'
				return true
			return false

		# Don't trigger picker change date, as date need to be parsed by datejs
		input.on 'changeDate', (e) =>
			onChangeValue(e)
			return true

		# Here is actual date change handling
		input.on 'change', onChange

		input.on 'blur', onChange

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
		val = valueAccessor()
		if val and val.data
			
			ko.utils.setTextContent(element, val.data)
		else
			ko.utils.setTextContent(element, val)
		options = @getOptions allBindingsAccessor
		value = @getDisplayValue(@getData(valueAccessor), options)
		
		if element.value isnt value
			element.value = value