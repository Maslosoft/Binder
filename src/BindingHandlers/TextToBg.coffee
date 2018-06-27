class @Maslosoft.Binder.TextToBg extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, context) ->


	update: (element, valueAccessor, allBindings, context) =>

		value = @getValue(valueAccessor)
		jQuery(element).css 'background-color', stringToColour(value)

