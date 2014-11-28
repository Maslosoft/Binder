#
# Selected binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.Selected extends @Maslosoft.Ko.Balin.Base

	writable: false

	className: 'selected'

	update: (element, valueAccessor) =>
		value = @getValue(valueAccessor)
		if value
			ko.utils.toggleDomNodeCssClass(element, @className, true);
		else
			ko.utils.toggleDomNodeCssClass(element, @className, false);
		return