#
# Enum css class handler
#
class @Maslosoft.Binder.EnumCssClassFormatter extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		
		# Remove previously set classes
		for name in config.values
			re = new RegExp("(?:^|\\s)#{name}(?!\\S)", 'g')
			element.className = element.className.replace(re, '')

		element.className += ' ' + config.values[config.data]
		return
