###
Select2
###
class @Maslosoft.Ko.Balin.Select2 extends @Maslosoft.Ko.Balin.Base

	bindingName = 'select2'
	dataBindingName = "#{bindingName}Data"

	triggerChangeQuietly = (element, binding) ->
		isObservable = ko.isObservable(binding)
		originalEqualityComparer = undefined
		if isObservable
			originalEqualityComparer = binding.equalityComparer

			binding.equalityComparer = ->
				true

		$(element).trigger 'change'
		if isObservable
			binding.equalityComparer = originalEqualityComparer
		return

	init = (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
		bindingValue = ko.unwrap(valueAccessor())
		allBindings = allBindingsAccessor()
		ignoreChange = false
		dataChangeHandler = null
		subscription = null
		$(element).on 'select2:selecting select2:unselecting', ->
			ignoreChange = true
			return
		$(element).on 'select2:select select2:unselect', ->
			ignoreChange = false
			return
		if ko.isObservable(allBindings.value)
			subscription = allBindings.value.subscribe((value) ->
				if ignoreChange
					return
				triggerChangeQuietly element, @_target or @target
				return
			)
		else if ko.isObservable(allBindings.selectedOptions)
			subscription = allBindings.selectedOptions.subscribe((value) ->
				if ignoreChange
					return
				triggerChangeQuietly element, @_target or @target
				return
			)
		# Provide a hook for binding to the select2 "data" property; this property is read-only in select2 so not subscribing.
		if ko.isWriteableObservable(allBindings[dataBindingName])

			dataChangeHandler = ->
				if !$(element).data('select2')
					return
				allBindings[dataBindingName] $(element).select2('data')
				return

			$(element).on 'change', dataChangeHandler
		# Apply select2
		$(element).select2 bindingValue

		if allBindings.selectedOptions
			$(element).val(allBindings.selectedOptions).trigger('change')

		# Destroy select2 on element disposal
		ko.utils.domNodeDisposal.addDisposeCallback element, ->
			$(element).select2 'destroy'
			if dataChangeHandler != null
				$(element).off 'change', dataChangeHandler
			if subscription != null
				subscription.dispose()
			return
		return

	init: () =>
		args = arguments
		to = () ->
			init.apply null, args
		setTimeout to, 0

	update: (element, valueAccessor, allBindingsAccessor) =>
		return
		value = @getValue(valueAccessor)
		if element.value isnt value.data
			copy = JSON.parse JSON.stringify value.data
			$(element).val(copy);
			console.log "Update what?", element, value