#
# Html value binding
#
class @Maslosoft.Ko.Balin.HtmlValue extends @Maslosoft.Ko.Balin.Base
#
# FIXME: htmlValue is messed up if combined with observable arrays!
#
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