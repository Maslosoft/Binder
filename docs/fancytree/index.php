<?php require __DIR__ . '/../_header.php'; ?>
<title>Fancytree</title>
<h1>Fancytree</h1>
<div>
	<a href="#" data-bind="click: addNode">Add new node programatically</a>
</div>
<div>
	<a href="#" data-bind="click: addSubNode">Add new sub-node programatically</a>
</div>
<div data-bind="fancytree: balin.model.Tree">
</div>



<div data-bind="foreach: balin.model.Tree.children">
	<div data-bind="htmlValue: title"></div>
</div>
<hr />
<div data-bind="fancytree: {data: balin.model.Tree, autoExpand: true, options: {checkbox: true}}">
</div>
<hr />
<div data-bind="fancytree: {data: balin.model.Tree2, options: {checkbox: true}}">
</div>
<script>
	window.onload = (function () {
		var nodeId = 0;
		window.addNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New node #' + nodeId;
			balin.model.Tree.children.push(model);
			e.stopPropagation();
			e.preventDefault();
		};
		window.addSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-node #' + nodeId;
			balin.model.Tree.children[0].children.push(model);
			e.stopPropagation();
			e.preventDefault();
		};


		var data = {
			title: "Some container",
			_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
			children: [{
					title: "One",
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					children: [
						{
							title: "Two",
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					children: []

				},
				{
					title: "Three",
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					children: [
						{
							title: "Three-Two",
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							children: []

						},
						{
							title: "Three-Three",
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							children: []

						}
					]

				},
				{
					title: "Four",
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					children: []
				}
			]
			}]
		};
		balin.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		balin.model.Tree2 = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
