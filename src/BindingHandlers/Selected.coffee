#
# Selected binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.HtmlValue extends @Maslosoft.Ko.Balin.Base

	className: 'selected'

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if value
			ko.utils.toggleDomNodeCssClass(element, @className, true);
		else
			ko.utils.toggleDomNodeCssClass(element, @className, false);
		return