
#
# Log with element reference
#
#
class @Maslosoft.Ko.Balin.Log extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindings) =>
		console.log @getValue(valueAccessor), element

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		console.log @getValue(valueAccessor), element