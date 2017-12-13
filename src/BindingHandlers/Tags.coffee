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

			jQuery(dropdownKillStyles).appendTo 'head'
			once = false

		data = @getValue valueAccessor

		if data.data
			value = data.data
		else
			# Assume direct data passing
			value = data

		copy = JSON.parse JSON.stringify value

		el = jQuery element
		el.data 'tags', true
		el.attr 'multiple', true
		
		@setTags el, copy
		
		config = {
				placeholder: data.placeholder
				tags: true
				tokenSeparators: [',', ' ']
			}

		updateCSS = () ->
			if data.inputCss
				input = el.parent().find('.select2-search__field')
				input.addClass(data.inputCss);
				input.attr 'placeholder', data.placeholder

		if data.tagCss
			config.templateSelection = (selection, element) ->
				element.removeClass 'select2-selection__choice'
				element.addClass data.tagCss
				if selection.selected
					return jQuery "<span>#{selection.text}</span>"
				else
					return jQuery "<span>#{selection.text}</span>"


		handler = =>
			if value.removeAll
				value.removeAll()
			else
				value = []

			elementValue = el.val()
			if elementValue
				for tag, index in elementValue
					# Sometimes some comas and spaces might pop in
					tag = tag.replace(',', '').replace(' ', '').trim()

					if not tag then continue
					value.push tag
			updateCSS()


		# This prevents dropdown for tags
		dropDownKill = (e) =>
			haveTags = jQuery(e.target).data();
			if haveTags
				jQuery('body').toggleClass 'kill-all-select2-dropdowns', e.type == 'select2:opening'

		build = =>

			# Apply select2
			el.select2 config

			updateCSS()

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
		data = @getValue(valueAccessor)

		if data.data
			value = data.data
		else
			# Assume direct data passing
			value = data

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


		setTimeout maybeSet, 0