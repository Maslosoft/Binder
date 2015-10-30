
class @Maslosoft.Ko.Balin.WidgetAction extends @Maslosoft.Ko.Balin.WidgetUrl

	update: (element, valueAccessor, allBindings) =>

		data = @getData(element, valueAccessor, allBindings, 'action')
		href = @createUrl(data.id, data.action, data.params, '?')

		element.setAttribute('href', href)
		element.setAttribute('rel', 'virtual')
