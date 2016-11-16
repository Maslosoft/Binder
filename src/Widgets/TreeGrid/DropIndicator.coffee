

class Maslosoft.Ko.Balin.Widgets.TreeGrid.DropIndicator

	constructor: (@grid, @element) ->
		@element.css 'font-size': '1.5em'
		@element.css 'width': '1em'
		@element.css 'height': '1em'
		@element.css 'position': 'absolute'
		# 1/2 of font size
		@element.css 'left': '-.75em'
		# 1/4 of font size
		@element.css 'top': '-.35em'

	accept: () ->
		@element.html('&check;')
		@element.css 'color': 'green'

	deny: () ->
		@element.html('&times;')
		@element.css 'color': 'red'