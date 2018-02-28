#
# Src binding handler
#
class @Maslosoft.Binder.Src extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, context) =>

	update: (element, valueAccessor) =>
		src = @getValue(valueAccessor)
		if element.src isnt src
			element.src = src