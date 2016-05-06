
class TreeEvents
	#
	# Events defined by binding
	#
	events: null

	#
	# Drop event is handled differently
	# 
	#
	dropEvent: null

	#
	# Fancy tree options
	#
	#
	options: null

	# Private

	#
	# Finder instance
	# @var TreeNodeFinder
	#
	finder = null

	# Check whether should handle event
	doEvent = (data) ->

		# For most events just do event it has no target
		if typeof(data.targetType) is 'undefined'
			return true

		# For click and double click react only on title and icon click
		if data.targetType is 'title'
			return true
		if data.targetType is 'icon'
			return true

	# Stop event propagation
	stop = (event) ->
		event.stopPropagation()

	constructor: (initialTree, @events, @options) ->
		finder = new TreeNodeFinder initialTree

		@handle 'click'
		@handle 'dblclick'
		@handle 'activate'
		@handle 'deactivate'

	# Drop event
	drop: (node, data) =>
		log "Drop..."
		log @events
		if @events.drop
			@dropEvent = new @events.drop(node, data)
			log @dropEvent

	#
	# Handler to possibly recreate/transform node
	#
	#
	getNode: (node) =>
		log "Tree event drop..."
		log @dropEvent
		if @dropEvent and @dropEvent.getNode
			return @dropEvent.getNode node
		else
			return node

	handle: (type) =>
		if @events[type]
			@options[type] = (event, data) =>
				if doEvent data
					model = finder.find data.node.data.id
					@events[type] model, data, event
					stop event
