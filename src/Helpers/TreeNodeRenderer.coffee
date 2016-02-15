class TreeNodeRenderer

	icon: ''
	
	folderIcon: ''
	
	renderer: null
	
	#
	# Node finder instance
	# @var TreeNodeFinder
	# @private
	#
	finder = null

	constructor: (tree, options, @icon, @folderIcon) ->
		console.log @icon
		console.log @folderIcon
		finder = new TreeNodeFinder tree
		
	setRenderer: (@renderer) ->
		if typeof(@renderer.render) isnt 'function'
			console.error "Renderer must have function `render`"
	
	render: (event, data) =>
		node = data.node
		span = jQuery(node.span).find("> span.fancytree-title")
		
		if @renderer and @renderer.render
			model = finder.find node.data.id
			@renderer.render(model, span)
		
		if @icon or @folderIcon
			html = span.html()
			log node
			if node.children && node.children.length
				log 'folder'
				icon = @folderIcon
			else
				log 'leaf'
				icon = @icon
			span.html("<i class='node-title-icon' style='background-image:url(#{icon})'></i> #{html}")