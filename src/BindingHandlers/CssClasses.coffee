#
# Enum css class handler
#
class @Maslosoft.Ko.Balin.CssClasses extends @Maslosoft.Ko.Balin.Base

	getClassList: (valueAccessor) =>
		classes = @getValue valueAccessor
		if typeof(classes) is 'undefined'
			return ''
		if classes is null
			return ''
		if typeof(classes) is 'string'
			classList = classes
		else
			classList = classes.join(' ')

		return classList.replace(/^\s*/, '').replace(/\s*$/, '')

	init: (element, valueAccessor) =>
		initialClasses = @getClassList(valueAccessor)

		element.setAttribute('data-css-classes', initialClasses)

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		toRemove = element.getAttribute('data-css-classes')

		ko.utils.toggleDomNodeCssClass element, toRemove, false

		classesToAdd = @getClassList(valueAccessor)

		if classesToAdd
			ko.utils.toggleDomNodeCssClass element, classesToAdd, true

		element.setAttribute('data-css-classes', classesToAdd)