
class @Maslosoft.Binder.TimeAgoFormatter extends @Maslosoft.Binder.MomentFormatter

	constructor: (options) ->
		super new Maslosoft.Binder.TimeAgoOptions(options)

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor)
		element.innerHTML = moment[@options.sourceFormat](value).fromNow()
		return
