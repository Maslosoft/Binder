#
# CSS class binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.CssClass extends @Maslosoft.Binder.Base

	writable: false

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if !!value
			ko.utils.toggleDomNodeCssClass(element, @options.className, true);
		else
			ko.utils.toggleDomNodeCssClass(element, @options.className, false);
		return
