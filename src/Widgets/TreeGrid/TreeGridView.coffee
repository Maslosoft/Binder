
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
			ctx = ko.contextFor @element.get(0)
			model = ctx.tree
			callback null, model
			for child in model.children
				callback model, child
				@visitRecursive callback, child
		else
			for child in model.children
				callback model, child
				@visitRecursive callback, child

	getParent: (model) =>
		found = null
		one = (parent, data) ->
			if data is model
				found = parent
		@visitRecursive one
		return found

	remove: (model) =>
		one = (parent, data) ->
			if parent and parent.children
				parent.children.remove model
				
		@visitRecursive one

	expandAll: () ->

	collapseAll: () ->
