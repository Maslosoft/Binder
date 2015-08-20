#
# Tooltip binding handler
#
class @Maslosoft.Ko.Balin.Tooltip extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor) =>
		title = @getValue(valueAccessor)
		$(element).attr "title", title
		$(element).attr "rel", "tooltip"
		return
