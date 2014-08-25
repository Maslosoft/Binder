class @Maslosoft.Ko.Balin.Fancytree extends @Maslosoft.Ko.Balin.Base

	tree: null
	element: null

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		jQuery(element).fancytree({
			source: []
		});

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		options = {
			autoExpand: true
		}
		element = jQuery element

		handler = () =>

			if element.find('.ui-fancytree').length == 0
				return

			element.fancytree 'option', 'source', valueAccessor()
#				element.fancytree('getTree').getTree()
#				element.fancytree('getTree').reload(dp)
			#element.fancytree('getTree').init()
			if options.autoExpand
				element.fancytree('getRootNode').visit (node) ->
					node.setExpanded true
			element.focus()
		setTimeout handler, 0