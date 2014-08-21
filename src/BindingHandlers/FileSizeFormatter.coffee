#
# One-way file size formatter
#
class @Maslosoft.Ko.Balin.FileSizeFormatter extends @Maslosoft.Ko.Balin.Base

	init: (element, valueAccessor, allBindingsAccessor, viewModel) ->

	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		value = @getValue(valueAccessor)
		format = (bytes) ->
			i = -1
			units = [
				" kB"
				" MB"
				" GB"
				" TB"
				"PB"
				"EB"
				"ZB"
				"YB"
			]
			loop
				bytes = bytes / 1024
				i++
				break unless bytes > 1024
			Math.max(bytes, 0.1).toFixed(1) + units[i]

		element.innerHTML = format(value)
		return