

# Knockout stuff
#
# TODO ? Add model attribute binding, to bind to model, but update only if id (and language if i18n field!) from binding and model are the same
# Example: data-bind="model:app.model.Page, field:'title', id:50885d0a06cffcac0e000000"
# In yii: MHtml::bindField($model, 'title')
#
# TODO ? Add link binding with params:
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
# TODO As far as i know this is no longer nessesary, as template binding allows observable template name
#
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
