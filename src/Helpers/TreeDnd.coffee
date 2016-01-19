#
# Tree drag and drop helpers
# @internal
#
class TreeDndCache
	nodes: {}
	constructor: () ->
		@nodes = {}

	get: (id) ->
		if typeof(@nodes[id]) is 'undefined'
			return false
		return @nodes[id]

	set: (id, val) ->
		@nodes[id] = val

class TreeNodeFinder
	# Private
	cache = null
	tree = null
	constructor: (initialTree) ->
		cache = new TreeDndCache
		tree = initialTree

	findNode = (node, id) ->
		if typeof(id) is 'undefined'
			return false
		if found = cache.get id
			console.log "Cache hit: #{found.title}"
			return found
		if node.id is id
			return node
		if  node._id is id
			return node

		if node.children and node.children.length > 0
			for child in node.children
				foundNode = findNode(child, id)
				if foundNode isnt false
					cache.set id, foundNode
					return foundNode
		return false

	find: (id) ->
		return findNode tree, id

class TreeDnd
	autoExpandMS: 400
	focusOnClick: true
	preventVoidMoves: true
	preventRecursiveMoves: true
	# Private
	tree = null
	finder = null
	el = null

	t = (node) ->
		return # Comment to log
		log "Node: #{node.title}"
		children = []
		if node.children and node.children.length > 0
			for childNode in node.children
				children.push childNode.title
			log "Children: #{children.join(',')}"

	constructor: (initialTree, element) ->
		tree = initialTree
		finder = new TreeNodeFinder tree
		el = jQuery element

	dragStart: (node, data) ->
		return true

	dragEnter: (node, data) ->
		return true

	dragDrop: (node, data) =>

		hitMode = data.hitMode
		parent = finder.find(data.otherNode.parent.data.id)
		current = finder.find(data.otherNode.data.id)
		target = finder.find(node.data.id)
		targetParent = finder.find(node.parent.data.id)


		# console.log "Parent: #{parent.title}"
		# console.log "Current: #{current.title}"
		# console.log "Target: #{target.title}"
		# console.log "TargetParent: #{targetParent.title}"
		# console.log hitMode


		# Update view model
		# Remove current element first
		if parent
			parent.children.remove current
		tree.children.remove current

		if targetParent
			targetParent.children.remove current

		# Just push at target end
		if hitMode is 'over'
			log hitMode
			log "Target: #{target.title}"
			log "Current: #{current.title}"
			target.children.push current

		# Insert before target - at target parent
		if hitMode is 'before'
			if targetParent
				# Move over some node
				index = targetParent.children.indexOf target
				targetParent.children.splice index, 0, current
			else
				# Move over root node
				index = tree.children.indexOf target
				tree.children.splice index, 0, current
			# console.log "indexOf: #{index} (before)"

		# Simply push at the end - but at targetParent
		if hitMode is 'after'
			if targetParent
				targetParent.children.push current
			else
				tree.children.push current

		# NOTE: This could possibly work, but it doesn't.
		# This would update whole tree with new data. Some infinite recursion occurs.
		# @handle element, valueAccessor, allBindingsAccessor

		handler = () =>
			el.fancytree 'option', 'source', tree.children
			el.fancytree('getRootNode').visit (node) ->
				node.setExpanded true
			el.focus()
			log 'update tree..'

		setTimeout handler, 0
		# Move fancytree node separatelly
		# data.otherNode.moveTo(node, hitMode)

			# Expand node as it looks better if it is expanded after drop

		return true
