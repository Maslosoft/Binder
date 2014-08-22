#
# Html value binding
# TODO Check if sortable is active, and if active, add `[contenteditable]` to `cancel` option
#
class @Maslosoft.Ko.Balin.HtmlValue extends @Maslosoft.Ko.Balin.Base

	# Counter for id generator
	idCounter = 0

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		element.setAttribute('contenteditable', true)

		# Generate some id if not set, see notes below why
		if not element.id
			element.id = "Maslosoft-Ko-Balin-HtmlValue-#{idCounter++}"

		handler = (e) =>
		
			# On some situations element might be null (sorting), ignore this case
			if not element then return

			# This is required in some scenarios, specifically when sorting htmlValue elements
			element = document.getElementById(element.id)
			if not element then return
			
			accessor = valueAccessor()
			modelValue = @getValue(valueAccessor)
			elementValue = element.innerHTML
			if ko.isWriteableObservable(accessor)
				# Update only if changed
				if modelValue isnt elementValue
#					console.log "Write: #{modelValue} = #{elementValue}"
					accessor(elementValue)

		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup, input", handler

		# This is to allow interation with tools which could modify content, also to work with drag and drop
		$(document).on "mouseup", handler
		return

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if element.innerHTML isnt value
#			console.log "Update: #{element.innerHTML} = #{value}"
			element.innerHTML = value
		return