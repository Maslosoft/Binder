#
# Href binding handler
#
class @Maslosoft.Ko.Balin.Href extends @Maslosoft.Ko.Balin.Base

	init: (element, valueAccessor, allBindingsAccessor, context) =>
#		TODO Implement this as bindingValue `stopPropagation = true/false` or as defined from options
#		if <stopPropagation>...
#			<attach-event-handler>... (e) ->
#				document.location = e.target.href
#				e.stopPropagation()

	update: (element, valueAccessor) =>
		href = @getValue(valueAccessor)
		if element.href isnt href
			element.href = href