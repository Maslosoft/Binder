
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
		
		# Defer icon creation, as other bindings must be evaluated first,
		# like html, text, etc.
		defer = () =>
			html = []
			data = @getValue(valueAccessor)
			extras = data._treeGrid
			config = bindingContext.widget.config
			console.log extras.hasChilds
			# TODO: Just accessing data.children causes havoc...
			nodeIcon = config.nodeIcon
			folderIcon = config.folderIcon
			if folderIcon and extras.hasChilds
#				console.log 'hmmm'
				nodeIcon = folderIcon
#			console.log "#{data.title}: #{extras.depth}", extras.hasChilds
#			console.log data
#			console.log ko.unwrap bindingContext.$index
#			if extras.hasChilds
			depth = extras.depth
			expanders = []
			expanders.push "<div class='collapsed' style='display:none;transform: rotate(-90deg);'>&#128899;</div>"
			expanders.push "<div class='expanded' style='transform: rotate(-45deg);'>&#128899;</div>"
			html.push "<a class='expander' style='cursor:pointer;text-decoration:none;width:1em;margin-left:#{depth}em;display:inline-block;'>#{expanders.join('')}</a>"
#			else
			depth = extras.depth + 1
			html.push "<i class='no-expander' style='margin-left:#{depth}em;display:inline-block;'></i>"
			html.push "<img src='#{nodeIcon}' style='width: 1em;height:1em;margin-top: -.3em;display: inline-block;'/>"
			element.innerHTML = html.join('') + element.innerHTML
			
#			console.log element
#			console.log bindingContext
		defer()
#		setTimeout defer, 0

