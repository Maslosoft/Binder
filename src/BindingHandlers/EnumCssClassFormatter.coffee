#
# Enum css class handler
#
class @Maslosoft.Ko.Balin.EnumCssClassFormatter extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue valueAccessor
		console.log 'enum css'
		console.log config
		console.log config.values[config.data]
		
		# Remove previosly set classes
		for name in config.values
			re = new RegExp("(?:^|\\s)#{name}(?!\\S)", 'g')
			console.log re
			element.className = element.className.replace(re, '')

		element.className += ' ' + config.values[config.data]
		return
