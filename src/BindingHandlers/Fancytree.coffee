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
		events = @getValue(valueAccessor).on or false
		# Effects makes updates flickering, disable
		options.toggleEffect = false
		options.source = tree.children
		options.extensions = []

		# Events
		if events
			new TreeEvents tree, events, options

		# Accessors for dnd and draggable
		dnd = valueAccessor().dnd or false
		drag = valueAccessor().drag or false

		if dnd and drag
			throw new Error 'Cannot use both `dnd` and `drag`'

		# DND
		if dnd
			options.autoScroll = false
			options.extensions.push 'dnd'
			options.dnd = new TreeDnd tree, element
			
		# Draggable only
		if drag
			options.autoScroll = false
			options.extensions.push 'dnd'
			options.dnd = new TreeDrag tree, element

		# Node icon and renderer
		nodeIcon = valueAccessor().nodeIcon or false
		folderIcon = valueAccessor().folderIcon or false
		nodeRenderer = valueAccessor().nodeRenderer or false
		
		# Folder icon option
		if folderIcon and not nodeIcon
			warn "Option `folderIcon` require also `nodeIcon` or it will not work at all"
		
		if nodeIcon or nodeRenderer
			# Disable tree icon, as custom renderer will be used
			if nodeIcon
				options.icon = false
			
			# Create internal renderer instance
			renderer = new TreeNodeRenderer tree, options, nodeIcon, folderIcon
			
			# Custom title renderer
			if nodeRenderer
				renderer.setRenderer(new nodeRenderer(tree, options))
			
			options.renderNode = renderer.render

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
