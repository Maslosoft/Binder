###
One-way date/time formatter
###
class @Maslosoft.Ko.Balin.MomentFormatter extends @Maslosoft.Ko.Balin.Moment
	
	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		moment.lang @options.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@sourceformat](value).format(@displayformat)
		return