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
			options.dnd = {
					autoExpandMS: 400,
					focusOnClick: true,
					preventVoidMoves: true,
					preventRecursiveMoves: true,
					dragStart: (node, data) ->
						return true

					dragEnter: (node, data) ->
						return true
					dragDrop: (node, data) =>
						
						parent = TreeDnd.findNode(tree, data.otherNode.parent.data.id)
						current = TreeDnd.findNode(tree, data.otherNode.data.id)
						target = TreeDnd.findNode(tree, node.data.id)
						targetParent = TreeDnd.findNode(tree, node.parent.data.id)

						# Update view model
						TreeDnd.moveTo parent, current, target, targetParent, data.hitMode

						# NOTE: This could possibly work, but it doesn't.
						# This would update while tree with new data.
						# @handle element, valueAccessor, allBindingsAccessor

						# Move node separatelly
						data.otherNode.moveTo(node, data.hitMode)

			}

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
