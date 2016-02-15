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
		finder = new TreeNodeFinder tree
		
	setRenderer: (@renderer) ->
		if typeof(@renderer.render) isnt 'function'
			console.error "Renderer must have function `render`"
	
	render: (event, data) =>
		node = data.node
		
		# Skip event from child nodes
		# If not skipped, double icons will appear on folder nodes
		# TODO Investigate if there is more reliable methos for this
		for index, val of data
			if index is 'originalEvent'
				return
		
		
		# Operate only on title, not whole node html
		# This will prevent destroying expanders etc.
		span = jQuery(node.span).find("> span.fancytree-title")
		
		# Use custom render
		if @renderer and @renderer.render
			model = finder.find node.data.id
			@renderer.render(model, span)
		
		# Apply icon if applicable
		if @icon or @folderIcon
		
			# Use html here (not node.title) as it might be altered by custom renderer
			html = span.html()
			
			# Check which icon to use
			if @folderIcon && node.children && node.children.length
				icon = @folderIcon
			else
				icon = @icon
			
			# Add icon tag just before title
			# This will ensure proper dnd for responsive icon size
			span.html("<i class='node-title-icon' style='background-image:url(#{icon})'></i> #{html}")