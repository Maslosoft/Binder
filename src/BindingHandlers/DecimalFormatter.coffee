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
		
		###
		# Number.prototype.format(n, x, s, c)
		# @see http://stackoverflow.com/a/14428340/5444623
		# @param float   number: number to format
		# @param integer n: length of decimal
		# @param integer x: length of whole part
		# @param mixed   s: sections delimiter
		# @param mixed   c: decimal delimiter
		###
		format = (number, n = 2, x = 3, s = ' ', c = ',') ->
			re = '\\d(?=(\\d{' + (x or 3) + '})+' + (if n > 0 then '\\D' else '$') + ')'
			num = number.toFixed(Math.max(0, ~ ~n))
			(if c then num.replace('.', c) else num).replace new RegExp(re, 'g'), '$&' + (s or ',')


		formatted = format value, config.precision, 3, config.thousandSeparator, config.decimalSeparator

		element.innerHTML = config.prefix + formatted + config.suffix