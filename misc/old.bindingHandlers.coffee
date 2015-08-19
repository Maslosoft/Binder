

# Knockout stuff
#
# TODO Add model attribute binding, to bind to model, but update only if id (and language if i18n field!) from binding and model are the same
# Example: data-bind="model:app.model.Page, field:'title', id:50885d0a06cffcac0e000000"
# In yii: MHtml::bindField($model, 'title')
#
# TODO Add link binding with params:
# text = for link text
# html = for link html, exclusive with 'text'
# href = for link href
# if = use only if true, if false, dont even 'text' or 'href'
# and _maybe_:
#	show = if true show link, else hide
# usage: <a data-bind="link: {text: model.title, href: model.url, if: model.id() == 1}" href="/some/url/">link text</a>
#
# Two-way htmlValue binding - use this for contenteditabe elements
# http://stackoverflow.com/questions/7904522/knockout-content-editable-custom-bindi

#
# HTML Value two way binding
# NOTE: This require parent context
# This will work:
# <div data-bind="with: my.vm"><span data-bind="htmlValue: text"></span></div>
# This not:
# <span data-bind="htmlValue: my.vm.text"></span>
#
#
#
#
"use strict"
#
# FIXME: htmlValue is messed up if combined with observable arrays!
#
ko.bindingHandlers.htmlValue =
	init: (element, valueAccessor, allBindingsAccessor, context) ->
		handler = ->
			modelValue = valueAccessor()
			elementValue = $.trim(element.innerHTML)
			if ko.isWriteableObservable(modelValue)
				modelValue(elementValue)
			else #handle non-observable one-way binding
				allBindings = allBindingsAccessor()
				allBindings["_ko_property_writers"].htmlValue elementValue	if allBindings["_ko_property_writers"] and allBindings["_ko_property_writers"].htmlValue
			return


		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup", handler
		ko.utils.registerEventHandler document, "change.content", handler

		# This is to allow interation with tools which could modify content
		$(document).on "click", handler
		return

	update: (element, valueAccessor) ->
		value = ko.unwrap(valueAccessor()) or ""
		$element = jQuery(element)
		if $element.html() isnt value
			$element.html(value)
		return


ko.bindingHandlers.textValue =
	init: (element, valueAccessor, allBindingsAccessor, context) ->
		handler = ->
			modelValue = valueAccessor()
			elementValue = $(element).text()
			if ko.isWriteableObservable(modelValue)
				modelValue elementValue
			else #handle non-observable one-way binding
				allBindings = allBindingsAccessor()
				allBindings["_ko_property_writers"].textValue elementValue	if allBindings["_ko_property_writers"] and allBindings["_ko_property_writers"].textValue
			return


		# NOTE: Event must be bound to parent node to work if parent has contenteditable enabled
		ko.utils.registerEventHandler element, "keyup", handler
		ko.utils.registerEventHandler document, "change.content", handler

		# This is to allow interation with tools which could modify content
		$("body").on "click", handler
		return

	update: (element, valueAccessor) ->
		value = ko.unwrap(valueAccessor()) or ""
		$element = jQuery(element)
		if $element.text() isnt value
			$element.text(value)
			if hljs
				hljs.highlightBlock(element)
		return


###
Image src binding
###
ko.bindingHandlers.src =
	update: (element, valueAccessor) ->
		src = ko.unwrap(valueAccessor())
		$element = $(element)
		if $element.attr("src") != src
			$element.attr "src", src
		return

	init: (element, valueAccessor) ->


###
Icon binding for models with icon
###
ko.bindingHandlers.icon =
	update: (element, valueAccessor, allBindings) ->
		$element = $(element)
		model = ko.unwrap(valueAccessor())

		iconField = allBindings.get("iconField") or 'icon'
		src = model[iconField]

		if typeof model.iconSize is 'undefined'
			defaultSize = 16
		else
			defaultSize = model.iconSize

		size = allBindings.get("iconSize") or defaultSize
		regex = new RegExp("/" + defaultSize + "/", "g")

		if typeof model.isImage is 'undefined'
			isImage = true
		else
			isImage = model.isImage
		if isImage
			# End with /
			if not src.match(new RegExp("/$"))
				src = src + '/'
			# Dimentions are set
			if src.match(new RegExp("/w/", "g"))
				src = src.replace(regex, "/" + size + "/")
			# Dimentions are not set, set it here
			else
				src = src + "w/#{size}/h/#{size}/p/0/"
			src = src + model.updateDate.sec
		else
			fixedSize = 16
			if size > 16
				fixedSize = 32
			if size > 32
				fixedSize = 48
			if size > 48
				fixedSize = 512
			src = src.replace(regex, "/" + fixedSize + "/")
		if $element.attr("src") != src
			$element.attr "src", src
		$element.css
			maxWidth: size
			maxHeight: size

		return

	init: (element, valueAccessor) ->

