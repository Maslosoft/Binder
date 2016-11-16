
class Maslosoft.Ko.Balin.Widgets.TreeGrid.Expanders

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	constructor: (@grid, context) ->

		# Expanders explicitly disabled
		if @grid.config.expanders is false
			return

		# Initialize click handlers only on init
		if @grid.context is 'init'
			@grid.element.on 'mousedown', '.expander', @handler

		if @grid.context is 'update'
			@updateExpanders()

	updateExpanders: () =>

		one = (item, data) =>
			hasChildren = !!data.children.length
			if hasChildren
				item.find('.no-expander').hide()
				item.find('.expander').show()
			else
				item.find('.expander').hide()
				item.find('.no-expander').show()
			item.find('.debug').html data.children.length
		defer = () =>
			@grid.visit one

#		defer()
		setTimeout defer, 0

	handler: (e) =>
		current = ko.contextFor(e.target).$data

		depth = -1
		show = false

		log "clicked on expander #{current.title}"

		initOne = (item, data) =>
			itemDepth = data._treeGrid.depth
			if data is current
				depth = itemDepth
				el = item.find('.expander')
				if el.find('.expanded:visible').length
					el.find('.expanded').hide()
					el.find('.collapsed').show()
					show = false
				else
					el.find('.collapsed').hide()
					el.find('.expanded').show()
					show = true
				# Current item should be left intact, so skip to next item
				return

			# Not found yet, so continue
			if depth is -1 then return

			# Found item on same depth, skip further changes
			if itemDepth is depth
				depth = -1
				return

			# toggle all one depth lower
			if itemDepth - 1 is depth
				if show
					item.show()
				else
					item.hide()

		# TODO 1. Hide also deeper items if parent of them expanded
		# and show them back if parent of them is expanded

		@grid.visit initOne
