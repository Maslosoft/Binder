
class @Maslosoft.Ko.Balin.TimeAgoFormatter extends @Maslosoft.Ko.Balin.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.TimeAgoOptions(options)

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@options.sourceFormat](value).fromNow()
		return
