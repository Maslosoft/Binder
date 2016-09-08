#
# Video PLaylist binding handler
#
class @Maslosoft.Ko.Balin.VideoPlaylist extends @Maslosoft.Ko.Balin.Base

	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return value.data
		return value

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		
		# Video options
		options = valueAccessor().options or {}
#		@update(element, valueAccessor, allBindingsAccessor)


	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		data = @getData(valueAccessor)
		console.log data

		html = []
		for video in data
			html.push "<a href='#{video.url}'>#{video.title}</a>"

		ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', true);

		ko.utils.addCssClass
		element.innerHTML = html.join "\n"
		new Maslosoft.Playlist element
		