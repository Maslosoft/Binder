class TreeNodeRenderer

	icon: ''
	
	renderer: null
	
	#
	# Node finder instance
	# @var TreeNodeFinder
	# @private
	#
	finder = null

	constructor: (tree, options, @icon) ->
		console.log icon
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
		
		if @icon
			html = span.html()
			span.html("<i class='node-title-icon' style='background-image:url(#{@icon})'></i> #{html}")