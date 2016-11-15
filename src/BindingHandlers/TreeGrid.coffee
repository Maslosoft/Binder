
class @Maslosoft.Ko.Balin.TreeGrid extends @Maslosoft.Ko.Balin.Base

	makeTemplateValueAccessor: (element, valueAccessor, bindingContext) ->
		return () ->
			modelValue = valueAccessor()
			unwrappedValue = ko.utils.peekObservable(modelValue)
			# Unwrap without setting a dependency here
			# If unwrappedValue is the array, pass in the wrapped value on its own
			# The value will be unwrapped and tracked within the template binding
			# (See https://github.com/SteveSanderson/knockout/issues/523)
			if !unwrappedValue or typeof unwrappedValue.length == 'number'
				return {
					'foreach': modelValue
					'templateEngine': ko.nativeTemplateEngine.instance
				}

			data = []
			depths = []
			depth = -1

			unwrapRecursive = (items) ->
				depth++
				for item in items
					extras = {
						depth: depth
						hasChilds: !!item.children.length
					}
					item._treeGrid = ko.tracker.factory extras
					data.push item
					depths.push depth
					if item.children.length
						unwrapRecursive item.children
						depth--

			unwrapRecursive unwrappedValue['data']['children']

#			if bindingContext
#				innerBindingContext = bindingContext.extend({depths:depths})
#				ko.applyBindingsToDescendants({depths:depths}, element)


			# If unwrappedValue.data is the array, preserve all relevant options and unwrap again value so we get updates
			ko.utils.unwrapObservable modelValue
			{
				'foreach': data
				'depths': depths
				'as': unwrappedValue['as']
				'includeDestroyed': unwrappedValue['includeDestroyed']
				'afterAdd': unwrappedValue['afterAdd']
				'beforeRemove': unwrappedValue['beforeRemove']
				'afterRender': unwrappedValue['afterRender']
				'beforeMove': unwrappedValue['beforeMove']
				'afterMove': unwrappedValue['afterMove']
				'templateEngine': ko.nativeTemplateEngine.instance
			}

	initDraggable: (element, valueAccessor) =>
		defer = () =>
			draggableOptions = {
				handle: '.tree-grid-drag-handle'
				revert: true
				helper: 'clone'
			}

			jQuery(element).find('> tr').draggable(draggableOptions)

		setTimeout defer, 0

	initExpanders: (element) =>
		onClick = () ->
			console.log 'Clicked on expander'
		jQuery(element).on 'click', '.expander', onClick

	init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
	
		@initDraggable(element, valueAccessor)
		@initExpanders(element)

		# handle disposal
		ko.utils.domNodeDisposal.addDisposeCallback element, () ->
			$(element).draggable("destroy")

		ko.bindingHandlers['template']['init'](element, @makeTemplateValueAccessor(element, valueAccessor, bindingContext));
		return { controlsDescendantBindings: true }

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		console.log 'update - treegrid binding'
		@initDraggable(element, valueAccessor)

		defer = () ->
			items = jQuery(element).find('> tr')

			for item in items
				data = ko.contextFor item
				d = data.$data.children.length
				if !!d
					jQuery(item).find('.no-expander').hide()
					jQuery(item).find('.expander').show()
				else
					jQuery(item).find('.expander').hide()
					jQuery(item).find('.no-expander').show()
				jQuery(item).find('.debug').html d

		setTimeout defer, 10

		return ko.bindingHandlers['template']['update'](element, @makeTemplateValueAccessor(element, valueAccessor), allBindings, viewModel, bindingContext);

