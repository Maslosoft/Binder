if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}

class @Maslosoft.Ko.BalinDev.TitleRenderer

	constructor: (tree, options) ->
		

	render: (node, span) ->
		console.log node.title
		description = ''
		if node.description
			description = "<em class='text-muted'>#{node.description}</em>"
		span.html("<b>#{node.title}</b> #{description} (ID: #{node.id})")