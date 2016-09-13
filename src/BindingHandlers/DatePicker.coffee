###
Date picker
###
class @Maslosoft.Ko.Balin.DatePicker extends @Maslosoft.Ko.Balin.Picker

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.DateOptions(options)

	updateModel: (element, valueAccessor) =>
		accessor = valueAccessor()
		modelValue = @getValue(valueAccessor)
		elementValue = element.value
		console.log elementValue
		if ko.isWriteableObservable(accessor) or true
			console.log 'is writeabe', accessor, valueAccessor
			# Update only if changed
			if modelValue isnt elementValue
				val = valueAccessor()
				val = elementValue
				console.log 'should update model...'
		else
			console.log 'not writeabe'

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

		value = @getValue(valueAccessor)
		inputValue = moment[@options.sourceFormat](value).format(@options.displayFormat)

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
		console.log pickerElement

		options = {
			# Format of pickadate is not compatible of this of moment
			format: @options.displayFormat.toLowerCase()
		}

		$inputDate = pickerElement.pickadate(options)
		picker = $inputDate.pickadate('picker')

		picker.on 'set', =>
			textInput.val picker.get('value')
			@updateModel element, valueAccessor
			return

		console.log picker

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
				@updateModel element, valueAccessor
			return

		events.keyup = (e) ->
			if e.which is 86 and e.ctrlKey
				events.change()
				console.log e.which
			return

			
		events.mouseup = events.change

		# Focus event of text input
		events.focus = () =>
			console.log 'Open picker'
			picker.open false
			return

		# Blur of text input
		events.blur = =>
			console.log 'Close picker'
			picker.close()
			@updateModel element, valueAccessor
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
		rawValue = @getValue(valueAccessor)
		value = moment[@options.sourceFormat](rawValue).format(@options.displayFormat)
		if element.value isnt value
			element.value = value