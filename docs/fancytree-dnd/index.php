<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Fancytree - dnd</title>
<h1>Fancytree - Drag and Drop</h1>
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
	<a href="javascript: balin.increaseFont();">Increase</a> /
	<a href="javascript: balin.decreaseFont();">Decrease</a> /
	<a href="javascript: balin.resetFont();">Reset</a>
</p>
<!-- /trim -->
<div class="fancy-tree"
	data-bind="fancytree: {
		data: balin.model.Tree, 
		nodeIcon: 'images/pdf.png', 
		folderIcon: 'images/zip.png', 
		nodeRenderer: Maslosoft.Ko.BalinDev.TitleRenderer, 
		on:{
			'dblclick':balin.log, 
			'drop': Maslosoft.Ko.BalinDev.FancyTreeDropHandler
		}, 
		dnd: true, 
		autoExpand: true
	}">
</div>
<!-- trim -->
<style type="text/css">
	ul.fancytree-container{
		font-size: 1.6em;
	}
</style>
<!-- /trim -->
<script>
	window.onload = (function () {
		// Create tree structure
		var data = {
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
		balin.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));

		// Helper code
		balin.log = function () {
			// Do not bind directly to `on` or will fail with `Illegal Invocation`
			console.log(arguments);
		}
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