###
Link href binding
###
ko.bindingHandlers.href =
	init: (element, valueAccessor) ->
#		$(element).click (e) ->
#			document.location = e.target.href
#			e.stopPropagation()

	update: (element, valueAccessor) ->
		href = ko.unwrap valueAccessor()
		$(element).attr "href", href
		return

###
Tooltip binding
###
ko.bindingHandlers.tooltip =
	init: (element, valueAccessor) ->

	update: (element, valueAccessor) ->
		title = ko.unwrap valueAccessor()
		$(element).attr "title", title
		$(element).attr "rel", "tooltip"
		return


###
Asset binding, for easy binding of images with optional w[idth], h[eight] and p[roportional]
###
ko.bindingHandlers.asset =
	init: (element, valueAccessor, allBindings, viewModel, bindingContext) ->

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) ->
		$element = $(element)
		width = ko.unwrap allBindings.get 'w' or allBindings.get 'width' or null
		height = ko.unwrap allBindings.get 'h' or allBindings.get 'height' or null
		proportional = ko.unwrap allBindings.get 'p' or allBindings.get 'proportional' or null

		model = ko.unwrap valueAccessor()
		date = ko.unwrap model.updateDate
		sec = ko.unwrap date.sec
		url = ko.unwrap model.url

		src = []
		src.push url
		if width
			src.push "w/#{width}"
		if height
			src.push "h/#{height}"
		if proportional is not null
			if not proportional
				src.push "p/0"
		src.push sec

		src = src.join '/'

		if $element.attr("src") != src
			$element.attr "src", src
		return


###
Opposite to visible binding
###
ko.bindingHandlers.hidden = update: (element, valueAccessor) ->
	ko.bindingHandlers.visible.update element, ->
		not ko.unwrap valueAccessor

ko.bindingHandlers.widget =
	init: (element, valueAccessor) ->
		controlsDescendantBindings: true

	update: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) ->
		value = ko.unwrap valueAccessor
		if not value or not value.data
			console.warn "Empty template value"
			return
		unless value.data[value.field]
			console.warn "Wrong template field selected: " + value.field
			return

		templateName = value.data[value.field]
		dataValue = ko.unwrap value.data
		innerBindingContext = bindingContext["createChildContext"](dataValue)
		unless templateName
			console.warn "Template name is undefined"
			return

		#console.log('Loading template: ' + templateName);
		# This puts rendering of template to end of queue.
		# This is to avoid binding errors while new template is assigned to old widget data
		setTimeout (->
			ko.renderTemplate templateName, innerBindingContext, {}, element
			return
		), 0
		return


###
One-way date mongo formatter
###
ko.bindingHandlers.dateFormatter =
	init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		moment.lang app.config.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		value = ko.unwrap(valueAccessor()) or ""
		value = value.sec
		element.innerHTML = moment.unix(value).format(app.config.format.dateLc)
		return


###
One-way date time mongo formatter
###
ko.bindingHandlers.dateTimeFormatter =
	init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		moment.lang app.config.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		value = ko.unwrap(valueAccessor()) or ""
		value = value.sec
		element.innerHTML = moment.unix(value).format(app.config.format.dateTimeLc)
		return


###
One-way time a go mongo date formatter
###
ko.bindingHandlers.timeAgoFormatter =
	init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		moment.lang app.config.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		value = ko.unwrap(valueAccessor()) or ""
		value = value.sec
		element.innerHTML = moment.unix(value).fromNow()
		return

ko.bindingHandlers.enumFormatter =
	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		config = ko.unwrap valueAccessor()
		key = ko.unwrap config.data
		values = ko.unwrap config.values
		element.innerHTML = values[key]
		return

ko.bindingHandlers.enumCssClassFormatter =
	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		config = ko.unwrap valueAccessor()
		key = ko.unwrap config.data
		values = ko.unwrap config.values
		element.class = values[key]
		return


