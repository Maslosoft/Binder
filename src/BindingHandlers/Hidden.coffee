#
# Hidden binding handler, opposite to visible
#
class @Maslosoft.Ko.Balin.Hidden extends @Maslosoft.Ko.Balin.Base
	
	update: (element, valueAccessor) =>
		value = not @getValue(valueAccessor)
		ko.bindingHandlers.visible.update element, ->
			value
