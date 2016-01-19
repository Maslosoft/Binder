#
# Fancytree binding
# TODO Allow sytaxes:
# data-bind="fancytree: data"
# data-bind="fancytree: {data: data}"
# data-bind="fancytree: {data: data, options: <fancyTree-options>, autoExpand: true|false}"
# TODO When using two or more trees from same data, only first one works properly
#
class @Maslosoft.Ko.Balin.Fancytree extends @Maslosoft.Ko.Balin.Base

	tree: null
	element: null

	getData: (valueAccessor) ->
		# Verbose syntax, at least {data: data}
		value = @getValue(valueAccessor) or []
		if value.data
			return value.data
		return value

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		tree = @getData(valueAccessor)
		# Tree options
		options = valueAccessor().options or {}

		# Effects makes updates flickering, disable
		options.toggleEffect = false
		options.source = tree.children
		options.extensions = []

		# DND
		dnd = valueAccessor().dnd or false
		if dnd
			options.extensions.push 'dnd'
			options.dnd = new TreeDnd tree, element

		jQuery(element).fancytree(options);

	handle: (element, valueAccessor, allBindingsAccessor) =>
		config = @getValue(valueAccessor)
		element = jQuery element
		handler = () =>

			if not element.find('.ui-fancytree').length then return

			element.fancytree 'option', 'source', @getData(valueAccessor).children

			# Autoexpand handling
			if config.autoExpand
				element.fancytree('getRootNode').visit (node) ->
					node.setExpanded true
			element.focus()

		# Put rendering to end of queue to ensure bindings are evaluated
		setTimeout handler, 0

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		@handle element, valueAccessor, allBindingsAccessor
