
class TreeEvents

	# Private
	tree = null
	finder = null

	doEvent = (data) ->

		# For most events just do event it has no target
		if typeof(data.targetType) is 'undefined'
			return true

		# For click and double click react only on title and icon click
		if data.targetType is 'title'
			return true
		if data.targetType is 'icon'
			return true

	stop = (event) ->
		event.stopPropagation()

	constructor: (initialTree, @events, @options) ->
		tree = initialTree
		finder = new TreeNodeFinder tree

		@handle 'click'
		@handle 'dblclick'
		@handle 'activate'
		@handle 'deactivate'


	handle: (type) =>
		if @events[type]
			@options[type] = (event, data) =>
				if doEvent data
					model = finder.find data.node.data.id
					@events[type] model, data, event
					stop event
