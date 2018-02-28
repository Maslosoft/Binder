

class Maslosoft.Binder.Widgets.TreeGrid.DropIndicator

	#
	# Precise indicator holder
	# @var Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator
	#
	@precise: null

	#
	# Indicator element instance boud to draggable
	# @var jQuery element
	#
	@element: null

	constructor: (@grid) ->

		@precise = new Maslosoft.Binder.Widgets.TreeGrid.InsertIndicator @grid

	attach: (@element) ->
		@element.css 'font-size': '1.5em'
		@element.css 'width': '1em'
		@element.css 'height': '1em'
		@element.css 'position': 'absolute'
		# 1/2 of font size
		@element.css 'left': '-.75em'
		# 1/4 of font size
		@element.css 'top': '-.35em'

	hide: () ->
		@element.hide()
		@precise.hide()

	show: () ->
		@element.show()
		@precise.show()

	accept: () ->
		@element.html('&check;')
		@element.css 'color': 'green'
		@precise.accept()

	deny: () ->
		@element.html('&times;')
		@element.css 'color': 'red'
		@precise.deny()