#
# Placeholder binding handler
#
class @Maslosoft.Binder.Placeholder extends @Maslosoft.Binder.Base

	init: (element) =>
		ensureAttribute element, 'placeholder'

	update: (element, valueAccessor) =>

		placeholder = @getValue(valueAccessor)

		if element.getAttribute('placeholder') isnt placeholder
			# Clean up HTML
			placeholder = $("<div/>").html(placeholder).text()
			element.setAttribute 'placeholder', placeholder
