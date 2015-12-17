#
# Data binding handler
#
class @Maslosoft.Ko.Balin.Data extends @Maslosoft.Ko.Balin.Base

	getNamespacedHandler: (binding) ->
		return {
			update: (element, valueAccessor) =>
				value = @getValue(valueAccessor)
				if typeof(value) not in ['string', 'number']
					value = JSON.stringify(value)
				element.setAttribute('data-' + binding, value)
			}
