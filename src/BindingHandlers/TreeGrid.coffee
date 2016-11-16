
class @Maslosoft.Ko.Balin.TreeGrid extends @Maslosoft.Ko.Balin.Base

	#
	#
	# @private
	#
	makeValueAccessor = (element, valueAccessor, bindingContext, widget) ->
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
			
			if bindingContext
				bindingContext.tree = unwrappedValue['data']
				bindingContext.widget = widget


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

	init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

		widget = new Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView element, valueAccessor
		ko.bindingHandlers['template']['init'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
		return { controlsDescendantBindings: true }

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		widget = new Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView element, valueAccessor, 'update'

		return ko.bindingHandlers['template']['update'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);

