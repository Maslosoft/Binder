
class @Maslosoft.Binder.WidgetActivity extends @Maslosoft.Binder.WidgetUrl

	update: (element, valueAccessor, allBindings) =>
		
		data = @getData(element, valueAccessor, allBindings, 'activity')
		href = @createUrl(data.id, data.activity, data.params, '#')

		element.setAttribute('href', href)

		@setRel element
			