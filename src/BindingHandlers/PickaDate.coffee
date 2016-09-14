###
Date picker
NOTE: Not recommended, as Pick A Date is not maintanted
###
class @Maslosoft.Ko.Balin.PickaDate extends @Maslosoft.Ko.Balin.Picker

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateOptions(options)

	updateModel: (element, valueAccessor, allBindings) =>
		modelValue = @getValue valueAccessor
		elementValue = @getModelValue element.value
		
		if ko.isWriteableObservable(valueAccessor) or true
			# Update only if changed
			if modelValue isnt elementValue
				ko.expressionRewriting.writeValueToProperty(valueAccessor(), allBindings, 'datePicker', elementValue)
				val = elementValue
				
		else
			

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

		inputValue = @getDisplayValue(@getValue(valueAccessor))
		
		textInput = jQuery(element)
		textInput.val inputValue

		if @options.template
			template = @options.template
		else
			template = '''
			<div class="input-group-addon">
				<a class="picker-trigger-link" style="cursor: pointer;">
					<i class="glyphicon glyphicon-calendar"></i>
				</a>
			</div>
			'''
		pickerWrapper = jQuery(template)
		pickerWrapper.insertAfter textInput
		
		pickerElement = pickerWrapper.find('a.picker-trigger-link')
		

		options = {
			# Format of pickadate is not compatible of this of moment
			format: @options.displayFormat.toLowerCase()
			selectMonths: true
			selectYears: true
		}

		$inputDate = pickerElement.pickadate(options)
		picker = $inputDate.pickadate('picker')

		picker.on 'set', =>
			textInput.val picker.get('value')
			@updateModel element, valueAccessor, allBindingsAccessor
			return

		

		events = {}

		# On change or other events (paste etc.)
		events.change = () =>
			parsedDate = Date.parse(element.value)
			if parsedDate
				picker.set 'select', [
					parsedDate.getFullYear()
					parsedDate.getMonth()
					parsedDate.getDate()
				]
				@updateModel element, valueAccessor, allBindingsAccessor
			return

		events.keyup = (e) ->
			if e.which is 86 and e.ctrlKey
				events.change()
				
			return

			
		events.mouseup = events.change

		# Focus event of text input
		events.focus = () =>
			
			picker.open false
			return

		# Blur of text input
		events.blur = (e) =>
			# Don't hide picker when clicking picker itself
			if e.relatedTarget
				return
			
			picker.close()
			@updateModel element, valueAccessor, allBindingsAccessor
			return

		textInput.on events

		pickerElement.on 'click', (e) ->
			root = jQuery(picker.$root[0])
			# This seems to be only method
			# to discover if picker is really open
			isOpen = jQuery(root.children()[0]).height() > 0
			if isOpen
				picker.close()
			else
				picker.open(false)
			e.stopPropagation()
			e.preventDefault()
			return

		return

	update: (element, valueAccessor) =>
		ko.utils.setTextContent(element, valueAccessor())
		value = @getDisplayValue(@getValue(valueAccessor))
		if element.value isnt value
			element.value = value