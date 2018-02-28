#
# Hidden binding handler, opposite to visible
#
class @Maslosoft.Binder.Hidden extends @Maslosoft.Binder.Base
	
	update: (element, valueAccessor) =>
		value = not @getValue(valueAccessor)
		ko.bindingHandlers.visible.update element, ->
			value
