
class Maslosoft.Ko.Balin.Widgets.TreeGrid.Dnd

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView
	#
	grid: null

	#
	# Drag helper
	#
	# @var jQuery element
	#
	helper: null

	#
	# Drop indicator
	#
	# @var Maslosoft.Ko.Balin.Widgets.TreeGrid.DropIndicator
	#
	indicator: null

	#
	# Element over which currently item is dragged
	# @var HTMLElement
	#
	draggedOver = null

	#
	# Element currently dragged
	# @var HTMLElement
	#
	dragged = null

	constructor: (@grid) ->
		new Maslosoft.Ko.Balin.Widgets.TreeGrid.InsertIndicator @grid
		# DND must be explicitly enabled
		if not @grid.config.dnd
			return

		if @grid.context is 'init'
			# handle disposal
			ko.utils.domNodeDisposal.addDisposeCallback @grid.element.get(0), () ->
				@grid.element.draggable("destroy")
				@grid.element.droppable("destroy")

		defer = () =>
			draggableOptions = {
				handle: '.tree-grid-drag-handle'
				cancel: '.expander'
				revert: true
				cursor: 'pointer'
				cursorAt: { top: 5, left: 5 }
				start: @dragStart
				drag: @drag
				helper: @dragHelper
			}
			droppableOptions = {
				drop: @drop
				over: @over
			}
			@grid.element.find('> tr').draggable(draggableOptions)
			@grid.element.find('> tr').droppable(droppableOptions)

		setTimeout defer, 0

	#
	# On drag start
	#
	#
	dragStart: (e) =>
		dragged = e.target
		data = ko.dataFor e.target
		console.log "Started #{data.title}"
	#
	# On drag stop
	#
	#
	dragStop: (e) =>

		# Destroy helpers and indicators
		@helper = null
		@indicator = null

	#
	# On drag over, evaluated only if entering different element
	#
	# * Detect over which tree element is cursor
	#
	#
	#
	dragOver: (e) =>
		data = ko.dataFor e.target
#		console.log "Dragged over #{data.title}"
		if @indicator
			# FIXME TEMP Allow dropping only on items not containing `t` in title
			if data.title.toLowerCase().indexOf('t') is -1
				@indicator.accept()
			else
				@indicator.deny()

	
	drag: (e, helper) =>
#		log e.target
#		console.log helper

	drop: (e) =>
		data = ko.dataFor dragged
		overData = ko.dataFor draggedOver
		console.log "Drop #{data.title} over #{overData.title}"
		console.log arguments

		overData.children.push data

	#
	# Handle over state to get element to be about to be dropped
	#
	over: (e) =>
		
		# Dont stop propagation, just detect row
		if e.target.tagName.toLowerCase() is 'tr'

			# Limit updates to only when dragging over different items
			if draggedOver isnt e.target
				draggedOver = e.target
				@dragOver e

	dragHelper: (e) =>
		if @helper
			return @helper
		tbody = jQuery(e.currentTarget).parent()
		cell = tbody.find('.tree-grid-drag-handle').parents('td').first()
		item = cell.clone()
		item.find('.expander .expanded').remove()
		item.find('.expander .collapsed').remove()
		item.find('.expander').remove()
		item.find('.no-expander').remove()
		indicator = "<span class='drop-indicator'>&times;</span>"
		@helper = jQuery("<div style='white-space:nowrap;'>#{indicator}#{item.html()}</div>")
		@helper.css("pointer-events","none")
		@indicator = new Maslosoft.Ko.Balin.Widgets.TreeGrid.DropIndicator @grid, @helper.find('.drop-indicator')
		new Maslosoft.Ko.Balin.Widgets.TreeGrid.InsertIndicator @grid
		return @helper