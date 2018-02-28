#
# Href binding handler
#
class @Maslosoft.Binder.Href extends @Maslosoft.Binder.Base

	bustLinks = (element) ->
		defer = () ->
			for innerLink in jQuery(element).find('a')
				$il = jQuery(innerLink)
				$il.replaceWith($il.contents())
		setTimeout defer, 0

	init: (element, valueAccessor, allBindingsAccessor, context) =>
		if not element.href
			element.setAttribute('href', '')
		if element.tagName.toLowerCase() isnt 'a'
			console.warn('href binding should be used only on `a` tags')

		bustLinks element

		# Stop propagation handling
		stopPropagation = allBindingsAccessor.get('stopPropagation') or false
		if stopPropagation
			ko.utils.registerEventHandler element, "click", (e) ->
				e.stopPropagation()

	update: (element, valueAccessor, allBindings) =>

		bustLinks element

		href = @getValue(valueAccessor)
		target = allBindings.get('target') or ''
		if element.href isnt href
			element.href = href
		if element.target isnt target
			element.target = target