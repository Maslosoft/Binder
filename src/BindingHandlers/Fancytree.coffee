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
					dragDrop: (node, data) ->
						# NOTE here could be implemented view model change, but there is no reference to current node
						parent = TreeDnd.findNode(tree, data.otherNode.parent.data.id)
						current = TreeDnd.findNode(tree, data.otherNode.data.id)
						target = TreeDnd.findNode(tree, node.data.id)
						targetParent = TreeDnd.findNode(tree, node.parent.data.id)
						TreeDnd.moveTo parent, current, target, targetParent, data.hitMode

						# data.otherNode.moveTo(node, data.hitMode)
						handler = () ->
							jQuery(element).fancytree 'option', 'source', tree.children
						setTimeout handler, 0

			}

		jQuery(element).fancytree(options);
	
	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		config = @getValue(valueAccessor)
		element = jQuery element
		console.log 'update...'
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
