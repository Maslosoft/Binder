class TreeNodeFinder
	# Private
	cache = new TreeNodeCache
	trees = []
	
	constructor: (initialTree) ->
		trees.push initialTree
		log trees

	findNode = (node, id) ->
		if typeof(id) is 'undefined'
			return false
		if found = cache.get id
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
		for tree in trees
			node = findNode tree, id
			if node
				return node
		return false
		
