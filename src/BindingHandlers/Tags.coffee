###
Select2
###
class @Maslosoft.Ko.Balin.Tags extends @Maslosoft.Ko.Balin.Base

	dropdownKillStyles = '''
<style>
	body.kill-all-select2-dropdowns .select2-dropdown {
		display: none !important;
	}
	body.kill-all-select2-dropdowns .select2-container--default.select2-container--open.select2-container--below .select2-selection--single, .select2-container--default.select2-container--open.select2-container--below .select2-selection--multiple
	{
		border-bottom-left-radius: 4px;
		border-bottom-right-radius: 4px;
	}
	.select2-container--default.select2-container--focus .select2-selection--multiple {
		border-color: #66afe9;
		outline: 0;
		-webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
		box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
	}
</style>
'''

	once = true

	setTags: (el, tags) =>
		console.log el.find('option')
		options = el.find('option')
		if options.length
			options.remove()
#		for option, index in el.find('option')

		# Add options, all as selected - as these are our tags list
		for tag, index in tags
				opt = jQuery "<option selected='true'></option>"
				opt.val(tag)
				opt.text(tag)
				el.append opt

	init: (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) =>

		if element.tagName.toLowerCase() isnt 'select'
			throw new Error "Tags binding must be placed on `select` element"

		if once
			console.log once, dropdownKillStyles
			jQuery(dropdownKillStyles).appendTo 'head'
			once = false

		value = @getValue valueAccessor
		copy = JSON.parse JSON.stringify value

		el = jQuery element
		el.data 'tags', true
		el.attr 'multiple', true
		
		@setTags el, copy
		
		config = {
				tags: true
				tokenSeparators: [',', ' '],
			}
		
		handler = =>
			value.removeAll()
			elementValue = el.val()
			if elementValue
				for tag, index in elementValue
					# Sometimes some comas and spaces might pop in
					tag = tag.replace(',', '').replace(' ', '').trim()
					console.log tag
					if not tag then continue
					value.push tag


		# This prevents dropdown for tags
		dropDownKill = (e) =>
			haveTags = jQuery(e.target).data();
			if haveTags
				jQuery('body').toggleClass 'kill-all-select2-dropdowns', e.type == 'select2:opening'

		build = =>

			# Apply select2
			el.select2 config

			el.on 'change', handler
			el.on 'select2:select select2:unselect', handler
			el.on 'select2:opening select2:close', dropDownKill

			# Destroy select2 on element disposal
			ko.utils.domNodeDisposal.addDisposeCallback element, =>
				el.select2 'destroy'
				if handler isnt null
					el.off 'change', handler
					el.off 'select2:select select2:unselect', handler

		setTimeout build, 0

	update: (element, valueAccessor, allBindingsAccessor) =>
		value = @getValue(valueAccessor)
		copy = JSON.parse JSON.stringify value

		el = jQuery element

		maybeSet = =>

			# Not a best moment to update
			if el.val() is null
				elementTags = ''
			else
				elementTags = el.val().join(',').replace(/(,+)/g, ',').replace(/(\s+)/g, ' ')
			modelTags = value.join(',')

			if elementTags isnt modelTags
				@setTags el, copy
				console.log "Update what?", elementTags, modelTags

		setTimeout maybeSet, 0