
class Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView

	#
	# Plugins for tree grid
	#
	# NOTE: Order of plugins *might* be important, especially for built-in plugins
	#
	# @var Object[]
	#
	@plugins = [
		Maslosoft.Ko.Balin.Widgets.TreeGrid.Expanders
		Maslosoft.Ko.Balin.Widgets.TreeGrid.Dnd
		Maslosoft.Ko.Balin.Widgets.TreeGrid.Events
	]

	#
	# Tbody element - root of tree
	#
	# @var jQuery element
	#
	element: null

	#
	# Configuration of binding
	#
	# @var Object
	#
	config: null

	constructor: (element, valueAccessor = null, @context = 'init') ->

		@element = jQuery element
		
		if valueAccessor
			@config = {}
			@config = ko.unwrap(valueAccessor())

			for plugin in TreeGridView.plugins
				new plugin(@)

#			console.log data

	#
	# Visit each node and apply callback.
	# Callback accepts two parameters:
	#
	# * element - contains current row jQuery element
	# * data - contains data attached to element
	#
	#
	visit: (callback) ->
		items = @element.find('> tr')
		for item in items
			data = ko.dataFor(item)
			callback(jQuery(item), data)

	#
	# Visit each node starting from tree root and apply callback.
	# Callback accepts two parameters:
	#
	# * parent - contains current element parent item, might be null
	# * data - contains data attached to element
	#
	#
	visitRecursive: (callback, model = null) =>
		if not model
			model = @getRoot()
			callback null, model
			if model.children and model.children.length
				for child in model.children
					callback model, child
					@visitRecursive callback, child
			# Array node
			if model.length
				for child in model
					callback model, child
					@visitRecursive callback, child
		else
			if model.children and model.children.length
				for child in model.children
					callback model, child
					@visitRecursive callback, child
			# Array node
			if model.length
				for child in model
					callback model, child
					@visitRecursive callback, child

	getParent: (model) =>
		found = null

		one = (parent, data) ->
			if data is model
				found = parent
		# Don't set model here to start from root
		@visitRecursive one
		return found

	getRoot: () =>
		ctx = ko.contextFor @element.get(0)
		return ctx.tree

	getContext: () =>
		return ko.contextFor @element.get(0)

	#
	# Check if parent have child
	#
	#
	have: (parent, child) =>

		found = false

		one = (parent, data) ->
			if data is child
				found = true

		# Start from parent here
		@visitRecursive one, parent
		return found

	#
	# Check if it is last on list of table rows
	#
	#
	isLast: (model) =>
		lastRow = @element.find('> tr:last()')
		last = ko.dataFor lastRow.get(0)
		if model is last
			return true
		return false

	#
	# Check if can actually drop on draggedOver
	#
	canDrop: (dragged, draggedOver, hitMode) =>
		current = ko.dataFor dragged
		over = ko.dataFor draggedOver.get(0)

#		log current.title
#		log over.title

		# Allow adding to the end of table
		if hitMode is 'last'
			return true

		# Allow adding to the end of list
		if hitMode is 'after'
			return true

		# Forbid dropping on itself
		if current is over
			return false;

		# Forbid dropping on children of current node
		if @have current, over
			return false

		return true

	remove: (model) =>
		one = (parent, data) ->
			if parent
				# Model initialized
				if parent.children
					parent.children.remove model
				# Array initialized
				else
					parent.remove model

		# Don't set model here to start from root
		@visitRecursive one

	expandAll: () ->

	collapseAll: () ->


	cellsStyles = []

	#
	# Set widths of table cells to strict values.
	# This prevents flickering table when moving nodes.
	#
	#
	freeze: () =>

		# Reset stored width values
		cellsStyles = []
		cells = @element.find('> tr:first() td')

		for cell in cells
#			log cell
			cellsStyles.push cell.style
			$cell = jQuery cell
#			log $cell.width()
			$cell.css 'width', $cell.width() + 'px'


	#
	# Set widths of table cells back to original style, set by freeze()
	#
	#
	thaw: () =>
		defer = () =>
			cells = @element.find('> tr:first-child() td')

			for cell, index in cells
				cell.style = cellsStyles[index]
		# Unfreezing takes some time...
		# This needs to be delayed a bit or flicker will still occur
		setTimeout defer, 150