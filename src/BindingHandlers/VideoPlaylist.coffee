#
# Video PLaylist binding handler
#
class @Maslosoft.Ko.Balin.VideoPlaylist extends @Maslosoft.Ko.Balin.Video
	initVideos: null
	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return value.data
		return value

	init: (element, valueAccessor, allBindingsAccessor, context) =>


	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		data = @getData valueAccessor
		options = @getValue valueAccessor or {}
		urlField = options.urlField or 'url'
		titleField = options.urlField or 'title'

		html = []
		for video in data
			url = video[urlField]
			title = video[titleField]
			if @isVideoUrl url
				html.push "<a href='#{url}'>#{title}</a>"

		element.innerHTML = html.join "\n"
		if html.length
			ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', true);
			new Maslosoft.Playlist element
		else
			ko.utils.toggleDomNodeCssClass(element, 'maslosoft-playlist', false);
