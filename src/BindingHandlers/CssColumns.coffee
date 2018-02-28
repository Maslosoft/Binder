#
# Enum css class handler
#
class @Maslosoft.Binder.CssColumns extends @Maslosoft.Binder.CssColumnsBase

	@columns = {
		'xs': 'col-xs-{num}',
		'sm': 'col-sm-{num}',
		'md': 'col-md-{num}',
		'lg': 'col-lg-{num}'
	}

	init: (element, valueAccessor) =>

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		columns = @getValue valueAccessor

		sizes = {}

		for size, name of CssColumns.columns
			value = parseInt columns[size]
			cols = parseInt 12 / value
			sizes[size] = cols

		@applyColumns element, sizes, CssColumns.columns
