#
# Video PLaylist binding handler
#
class @Maslosoft.Binder.VideoThumb extends @Maslosoft.Binder.Video

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		
	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		url = @getValue(valueAccessor)

		@setThumb url, element

				

		