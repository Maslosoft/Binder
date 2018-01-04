
#
# Insert indicator
#
#
#

class Maslosoft.Ko.Balin.Widgets.TreeGrid.InsertIndicator

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	#
	#
	# @private
	# @static
	#
	initialized = false

	#
	# Indicator main wrapper
	# @var jQuery element
	# @private
	# @static
	#
	indicator = null

	#
	# Indicator coarse item
	# @var jQuery element
	# @private
	# @static
	#
	coarse = null

	#
	# Indicator precise item
	# @var jQuery element
	# @private
	# @static
	#
	precise = null

	constructor: (@grid) ->

		if not initialized
			@create()
			initialized = true

	hide: () ->
		indicator.hide()

	show: () ->
		indicator.show()

	accept: () ->
		indicator.css color: 'green'

	deny: () ->
		indicator.css color: 'red'

	#
	# Place over element, with hitMode param
	#
	#
	over: (dragged, draggedOver, hitMode = 'over', accepter) ->

		@accept()
		accepter.accept()

		if hitMode is 'over'
			@precise false
		else
			@precise true

		if @grid.canDrop dragged, draggedOver, hitMode
			@accept()
			accepter.accept()
		else
			@deny()
			accepter.deny()

		node = draggedOver.find('.tree-grid-drag-handle')

		widthOffset = 0
		midFactor = 1.5

		offset = node.offset()
		mid = indicator.outerHeight(true) / midFactor
		
		if hitMode is 'over'
			nodeMid = node.outerHeight(true) / midFactor
			top = offset.top + nodeMid - mid

		if hitMode is 'before'
			top = offset.top - mid

		if hitMode is 'after'
			top = offset.top + node.outerHeight(true) - mid

		left = offset.left + widthOffset

		indicator.css left: left
		indicator.css top: top

		@show()


	#
	# Show or hide precise indicator
	#
	#
	precise: (showPrecise = true) ->
		if showPrecise
			precise.show()
		else
			precise.hide()

	create: () ->
		indicator = jQuery '''
		<div class="tree-grid-insert-indicator" style="display:none;position:absolute;z-index: 10000;color:green;line-height: 1em;">
			<span class="tree-grid-insert-indicator-coarse" style="font-size: 1.5em;">
				&#9654;
			</span>
			<span class="tree-grid-insert-indicator-precise" style="font-size:1.4em;">
				&#11835;
			</span>
		</div>
		'''
		indicator.appendTo 'body'
		coarse = indicator.find '.tree-grid-insert-indicator-coarse'
		precise = indicator.find '.tree-grid-insert-indicator-precise'
		
		indicator.show()