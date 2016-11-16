
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
	# @var jQuery element
	#
	draggedOver = null

	#
	# Element currently dragged
	# @var HTMLElement
	#
	dragged = null

	#
	# Hit mode
	# @var string
	#
	hitMode = null

	#
	# Previous hit mode, this is used for rate limit of hitMode detection
	# @var string
	#
	prevHitMode = null

	constructor: (@grid) ->
		
		# DND must be explicitly enabled
		if not @grid.config.dnd
			return

		if @grid.context is 'init'
			# handle disposal
			ko.utils.domNodeDisposal.addDisposeCallback @grid.element.get(0), () ->
				@grid.element.draggable("destroy")
				@grid.element.droppable("destroy")

			@grid.element.on 'mousemove', '> tr', @move

		defer = () =>
			draggableOptions = {
				handle: '.tree-grid-drag-handle'
				cancel: '.expander'
				revert: true
				cursor: 'pointer'
				cursorAt: { top: 5, left: 5 }
				start: @dragStart
				drag: @drag
				stop: @dragStop
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

		@clear()

	#
	# On drag over, evaluated only if entering different element or hit mode
	#
	# 
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

			@indicator.precise.over draggedOver, hitMode

	
	drag: (e, helper) =>
#		log e.target
#		console.log helper

	drop: (e) =>
		
		data = ko.dataFor dragged
		overData = ko.dataFor draggedOver.get(0)
		console.log "Drop #{data.title} over #{overData.title}"
		console.log arguments

		
		if hitMode is 'over'
			@grid.remove data
			overData.children.push data
		if hitMode is 'before'
			console.log 'insert before...'
		if hitMode is 'after'
			console.log 'insert after...'
		@clear()

	#
	# Handle over state to get element to be about to be dropped
	# This is bound to droppable `over`
	#
	over: (e) =>
	
		# Dont stop propagation, just detect row
		if e.target.tagName.toLowerCase() is 'tr'

			# Limit updates to only when dragging over different items
			if draggedOver isnt e.target
				draggedOver = jQuery e.target
				@dragOver e

	#
	# Move handler for mousemove for precise position calculation
	# * Detect over which tree element is cursor
	#
	move: (e) =>
		if draggedOver
			offset = draggedOver.offset()

			pos = {}
			pos.x = e.pageX - offset.left
			pos.y = e.pageY - offset.top

			rel = {}
			rel.x = pos.x / draggedOver.width()
			rel.y = pos.y / draggedOver.height()
			hitMode = 'over'
			if rel.y > 0.75
				hitMode = 'after'
			if rel.y <= 0.25
				hitMode = 'before'

			# Rate limiting for hit mode
			if prevHitMode isnt hitMode
				prevHitMode = hitMode
				#	console.log rel.y
				console.log hitMode


	#
	# Reset apropriate things on drop
	#
	#
	clear: () =>
		draggedOver = null
		dragged = null

		# Destroy helpers and indicators
		if @helper
			@helper.hide()
			@helper = null
		if @indicator
			@indicator.hide()
			@indicator = null

	dragHelper: (e) =>
		log e.pageX
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
		return @helper