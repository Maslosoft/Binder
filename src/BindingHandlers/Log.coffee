
#
# Log with element reference
#
#
class @Maslosoft.Binder.Log extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindings) =>
		console.log @getValue(valueAccessor), element

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		console.log @getValue(valueAccessor), element