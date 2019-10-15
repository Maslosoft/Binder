#
# One-way decimal formatter
#
class @Maslosoft.Binder.DecimalFormatter extends @Maslosoft.Binder.Base

	precision: 2

	decimalSeparator: ','

	thousandSeparator: ' '

	suffix: ''

	prefix: ''

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor) or 0
		value = parseFloat(value)

		config = {}
		names = ['precision', 'decimalSeparator', 'thousandSeparator', 'suffix', 'prefix']
		for name in names
			# Set global value
			config[name] = @[name]
			
			# Try to set value from bindings
			bound = allBindingsAccessor.get(name)
			if typeof(bound) isnt 'undefined'
				config[name] = @getValue bound
		
		formatted = numberFormat value, config.precision, 3, config.thousandSeparator, config.decimalSeparator

		element.innerHTML = config.prefix + formatted + config.suffix