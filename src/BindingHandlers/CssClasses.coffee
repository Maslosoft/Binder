#
# Enum css class handler
#
class @Maslosoft.Ko.Balin.CssClasses extends @Maslosoft.Ko.Balin.Base

	getClassList: (valueAccessor) =>
		classes = @getValue valueAccessor
		if typeof(classes) is 'string'
			classList = classes
		else
			classList = classes.join(' ')
		return classList

	init: (element, valueAccessor) =>
		initialClasses = @getClassList(valueAccessor)

		element.setAttribute('data-css-classes', initialClasses)

	update: (element, valueAccessor, allBindingsAccessor, viewModel) =>
		toRemove = element.getAttribute('data-css-classes')

		ko.utils.toggleDomNodeCssClass element, toRemove, false

		classesToAdd = @getClassList(valueAccessor)

		ko.utils.toggleDomNodeCssClass element, classesToAdd, true

		element.setAttribute('data-css-classes', classesToAdd)

