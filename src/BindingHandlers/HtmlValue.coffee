#
# Html value binding
# WARNING This MUST have parent context, or will not work
#
class @Maslosoft.Binder.HtmlValue extends @Maslosoft.Binder.Base

	#
	# Counter for id generator
	# @private
	# @static
	#
	idCounter = 0
	
	constructor: (options = {}) ->
		super(options)
		
		if ko.bindingHandlers.sortable and ko.bindingHandlers.sortable.options
			# Allow `contenteditable` to get focus
			ko.bindingHandlers.sortable.options.cancel = ':input,button,[contenteditable]'

	#
	# Get value of element, this can be overridden, see TextValue for example.
	# Will return inner html of element.
	#
	# @param jQuery element
	# @return string
	#
	getElementValue: (element) ->
		return element.innerHTML

	#
	# Set value of element, this can be overridden, see TextValue for example
	# Value param should be valid html.
	#
	# @param jQuery element
	# @param string
	#
	setElementValue: (element, value) ->
		element.innerHTML = value

	init: (element, valueAccessor, allBindingsAccessor) =>
		
		element.setAttribute('contenteditable', true)
		
		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Binder-HtmlValue-#{idCounter++}"

		configuration = @getValue(allBindingsAccessor).plugins
		pm = new PluginsManager(element)

		pm.from configuration

		# Handle update immediately
		handler = () =>
			# On some situations element might be null (sorting), ignore this case
			if not element then return

			# This is required in some scenarios, specifically when sorting htmlValue elements
			element = document.getElementById(element.id)
			if not element then return
			accessor = valueAccessor()

			modelValue = @getValue(valueAccessor)
			elementValue = @getElementValue(element)
			if ko.isWriteableObservable(accessor)
				# Update only if changed
				elementValue = pm.getModelValue element, elementValue
				if modelValue isnt elementValue
					#console.log "Write: #{modelValue} = #{elementValue}"
					accessor(elementValue)
		
		# Handle update, but push update to end of queue
		deferHandler = () =>
			setTimeout handler, 0
		
		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		jQuery(element).on "keyup, input", handler

		# This is to allow interaction with tools which could modify content, also to work with drag and drop
		jQuery(document).on "mouseup", deferHandler

		jQuery(document).on "changed.htmlvalue", handler

		dispose = (toDispose) ->
			jQuery(toDispose).off "keyup, input", handler
			jQuery(document).off "mouseup", deferHandler
			jQuery(document).off "changed.htmlvalue", handler

		ko.utils.domNodeDisposal.addDisposeCallback element, dispose

		return

	update: (element, valueAccessor, allBindings) =>
		value = @getValue(valueAccessor)

		configuration = @getValue(allBindings).plugins

		pm = new PluginsManager(element)

		pm.from configuration

		value = pm.getElementValue element, value
		#console.log value
		if @getElementValue(element) isnt value
			@setElementValue(element, value)
		return