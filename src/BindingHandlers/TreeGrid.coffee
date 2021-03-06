
class @Maslosoft.Binder.TreeGrid extends @Maslosoft.Binder.Base

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

			data = ko.observableArray []
			depths = ko.observableArray []
			depth = -1

			unwrapRecursive = (items) ->
				depth++
				for item in items
					hasChilds = item.children and item.children.length and item.children.length > 0
					extras = {
						depth: depth
						hasChilds: hasChilds
					}
					item._treeGrid = ko.tracker.factory extras
					data.push item
					depths.push depth
					if hasChilds
						unwrapRecursive item.children
						depth--

#			log unwrappedValue['data']
			if unwrappedValue['data']['children']
#				log('model init')
				unwrapRecursive unwrappedValue['data']['children']
			else
#				log('array init')
				unwrapRecursive unwrappedValue['data']
			
			if bindingContext
				bindingContext.tree = unwrappedValue['data']
				bindingContext.data = data
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

		value = @getValue valueAccessor
		activeClass = value.activeClass

		table = jQuery(element)

		widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView element, valueAccessor
		widget.init()

		if activeClass
			activeClassHandler = (e) ->
				# Remove from all instances of `tr` tu support multiple
				# classes separated with space
				table.find('tr').removeClass activeClass
				jQuery(e.currentTarget).addClass activeClass
				return true
			table.on 'click', 'tr', activeClassHandler

			dispose = (toDispose) ->
				widget.dispose()
				jQuery(toDispose).off "click", 'tr', activeClassHandler

			ko.utils.domNodeDisposal.addDisposeCallback element, dispose

		ko.bindingHandlers['template']['init'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);
		return { controlsDescendantBindings: true }

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		widget = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView element, valueAccessor, 'update'

		return ko.bindingHandlers['template']['update'](element, makeValueAccessor(element, valueAccessor, bindingContext, widget), allBindings, viewModel, bindingContext);

