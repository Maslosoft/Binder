#
# Src binding handler
#
class @Maslosoft.Binder.Src extends @Maslosoft.Binder.Base

	init: (element) =>
		ensureAttribute(element, 'src')

	update: (element, valueAccessor) =>
		src = @getValue(valueAccessor)
		if element.getAttribute('src') isnt src
			element.setAttribute('src', src)