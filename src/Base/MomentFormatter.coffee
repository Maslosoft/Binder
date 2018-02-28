#
# Moment formatter class
#
class @Maslosoft.Binder.MomentFormatter extends @Maslosoft.Binder.Base

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		moment.locale @options.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@options.sourceFormat](value).format(@options.displayFormat)
		return
