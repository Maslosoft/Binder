
class Maslosoft.Binder.Widgets.TreeGrid.Events

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	constructor: (@grid, context) ->
	
		if not @grid.config.on
			return