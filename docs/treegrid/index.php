<?php require __DIR__ . '/../_header.php'; ?>
<title>Tree Grid</title>
<h1>Tree Grid</h1>
<div>
	<a href="#" data-bind="click: addNode">Add new node programatically</a>
</div>
<div>
	<a href="#" data-bind="click: addSubNode">Add new sub-node programatically</a>
</div>
<div>
	<a href="#" data-bind="click: addSubSubNode">Add new sub-sub-node programatically</a>
</div>
<div>
	<a href="#" data-bind="click: addSubSubNodeLast">Add new sub-sub-node to last sub-node programatically</a>
</div>
<div>
	<a href="#" data-bind="click: remSubSubNode">Remove all sub-sub-nodes programatically</a>
</div>
<!--
<div data-bind="foreach: balin.model.Tree.children">
	<div data-bind="htmlValue: title"></div>
	<div data-bind="htmlValue: description"></div>
</div> -->
<hr />
<div>
	<table id="gridView" style="font-size: 18px;" class="table table-condensed">
		<thead>
			<tr>
				<th style="width:.1%;"><input type="checkbox" /></th>
				<th>Nodes</th>
				<th>Description</th>
				<th>Misc</th>
				<th>Remove</th>
				<th>Debug</th>
			</tr>
		</thead>
		<tbody data-bind="treegrid: {data: balin.model.Tree, childrenField: 'children', nodeIcon: '../images/pdf.png', folderIcon: '../images/zip.png', autoExpand: true, dnd: true, activeClass: 'active success'}">
			<tr>
				<td><input type="checkbox" /></td>
				<td>
					<span data-bind="treegridnode: $data"></span>
					<span data-bind="html: title"></span>
				</td>
				<td data-bind="html: description"></td>
				<td>Static value</td>
				<td><a href="#" class="remove">Remove</a></td>
				<td class="debug"></td>
			</tr>
		</tbody>
	</table>
</div>
<script type="text/javascript">
	window.onload = (function () {
		var nodeId = 0;
		window.addNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New node #' + nodeId;
			model.description = 'Description #' + nodeId;
			balin.model.Tree.children.push(model);
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
		};
		window.addSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-node #' + nodeId;
			model.description = 'Description sub-node #' + nodeId;
			balin.model.Tree.children[0].children.push(model);
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
		};
		window.addSubSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-sub-node #' + nodeId;
			model.description = 'Description sub-sub-node #' + nodeId;
			balin.model.Tree.children[0].children[0].children.push(model);
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
		};
		window.addSubSubNodeLast = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-sub-node #' + nodeId;
			model.description = 'Description sub-sub-node #' + nodeId;
			var idx = 0;
			if (balin.model.Tree.children[0].children.length) {
				idx = balin.model.Tree.children[0].children.length - 1;
			}
			balin.model.Tree.children[0].children[idx].children.push(model);
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
		};
		window.remSubSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-sub-node #' + nodeId;
			model.description = 'Description sub-sub-node #' + nodeId;
			balin.model.Tree.children[0].children[0].children = [];
			if (e) {
				e.stopPropagation();
				e.preventDefault();
			}
		};

		var deferAdd = function () {
			window.addNode();
			window.addSubNode();
			window.addSubNode();
			window.addSubSubNodeLast();
			window.addSubSubNodeLast();
			window.addSubSubNodeLast();
			window.addSubNode();
			window.addSubSubNodeLast();
			window.addSubSubNodeLast();
			window.addSubNode();
			window.addSubSubNodeLast();
			window.addSubSubNodeLast();
			window.addSubSubNodeLast();
			window.addSubSubNodeLast();
		};

		setTimeout(deferAdd, 100);
		var grid = jQuery('#gridView');
		var gm = new Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView(grid.find('tbody'));
		grid.on('click', '.remove', function(e){
			e.stopPropagation();
			e.preventDefault();
			var model = ko.dataFor(this);
			console.log(model.title);
			gm.remove(model);
		});

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
		balin.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		balin.model.Tree2 = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
