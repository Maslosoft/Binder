#
# Enum binding handler
#
class @Maslosoft.Binder.EnumFormatter extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		element.innerHTML = config.values[config.data]
		return
