#
# Video PLaylist binding handler
#
class @Maslosoft.Ko.Balin.VideoThumb extends @Maslosoft.Ko.Balin.Video

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		
	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		url = @getValue(valueAccessor)

		@setThumb url, element

				

		