
class TreeDrag

	# Prevent focus on click
	# When enabled will scroll to tree control on click, not really desirable
	# Cons: breaks keyboard navigation
	focusOnClick: false

	#
	# Whole tree data
	# @var TreeItem[]
	#
	tree: null
	#
	# Node finder instance
	# @var TreeNodeFinder
	#
	finder: null

	#
	# Draggable options
	#
	#
	draggable: null

	#
	# Tree html element
	#
	#
	@el = null

	# Private

	t = (node) ->
		return # Comment to log
		log "Node: #{node.title}"
		children = []
		if node.children and node.children.length > 0
			for childNode in node.children
				children.push childNode.title
			log "Children: #{children.join(',')}"

	constructor: (initialTree, element, events, options) ->
		@draggable = {}
		@draggable.scroll = false

		@tree = {}
		@tree = initialTree
		@finder = new TreeNodeFinder @tree
		@el = jQuery element

	dragStart: (node, data) ->
		return true

	dragEnter: (node, data) ->
		return false

	dragEnd: (node, data) =>
		log 'drag end...'
		return true

	dragDrop: (node, data) =>
		return false
		hitMode = data.hitMode

		# Dragged element - either draggable or tree element
		dragged = data.draggable.element[0]

		if not data.otherNode
			# Drop from ourside tree
			ctx = ko.contextFor dragged
			current = ctx.$data
		else
			# From from within tree
			parent = @finder.find(data.otherNode.parent.data.id)
			current = @finder.find(data.otherNode.data.id)

			if not @el.is dragged
				log 'From other instance...'
				# Drop from other tree instance
				data = ko.dataFor dragged
				log data
				setTimeout handler, 0

		target = @finder.find(node.data.id)
		targetParent = @finder.find(node.parent.data.id)


		# console.log "Parent: #{parent.title}"
		# console.log "Current: #{current.title}"
		# console.log "Target: #{target.title}"
		# console.log "TargetParent: #{targetParent.title}"
		# console.log hitMode


		# Update view model
		# Remove current element first
		if parent
			parent.children.remove current
		@tree.children.remove current

		if targetParent
			targetParent.children.remove current

		# Just push at target end
		if hitMode is 'over'
			# log hitMode
			# log "Target: #{target.title}"
			# log "Current: #{current.title}"
			target.children.push current

		# Insert before target - at target parent
		if hitMode is 'before'
			if targetParent
				# Move over some node
				index = targetParent.children.indexOf target
				targetParent.children.splice index, 0, current
			else
				# Move over root node
				index = @tree.children.indexOf target
				@tree.children.splice index, 0, current
			# console.log "indexOf: #{index} (before)"

		# Simply push at the end - but at targetParent
		if hitMode is 'after'
			if targetParent
				targetParent.children.push current
			else
				@tree.children.push current

		# NOTE: This could possibly work, but it doesn't.
		# This would update whole tree with new data. Some infinite recursion occurs.
		# @handle element, valueAccessor, allBindingsAccessor

		handler = (e) =>
			log e
			@el.fancytree 'option', 'source', @tree.children
			@el.fancytree('getRootNode').visit (node) ->
				node.setExpanded true
			@el.focus()
			log 'update tree..', @el

		setTimeout handler, 0
		# Move fancytree node separatelly
		# data.otherNode.moveTo(node, hitMode)

			# Expand node as it looks better if it is expanded after drop

		return true
