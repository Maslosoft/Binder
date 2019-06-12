
class Maslosoft.Binder.Widgets.TreeGrid.Expanders

	#
	# Init expands
	# @return boolean whether is expanded
	#
	initExpand = (item) ->
		el = item.find('.expander')
		if el.find('.expanded:visible').length
			el.find('.expanded').hide()
			el.find('.collapsed').show()
			show = false
		else
			el.find('.collapsed').hide()
			el.find('.expanded').show()
			show = true
		return show

	#
	# Expand expanders
	#
	expand = (item) ->
		el = item.find('.expander')
		el.find('.collapsed').hide()
		el.find('.expanded').show()

	#
	# Collapse expanders
	#
	collapse = (item) ->
		el = item.find('.expander')
		el.find('.expanded').hide()
		el.find('.collapsed').show()

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	constructor: (@grid, context) ->

		# Expanders explicitly disabled
		if @grid.config.expanders is false
			return

		# Initialize click handlers only on init
		if @grid.context is 'init'
			@grid.element.on 'mousedown', '.expander', @handler
			@grid.element.on 'click', '.expander', @cancelClick

		if @grid.context is 'update'
			@updateExpanders()

	updateExpanders: () =>

		one = (item, data) =>
			hasChildren = data.children && data.children.length
			if hasChildren
				item.find('.no-expander').hide()
				item.find('.expander').show()
				item.find('.expander .expanded').show()
			else
				item.find('.expander').hide()
				item.find('.no-expander').show()
#			item.find('.debug').html data.children.length
		defer = () =>
			@grid.visit one

#		defer()
		setTimeout defer, 0

	handler: (e) =>
		current = ko.contextFor(e.target).$data

		# Expanding tree node should not call action
		# @see https://github.com/Maslosoft/Binder/issues/33
		e.stopPropagation()
		e.preventDefault()

		depth = -1
		show = false

		log "clicked on expander #{current.title}"

		initOne = (item, data) =>
			itemDepth = data._treeGrid.depth
			if data is current
				depth = itemDepth
				show = initExpand(item)
				item.data 'treegrid-manual-state', show
				# Current item should be left intact, so skip to next item
				return

			# Not found yet, so continue
			if depth is -1 then return

			# Found item on same depth, skip further changes
			if itemDepth is depth
				depth = -1
				return

			# toggle all one depth lower
			if itemDepth >= depth

				# TODO: Below is a scratch of logic to re-expand or re-collapse
				if false
					# nodes that were manually toggled.
					showChildItems = show

					# Manually expanded/collapsed sub nodes
					# should have state restored
					manuallyToggled = item.data 'treegrid-manual-state'
					if typeof(manuallyToggled) isnt 'undefined'
						console.log manuallyToggled
						showChildItems = manuallyToggled

				if show
					item.show()
					expand item
				else
					item.hide()
					collapse item

		@grid.visit initOne

	# Cancel expander click event, as it reacts on mousedown
	# however click would propagate and call action
	cancelClick: (e) =>
		e.stopPropagation()
		e.preventDefault()
