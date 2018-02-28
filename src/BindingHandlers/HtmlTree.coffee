#
# Html tree binding
#
# This simpy builds a nested ul>li struct
#
# data-bind="htmlTree: data"
#
class @Maslosoft.Binder.HtmlTree extends @Maslosoft.Binder.Base

	@drawNode: (data) ->
		# wrapper = document.createElement 'ul'
		title = document.createElement 'li'
		title.innerHTML = data.title
		# wrapper.appendChild title
		if data.children and data.children.length > 0
			childWrapper = document.createElement 'ul'
			for node in data.children
				child = HtmlTree.drawNode(node)
				childWrapper.appendChild child
			title.appendChild childWrapper
		return title


	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return @getValue(value.data) or []
		return value

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		data = @getValue(valueAccessor)
		warn "HtmlTree is experimental, do not use"
		handler = () =>
			nodes = HtmlTree.drawNode data
			element.innerHTML = ''
			element.appendChild nodes

		# Put rendering to end of queue to ensure bindings are evaluated
		setTimeout handler, 0
