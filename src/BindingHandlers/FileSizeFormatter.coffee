#
# One-way file size formatter
#
class @Maslosoft.Binder.FileSizeFormatter extends @Maslosoft.Binder.Base

	units: {
		binary: [
				"kiB"
				"MiB"
				"GiB"
				"TiB"
				"PiB"
				"EiB"
				"ZiB"
				"YiB"
			],
		decimal: [
				"kB"
				"MB"
				"GB"
				"TB"
				"PB"
				"EB"
				"ZB"
				"YB"
		]
	}

	binary: true

	init: (element, valueAccessor, allBindingsAccessor, viewModel) =>

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		value = @getValue(valueAccessor) or 0
		#
		# TODO This should also be configurable via at binding
		#
		binary = @binary
		decimal = !@binary
		
		step = 1024 if binary
		step = 1000 if decimal
		format = (bytes) =>
			bytes = parseInt(bytes)
			if bytes < step
				return bytes + ' B'
			i = -1
			units = @units.binary if binary
			units = @units.decimal if decimal
			loop
				bytes = bytes / step
				i++
				break unless bytes > step
			if units[i]
				Math.max(bytes, 0.1).toFixed(1) + ' ' + units[i]
			else
				Math.max(bytes, 0.1).toFixed(1) + " ~*#{i * step} * #{step} B"

		element.innerHTML = format(value)