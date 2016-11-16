
class Maslosoft.Ko.Balin.Widgets.TreeGrid.Events

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	constructor: (@grid, context) ->
	
		if not @grid.config.on
			return