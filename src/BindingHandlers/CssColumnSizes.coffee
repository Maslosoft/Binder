#
# Enum css class handler
#
class @Maslosoft.Binder.CssColumnSizes extends @Maslosoft.Binder.CssColumnsBase

	@columns = {
		'xs': 'col-xs-{num}',
		'sm': 'col-sm-{num}',
		'md': 'col-md-{num}',
		'lg': 'col-lg-{num}'
	}

	init: (element, valueAccessor) =>

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		sizes = @getValue valueAccessor
		@applyColumns element, sizes, CssColumnSizes.columns



