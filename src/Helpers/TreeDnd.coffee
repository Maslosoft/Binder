#
# Tree drag and drop helper
# @internal
#
class TreeDnd

	@findNode: (startNode, id) ->
		if startNode.id is id or startNode._id is id
			return startNode
		if startNode.children and startNode.children.length > 0
			for childNode in startNode.children
				foundNode = TreeDnd.findNode(childNode, id)
				if foundNode isnt false
					return foundNode
		return false

	@moveTo: (parent, current, target, targetParent, hitMode) ->

		# Remove current element first
		index = targetParent.children.indexOf target
		
		parent.children.remove current

		# Just push at target end
		if hitMode is 'over'
			target.children.push current
			TreeDnd.log target
			return true

		# Insert before target - at target parent
		if hitMode is 'before'
			index = targetParent.children.indexOf target
			targetParent.children.splice index, 0, current
			TreeDnd.log targetParent
			# console.log "indexOf: #{index} (before)"
			return true

		# Simply push at the end - but at targetParent
		if hitMode is 'after'
			targetParent.children.push current
			TreeDnd.log targetParent
			return true

		# console.log "Parent: #{parent.title}"
		# console.log "Current: #{current.title}"
		# console.log "Target: #{target.title}"
		# console.log "TargetParent: #{targetParent.title}"
		# console.log hitMode

	@log: (node) ->
		return # Comment to log
		log "Node: #{node.title}"
		children = []
		if node.children and node.children.length > 0
			for childNode in node.children
				children.push childNode.title
			log "Children: #{children.join(',')}"
