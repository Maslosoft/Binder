#
# Data binding handler
#
class @Maslosoft.Binder.Data extends @Maslosoft.Binder.Base

	getNamespacedHandler: (binding) ->
		return {
			update: (element, valueAccessor) =>
				value = @getValue(valueAccessor)
				if typeof(value) not in ['string', 'number']
					value = JSON.stringify(value)
				element.setAttribute('data-' + binding, value)
			}
