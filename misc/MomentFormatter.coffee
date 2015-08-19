
class @Maslosoft.Ko.BindingHandlers.MomentFormatter extends @Maslosoft.Ko.BindingHandlers.Moment

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		moment.lang @options.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@sourceformat](value).format(@displayformat)
		return
