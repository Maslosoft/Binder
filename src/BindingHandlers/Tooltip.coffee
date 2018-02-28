#
# Tooltip binding handler
#
class @Maslosoft.Binder.Tooltip extends @Maslosoft.Binder.Base

	update: (element, valueAccessor) =>
		title = @getValue(valueAccessor)
		$(element).attr "title", title
		$(element).attr "data-original-title", title
		$(element).attr "rel", "tooltip"
		return
