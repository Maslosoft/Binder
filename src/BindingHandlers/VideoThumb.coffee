#
# Video Playlist binding handler
#
class @Maslosoft.Binder.VideoThumb extends @Maslosoft.Binder.Video

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		
	update: (element, valueAccessor) =>
		url = @getValue(valueAccessor)

		@setThumb url, element

				

		