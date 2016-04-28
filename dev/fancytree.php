<?php require './_header.php'; ?>
<div>
	<a href="#" data-bind="click: addNode">Add new node programatically</a>
</div>
<div>
	<a href="#" data-bind="click: addSubNode">Add new sub-node programatically</a>
</div>
<div data-bind="fancytree: app.model.Tree">
</div>



<div data-bind="foreach: app.model.Tree.children">
	<div data-bind="htmlValue: title"></div>
</div>
<hr />
<div data-bind="fancytree: {data: app.model.Tree, autoExpand: true, options: {checkbox: true}}">
</div>
<hr />
<div data-bind="fancytree: {data: app.model.Tree2, options: {checkbox: true}}">
</div>
<script>
	jQuery(document).ready(function () {
		var nodeId = 0;
		window.addNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New node #' + nodeId;
			app.model.Tree.children.push(model);
			e.stopPropagation();
			e.preventDefault();
		};
		window.addSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-node #' + nodeId;
			app.model.Tree.children[0].children.push(model);
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
		app.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		app.model.Tree2 = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
