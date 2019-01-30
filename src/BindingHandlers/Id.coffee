#
# Src binding handler
#
class @Maslosoft.Binder.Id extends @Maslosoft.Binder.Base

	init: (element) =>
		ensureAttribute element, 'id'

	update: (element, valueAccessor) =>
		id = @getValue(valueAccessor)
		if element.getAttribute('id') isnt id
			element.setAttribute('id', id)