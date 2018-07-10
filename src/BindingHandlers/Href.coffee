#
# Href binding handler
#
class @Maslosoft.Binder.Href extends @Maslosoft.Binder.Base

	bustLinks = (element) ->
		# Skip on non anchor elements
		if element.tagName.toLowerCase() isnt 'a'
			return
		defer = () ->
			for innerLink in jQuery(element).find('a')
				$il = jQuery(innerLink)
				$il.replaceWith($il.contents())
		setTimeout defer, 0

	init: (element, valueAccessor, allBindingsAccessor, context) =>

		href = @getValue(valueAccessor)

		# Add href attribute if binding have some value
		if not element.href and href
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

		if href
			target = allBindings.get('target') or ''
			# Ensure attribute
			if not element.href
				element.setAttribute('href', '')
			if element.href isnt href
				element.href = href
			if element.target isnt target
				element.target = target
		else
			# Remove attribute if empty
			element.removeAttribute 'href'