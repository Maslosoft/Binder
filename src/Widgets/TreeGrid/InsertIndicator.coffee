
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

	hide: () ->
		indicator.hide()

	show: () ->
		indicator.show()

	accept: () ->
		indicator.css 'color': 'green'

	deny: () ->
		precise.hide()
		indicator.css 'color': 'red'

	#
	# Place over element, with hitMode param
	#
	#
	over: (element, hitMode = 'over') ->
		@show()
		if hitMode isnt 'over'
			@precise
		else
			@precise false
			
		log element


	#
	# Show or hide precise indicator
	#
	#
	precise: (showPrecise = true) ->
		precise.show()

	create: () ->
		indicator = jQuery '''
		<div class="tree-grid-insert-indicator" style="display:none;position:absolute;color:green;left:0;top:0;">
		<span class="tree-grid-insert-indicator-coarse" style="color:green;font-size: 1.5em;">
			&#9654;
		</span>
		<span class="tree-grid-insert-indicator-precise" style="font-size:1.4em;display:none;">
			&#11835;
		</span>
		</div>
		'''
		indicator.appendTo 'body'
		coarse = indicator.find '.tree-grid-insert-indicator-coarse'
		precise = indicator.find '.tree-grid-insert-indicator-precise'
		
		indicator.show()