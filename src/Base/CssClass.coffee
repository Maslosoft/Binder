#
# CSS class binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.CssClass extends @Maslosoft.Ko.Balin.Base

	writable: false

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if !!value
			ko.utils.toggleDomNodeCssClass(element, @options.className, true);
		else
			ko.utils.toggleDomNodeCssClass(element, @options.className, false);
		return
