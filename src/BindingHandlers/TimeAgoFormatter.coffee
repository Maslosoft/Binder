
class @Maslosoft.Ko.Balin.TimeAgoFormatter extends @Maslosoft.Ko.Balin.MomentFormatter

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[this.options.sourceFormat](value).fromNow()
		return
