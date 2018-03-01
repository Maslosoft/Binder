
class Maslosoft.Binder.Widgets.TreeGrid.Dnd

	#
	# Tree grid view instance
	#
	# @var Maslosoft.Binder.Widgets.TreeGrid.TreeGridView
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
	# @var Maslosoft.Binder.Widgets.TreeGrid.DropIndicator
	#
	indicator = null

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

	#
	# Whether drop event occured, this is required for edge cases
	# @var boolean
	#
	didDrop = false

	constructor: (@grid) ->
		
		# DND must be explicitly enabled
		if not @grid.config.dnd
			return

		if @grid.context is 'init'
			# handle disposal
			ko.utils.domNodeDisposal.addDisposeCallback @grid.element.get(0), () ->
				try
					if @grid.element
						@grid.element.draggable("destroy")
						@grid.element.droppable("destroy")
				catch e
					console.log e.message

			@grid.element.on 'mousemove', '> tr', @move

		if not indicator
			indicator = new Maslosoft.Binder.Widgets.TreeGrid.DropIndicator @grid

		defer = () =>
			draggableOptions = {
				handle: '.tree-grid-drag-handle'
				cancel: '.expander, input, *[contenteditable], .no-drag'
				revert: false
				cursor: 'pointer'
				cursorAt: { top: 5, left: 5 }
				start: @dragStart
				drag: @drag
				stop: @stop
				helper: @dragHelper
			}
			droppableOptions = {
				tolerance: "pointer"
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
		# data = ko.dataFor e.target
		# console.log "Started #{data.title}"

	drag: (e, helper) =>

	#
	# Drop if stopped dragging without dropping
	# This is required when dragging near top or bottom of container
	#
	#
	stop: (e, ui) =>
		if not didDrop
			@drop e, ui

	#
	# Drop in a normal manner, see also `stop` for edge case
	#
	drop: (e, ui) =>
		didDrop = true

		if not dragged
			return @clear()
		if not draggedOver
			return @clear()
		if not draggedOver.get(0)
			return @clear()
		current = ko.dataFor dragged
		over = ko.dataFor draggedOver.get(0)

		if not @grid.canDrop dragged, draggedOver, hitMode
			return @clear()

		@grid.freeze()

		overParent = @grid.getParent over
		root = @grid.getRoot()

		# console.log "Drop #{current.title} over #{over.title}"
		# console.log arguments
#		log "CURR " + current.title
#		log "OVER " + over.title
#		log "PRNT " + overParent.title
#		log "HITM " + hitMode

		if overParent.children
			# Model initialized
			parentChilds = overParent.children
		else
			# Array initialized
			parentChilds = overParent

		dropDelay = () =>

			@grid.remove current

			if hitMode is 'over'
				# Most obvious case, when dragged node is directly over
				# dropped node, insert current node as it's last child
				over.children.push current

			if hitMode is 'before'
				# Insert node before current node, this is case when
				# insert mark is before dragged over node
				index = parentChilds.indexOf over
				parentChilds.splice index, 0, current

			if hitMode is 'after'

				# When node has children, then add just at beginning
				# to match visual position of dragged node
				if over.children.length
					parentChilds.splice 0, 0, current
				else
					# When not having children, it means that node is
					# last on the level so insert as a last node
					parentChilds.push current

			# Special case for last item. This allow adding node to top
			# level on the end of tree. Without this, it would be
			# impossible to move node to the end if last node is not top node.
			#
			# TODO for some reason view does not update on push
			#
			if hitMode is 'last'
#				log "Delayed Drop on end of table..."
				if root.children
					root.children.push current
				else
					#
					#
					# TODO Neither push or splice at end works!
					# It *does* add to view model but does not update UI!
					# However splice at beginning works properly!!!111
					#
					#

#					root.splice root.length, 0, current
					root.push current

			@clear()

		# Delay a bit to reduce flickering
		# See also TreeGridView.thaw() - this value should be lower than that in thaw
		dropDelay()
#		setTimeout dropDelay, 50

	#
	# Handle over state to get element to be about to be dropped
	# This is bound to dropable `over`
	#
	over: (e) =>
		# Don't stop propagation, just detect row
		if e.target.tagName.toLowerCase() is 'tr'

			# Limit updates to only when dragging over different items
			if draggedOver isnt e.target
				draggedOver = jQuery e.target
				@dragOver e

	#
	# On drag over, evaluated only if entering different element or hit mode
	#
	# 
	#
	#
	#
	dragOver: (e) =>
		if indicator
			indicator.precise.over dragged, draggedOver, hitMode, indicator

	#
	# Move handler for mousemove for precise position calculation
	# * Detect over which tree element is cursor and if it's more
	# on top/bottom edge or on center
	#
	move: (e) =>
		if dragged
			# Dragged over itself must be handled here,
			# as it is not evaluated on `over`
			if e.currentTarget is dragged
				if not draggedOver or dragged isnt draggedOver.get(0)
					# console.log dragged
					e.target = dragged
					@over e

		if draggedOver
			
			offset = draggedOver.offset()

			pos = {}
			pos.x = e.pageX - offset.left
			pos.y = e.pageY - offset.top

			rel = {}
			rel.x = pos.x / draggedOver.outerWidth(true)
			rel.y = pos.y / draggedOver.outerHeight(true)
			hitMode = 'over'
			if rel.y > 0.65
				hitMode = 'after'
			if rel.y <= 0.25
				hitMode = 'before'

			if hitMode is 'after'
				# Last elem and after - switch to last hitmode
				if @grid.isLast(ko.dataFor(draggedOver.get(0)))
					hitMode = 'last'

			# Rate limiting for hit mode
			if prevHitMode isnt hitMode
				prevHitMode = hitMode
				e.target = draggedOver
				@dragOver e


	#
	# Reset apropriate things on drop
	#
	#
	clear: () =>
		@grid.thaw()
		draggedOver = null
		dragged = null
		hitMode = null
		prevHitMode = null
		didDrop = false
		# Destroy helpers and indicators
		if @helper
			@helper.hide()
			@helper = null
		if indicator
			indicator.hide()

	#
	# Initialize drag helper
	#
	#
	dragHelper: (e) =>
		
		tbody = jQuery(e.currentTarget).parent()
		cell = tbody.find('.tree-grid-drag-handle').parents('td').first()
		item = cell.clone()
		item.find('.expander .expanded').remove()
		item.find('.expander .collapsed').remove()
		item.find('.expander').remove()
		item.find('.no-expander').remove()
		dropIndicator = "<span class='drop-indicator'>&times;</span>"
		@helper = jQuery("<div style='white-space:nowrap;'>#{dropIndicator}#{item.html()}</div>")
		@helper.css("pointer-events","none")
		
		indicator.attach @helper.find('.drop-indicator')
		return @helper

