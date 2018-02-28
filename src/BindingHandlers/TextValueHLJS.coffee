#
# Html text value binding
# WARNING This MUST have parent context, or will not work
#
class @Maslosoft.Binder.TextValueHLJS extends @Maslosoft.Binder.HtmlValue

	getElementValue: (element) ->
		return element.textContent || element.innerText || ""

	setElementValue: (element, value) ->
		if typeof element.textContent isnt 'undefined'
			element.textContent = value
			if hljs
				hljs.highlightBlock(element)
		if typeof element.innerText isnt 'undefined'
			element.innerText = value
			if hljs
				hljs.highlightBlock(element)
