if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.BinderDev
	@Maslosoft.BinderDev = {}

class @Maslosoft.BinderDev.TitleRenderer

	constructor: (tree, options) ->
		

	render: (node, span) ->
		description = ''
		if node.description
			description = "<em class='text-muted'>#{node.description}</em>"
		span.html("<b>#{node.title}</b> #{description}")
		span.attr('title', "ID: #{node.id}")
		span.attr('data-placement', "right")
		span.attr('rel', 'tooltip')