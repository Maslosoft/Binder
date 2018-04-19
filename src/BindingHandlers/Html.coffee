#
# HTML improved binding handler
#
class @Maslosoft.Binder.Html extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, context) ->
		return { 'controlsDescendantBindings': true }

	update: (element, valueAccessor, allBindings, context) =>
		# setHtml will unwrap the value if needed
		value = @getValue(valueAccessor)

		configuration = @getValue(allBindings).plugins

		pm = new PluginsManager(element)

		pm.from configuration

		value = pm.getElementValue element, value

		ko.utils.setHtml(element, value)
