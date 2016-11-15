<?php require './_header.php'; ?>
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

<div data-bind="foreach: app.model.Tree.children">
	<div data-bind="htmlValue: title"></div>
	<div data-bind="htmlValue: description"></div>
</div>
<hr />
<div>
	<table style="font-size: 18px;" class="table table-condensed">
		<thead>
			<tr>
				<th>Nodes</th>
				<th>Description</th>
				<th>Misc</th>
				<th>Debug</th>
			</tr>
		</thead>
		<tbody data-bind="treegrid: {data: app.model.Tree, childrenField: 'children', nodeIcon: 'images/pdf.png', folderIcon: 'images/zip.png', autoExpand: true}">
			<tr>
				<td data-bind="treegridnode: $data, html: title">
				</td>
				<td data-bind="html: $data.description"></td>
				<td>Static value</td>
				<td class="debug"></td>
			</tr>
		</tbody>
	</table>
</div>
<script type="text/javascript">
	jQuery(document).ready(function () {
		var nodeId = 0;
		window.addNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New node #' + nodeId;
			model.description = 'Description #' + nodeId;
			app.model.Tree.children.push(model);
			if(e){
				e.stopPropagation();
				e.preventDefault();
			}
		};
		window.addSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-node #' + nodeId;
			model.description = 'Description sub-node #' + nodeId;
			app.model.Tree.children[0].children.push(model);
			if(e){
				e.stopPropagation();
				e.preventDefault();
			}
		};
		window.addSubSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-sub-node #' + nodeId;
			model.description = 'Description sub-sub-node #' + nodeId;
			app.model.Tree.children[0].children[0].children.push(model);
			if(e){
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
			if(app.model.Tree.children[0].children.length) {
				idx = app.model.Tree.children[0].children.length - 1;
			}
			app.model.Tree.children[0].children[idx].children.push(model);
			if(e){
				e.stopPropagation();
				e.preventDefault();
			}
		};
		window.remSubSubNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Ko.BalinDev.Models.TreeItem;
			model.title = 'New sub-sub-node #' + nodeId;
			model.description = 'Description sub-sub-node #' + nodeId;
			app.model.Tree.children[0].children[0].children = [];
			if(e){
				e.stopPropagation();
				e.preventDefault();
			}
		};

		var deferAdd = function(){
			window.addNode();
			window.addSubNode();
		};

		setTimeout(deferAdd, 100);

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
		app.model.Tree2 = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		ko.applyBindings({model: app.model});
		});
</script>
<?php require './_footer.php'; ?>