###
One-way duration mongo date formatter
###
ko.bindingHandlers.duration =
	init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		moment.lang app.config.lang
		return

	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		value = ko.utils.unwrap(valueAccessor) or ""
		from = ko.unwrap(value.from.sec)
		to = ko.unwrap(value.to.sec)
		duration = moment.unix(from).diff(moment.unix(to))

		element.innerHTML = moment.duration(duration).humanize()
		return



###
Datetime binding for form elements
###
do ->
	validate = (element, value, time) ->
		if time.isValid()
			value time.unix()
			element.parent().parent().removeClass "error"
			return true
		else
			element.parent().parent().addClass "error"
			element.parent().parent().removeClass "success"
			return false

	ko.bindingHandlers.dateTime =
		init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
			$element = jQuery(element)
			handler = ->
				value = valueAccessor().sec
				dt = moment(element.value, app.config.format.dateTime)
				validate $element, value, dt

			$element.mask app.config.format.dateTime,
				completed: handler

			ko.utils.registerEventHandler element, "focusout", handler
			return

		update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
			value = ko.utils.unwrap(valueAccessor) or ""
			value = value.sec
			element.value = moment.unix(value).format(app.config.format.dateTime)
			return
	###
	Date form binding
	###
	ko.bindingHandlers.date =
		init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
			$element = jQuery(element)
			handler = ->
				value = valueAccessor().sec
				dt = moment(element.value, app.config.format.date)

				# Preserve time value
				timeVal = moment.unix(value())
				dateVal = moment.unix(value()).startOf('day')
				timeDiff = timeVal.unix() - dateVal.unix()

				dt.add('s', timeDiff)

				validate $element, value, dt

			$element.mask app.config.format.date,
				completed: handler

			ko.utils.registerEventHandler element, "focusout", handler
			return

		update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
			value = ko.unwrap(valueAccessor()) or ""
			value = value.sec
			element.value = moment.unix(value).format(app.config.format.date)
			return

	###
	Time form binding
	###
	ko.bindingHandlers.time =
		init: (element, valueAccessor, allBindingsAccessor, viewModel) ->
			$element = jQuery(element)
			handler = ->
				value = valueAccessor().sec
				dt = moment(element.value, app.config.format.time)

				#	Preserve date value
				dateVal = moment.unix(value()).startOf('day')
				dateDiff = moment().startOf('day').unix() - dateVal.unix()
				dt.subtract('s', dateDiff)

				validate $element, value, dt

			$element.mask app.config.format.time,
				completed: handler

			ko.utils.registerEventHandler element, "focusout", handler
			return

		update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
			value = ko.unwrap(valueAccessor()) or ""
			value = value.sec
			element.value = moment.unix(value).format(app.config.format.time)
			return



###
File size formatter
###
ko.bindingHandlers.fileSizeFormatter =
	init: (element, valueAccessor, allBindingsAccessor, viewModel) ->

	update: (element, valueAccessor, allBindingsAccessor, viewModel) ->
		value = ko.unwrap(valueAccessor()) or ""
		format = (bytes) ->
			i = -1
			units = [
				" kB"
				" MB"
				" GB"
				" TB"
				"PB"
				"EB"
				"ZB"
				"YB"
			]
			loop
				bytes = bytes / 1024
				i++
				break unless bytes > 1024
			Math.max(bytes, 0.1).toFixed(1) + units[i]

		element.innerHTML = format(value)
		return

# See http://jsfiddle.net/jJ3e9/2/
# Example usage <div data-bind="on: { click: 'a', invoke: countClicks }">
ko.bindingHandlers.on =
	init: (element, valueAccessor, allBindings, viewModel) ->
		config = valueAccessor()
		handler = createEventHandlerFor(viewModel, config.invoke)
		delete config.invoke;
		domNode = $(element);
		for event in config
			if config.hasOwnProperty(event)
				domNode.on(event, config[event], handler);

###
Fancytree binding handler
###
do ->
	class Fancytree

		tree: null
		element: null

		init: (element, valueAccessor, allBindingsAccessor, context) =>

		update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
			options = {
				autoExpand: true
			}
			element = jQuery element

			handler = () =>

				if element.find('.ui-fancytree').length == 0
					return

				element.fancytree 'option', 'source', valueAccessor()
#				element.fancytree('getTree').getTree()
#				element.fancytree('getTree').reload(dp)
				#element.fancytree('getTree').init()
				if options.autoExpand
					element.fancytree('getRootNode').visit (node) ->
						node.setExpanded true
				element.focus()
			setTimeout handler, 0

	ko.bindingHandlers.fancytree = new Fancytree
