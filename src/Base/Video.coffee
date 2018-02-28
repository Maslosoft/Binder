#
# Base class for video related bindings
#
class @Maslosoft.Binder.Video extends @Maslosoft.Binder.Base

	options = null
	adapters = null

	jQuery(document).ready () ->

		# Initalize thumbnails adapters
		options = new Maslosoft.Playlist.Options

		# Set adapters from options
		adapters = options.adapters

	#
	# Check is supported video url
	# @param url string
	# @return false|object
	#
	isVideoUrl: (url) =>
		for adapter in adapters
			if adapter.match url
				return adapter
		return false

	#
	# Will set image src attribute to video thumbnail,
	# or element background-image style if it's not image
	# @param url string
	# @param element DomElement
	#
	setThumb: (url, element) =>
		if adapter = @isVideoUrl url

			thumbCallback = (src) ->
				if element.tagName.toLowerCase() is 'img'
					element.src = src
				else
					jQuery(element).css 'background-image', "url('#{src}')"

			console.log url
			# Init adapter
			ad = new adapter
			ad.setUrl url
			ad.setThumb thumbCallback
