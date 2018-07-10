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

	ensureHrefOn = (element) ->
		if not element.href
			attr = document.createAttribute('href')
			attr.value = ''
			element.setAttributeNode(attr)
			element.setAttribute('href', '')
			jQuery(element).attr('href', '')

	init: (element, valueAccessor, allBindingsAccessor, context) =>

		href = @getValue(valueAccessor)

		# Add href attribute if binding have some value
		if not element.href and href
			ensureHrefOn element

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
			ensureHrefOn element
			if element.getAttribute('href') isnt href
				element.setAttribute 'href', href
			if element.getAttribute('target') isnt target
				element.setAttribute 'target', target
		else
			# Remove attribute if empty
			element.removeAttribute 'href'