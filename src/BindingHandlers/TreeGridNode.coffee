
#
# This is to create "nodes" cell, this is meant to be used with TreeGrid
# binding handler
#
#
#
class @Maslosoft.Ko.Balin.TreeGridNode extends @Maslosoft.Ko.Balin.Base

	init: (element, valueAccessor, allBindings, viewModel, bindingContext) =>

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		ko.utils.toggleDomNodeCssClass(element, 'tree-grid-drag-handle', true);

		data = @getValue valueAccessor
		extras = data._treeGrid
#		console.log extras
		
		# Defer icon creation, as other bindings must be evaluated first,
		# like html, text, etc.
		defer = () =>
			html = []
			console.log "#{data.title}: #{extras.depth}"
			if data.children.length
				depth = extras.depth
#				html.push "<a class='expander' style='cursor:pointer;text-decoration:none;width:1em;margin-left:#{depth}em;display:inline-block;'>►</a>"
				html.push "<a class='expander' style='cursor:pointer;text-decoration:none;width:1em;margin-left:#{depth}em;display:inline-block;'>▼</a>"
			else
				depth = extras.depth + 1
				html.push "<i class='no-expander' style='margin-left:#{depth}em;'></i>"
			html.push '<img src="images/pdf.png" style="width: 1em;height:1em;margin-top: -.3em;display: inline-block;"/>'
			element.innerHTML = html.join('') + element.innerHTML
#			console.log element
#			console.log bindingContext
		
		setTimeout defer, 0

