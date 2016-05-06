<?php require './_header.php'; ?>
Fancy tree drag'n'drop example. <br />
<p>
	<b>NOTE:</b> Make sure that `children` field of model is dereferenced, see Maslosoft.Ko.BalinDev.Models.TreeItem in dev/src/Model.coffee
</p>
<p>
	There are two rendering related options used:
<ul>
	<li><code>nodeIcon</code> - To use custom icon, with also custom styling possible (and recommended). This allows responsive icon/title size.</li>
	<li><code>nodeFolder</code> - Same as `nodeIcon` but for nodes containing childs.</li>
	<li><code>nodeRenderer</code> - Custom node renderer. This renderer gets param as actual ko model, not fancytree node. So many possibilies are open here. See dev/src/TitleRenderer.coffee for example</li>
</ul>
</p>
<p>
	Also responsive font size is used. Document font size:
	<a href="javascript: app.increaseFont();">Increase</a> /
	<a href="javascript: app.decreaseFont();">Decrease</a> /
	<a href="javascript: app.resetFont();">Reset</a>
</p>
<div class="fancy-tree"data-bind="fancytree: {data: app.model.Tree, nodeIcon: 'images/pdf.png', folderIcon: 'images/zip.png', nodeRenderer: Maslosoft.Ko.BalinDev.TitleRenderer, on:{dblclick:app.log, drop: Maslosoft.Ko.BalinDev.FancyTreeDropHandler}, dnd: true, autoExpand: true}">
</div>
<style type="text/css">
	ul.fancytree-container{
		font-size: 1.6em;
	}
</style>
<script>
	jQuery(document).ready(function () {
		data = {
			_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
			title: "Some container",
			children: [
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Zero",
					description: "This can be also rendered via custom renderer"
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "One",
					description: "Another one with description",
					children: [
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "Two",
							description: "Hover for node tooltip - also added by node renderer"
						},
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "Three",
							children: [
								{
									_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
									title: "Three-Two"
								},
								{
									_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
									title: "Three-Three"
								}
							]

						},
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "Four"
						}
					]
				}
			]
		};
		app.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		ko.applyBindings({model: app.model});

		// Helper code
		app.log = function () {
			// Do not bind directly to `on` or will fail with `Illegal Invocation`
			console.log(arguments);
		}
	});
</script>
<?php require './_footer.php'; ?>
