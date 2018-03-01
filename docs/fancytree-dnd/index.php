<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Fancytree Drag and Drop</title>
<h1>Fancytree Drag and Drop</h1>
<p>
Fancy tree drag'n'drop example.
</p>
<p class="alert alert-warning">
	Make sure that `children` field of model is dereferenced, see Maslosoft.Koe.TreeItem in dev/src/Model.coffee
</p>
<p class="alert alert-warning">
    When using multi-line binding definition the <code>data</code> property must
    be quited with <code>'</code>
</p>
<p>
	There are two rendering related options used:
</p>
<ul>
    <li><code>nodeIcon</code> - To use custom icon, with also custom styling possible (and recommended). This allows responsive icon/title size.</li>
    <li><code>nodeFolder</code> - Same as `nodeIcon` but for nodes containing childs.</li>
    <li><code>nodeRenderer</code> - Custom node renderer. This renderer gets param as actual ko model, not fancytree node. So many possibilies are open here. See dev/src/TitleRenderer.coffee for example</li>
</ul>
<p>
	Also responsive font size is used. Document font size:
	<a href="javascript: binder.increaseFont();">Increase</a> /
	<a href="javascript: binder.decreaseFont();">Decrease</a> /
	<a href="javascript: binder.resetFont();">Reset</a>
</p>
<!-- /trim -->
<div class="fancy-tree"
	data-bind="fancytree: {
		'data': binder.model.Tree,
		nodeIcon: 'images/pdf.png', 
		folderIcon: 'images/zip.png', 
		nodeRenderer: Maslosoft.BinderDev.TitleRenderer, 
		on:{
			'dblclick':binder.log, 
			'drop': Maslosoft.BinderDev.FancyTreeDropHandler
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
			_class: 'Maslosoft.Koe.TreeItem',
			title: "Some container",
			children: [
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Zero",
					description: "This can be also rendered via custom renderer"
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "One",
					description: "Another one with description",
					children: [
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Two",
							description: "Hover for node tooltip - also added by node renderer"
						},
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Three",
							children: [
								{
									_class: 'Maslosoft.Koe.TreeItem',
									title: "Three-Two"
								},
								{
									_class: 'Maslosoft.Koe.TreeItem',
									title: "Three-Three"
								}
							]

						},
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Four"
						}
					]
				}
			]
		};
		binder.model.Tree = new Maslosoft.Koe.TreeItem(data);
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));

		// Helper code
		binder.log = function () {
			// Do not bind directly to `on` or will fail with `Illegal Invocation`
			console.log(arguments);
		}
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
