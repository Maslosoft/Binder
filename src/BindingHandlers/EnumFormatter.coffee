#
# Enum binding handler
#
class @Maslosoft.Ko.Balin.EnumFormatter extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		element.innerHTML = config.values[config.data]
		return
