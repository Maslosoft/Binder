
class @Maslosoft.Binder.WidgetAction extends @Maslosoft.Binder.WidgetUrl

	update: (element, valueAccessor, allBindings) =>

		data = @getData(element, valueAccessor, allBindings, 'action')
		href = @createUrl(data.id, data.action, data.params, '?')

		element.setAttribute('href', href)
		
		@setRel element
