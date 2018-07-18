#
# Enum binding handler
#
class @Maslosoft.Binder.EnumFormatter extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		if typeof(config.values[config.data]) isnt 'undefined'
			element.innerHTML = config.values[config.data]
		else
			element.innerHTML = config.data
		return
