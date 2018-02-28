<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Fancytree</title>
<h1>Fancytree</h1>
<p>
	Fancy tree binding handler is a wrapper for <a href="http://wwwendt.de/tech/fancytree/demo/index.html" target="_blank">excellent JavaScript tree library</a>. This binding handler ensures
	that tree is in-sync with underlying data. It requires tree to have <code>children</code>
	property containg sub nodes. Example tree structure is included in this example.
</p>
<p>
	See also <a href="../fancytree-dnd/">drag'n'drop example</a> or even more advanced widget of
	<a href="../treegrid/">Tree Grid</a>.
</p>
<div>
	<a href="#" data-bind="click: addNode">Add new node programatically</a>
</div>
<div>
	<a href="#" data-bind="click: addSubNode">Add new sub-node programatically</a>
</div>
<!-- /trim -->
<div data-bind="fancytree: binder.model.Tree">
</div>
<!-- trim -->
<div data-bind="foreach: binder.model.Tree.children">
	<div data-bind="htmlValue: title"></div>
</div>
<hr />
<!-- /trim -->
<div data-bind="
	fancytree: {
		data: binder.model.Tree, 
		autoExpand: true, 
		options: {
			checkbox: true
		}}">
</div>
<!-- trim -->
<hr />
<!-- /trim -->
<div data-bind="
	fancytree: {
		data: binder.model.Tree2, 
		options: {
			checkbox: true
		}}">
</div>
<script>
	window.onload = (function () {
		var nodeId = 0;
		window.addNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Koe.TreeItem;
			model.title = 'New node #' + nodeId;
			binder.model.Tree.children.push(model);
			e.stopPropagation();
			e.preventDefault();
		};
		window.addSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Koe.TreeItem;
			model.title = 'New sub-node #' + nodeId;
			binder.model.Tree.children[0].children.push(model);
			e.stopPropagation();
			e.preventDefault();
		};


		var data = {
			title: "Some container",
			_class: 'Maslosoft.Koe.TreeItem',
			children: [{
					title: "One",
					_class: 'Maslosoft.Koe.TreeItem',
					children: [
						{
							title: "Two",
							_class: 'Maslosoft.Koe.TreeItem',
					children: []

				},
				{
					title: "Three",
					_class: 'Maslosoft.Koe.TreeItem',
					children: [
						{
							title: "Three-Two",
							_class: 'Maslosoft.Koe.TreeItem',
							children: []

						},
						{
							title: "Three-Three",
							_class: 'Maslosoft.Koe.TreeItem',
							children: []

						}
					]

				},
				{
					title: "Four",
					_class: 'Maslosoft.Koe.TreeItem',
					children: []
				}
			]
			}]
		};
		binder.model.Tree = new Maslosoft.Koe.TreeItem(data);
		binder.model.Tree2 = new Maslosoft.Koe.TreeItem(data);
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
