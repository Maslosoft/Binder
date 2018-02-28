#
# CSS class binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.CssColumnsBase extends @Maslosoft.Binder.Base

	writable: false

	applyColumns: (element, sizes, config) =>

		newClasses = []
		for size, name of config
		# Remove previously set classes
			reName = name.replace '{num}', '\\d'
			name = name.replace '{num}', ''
			re = new RegExp("(?:^|\\s)#{reName}+(?!\\S)", 'g')
			element.className = element.className.replace(re, '')
			newClasses.push name + sizes[size];

		jQuery(element).addClass newClasses.join ' '
		return
