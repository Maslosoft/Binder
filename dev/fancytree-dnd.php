<?php require './_header.php'; ?>
Fancy tree drag'n'drop example. <br />
NOTE: this does <b>not</b> update view model, it only rearange node visually.
<div data-bind="fancytree: {data: app.model.Tree.children, autoExpand: true, options: app.model.options}">
</div>
<script>
	jQuery(document).ready(function() {
		data = {
			title: "Some container",
			children: [{
					title: "One",
					children: [
						{
							title: "Two",
							children: []

						},
						{
							title: "Three",
							children: [
								{
									title: "Three-Two",
									children: []

								},
								{
									title: "Three-Three",
									children: []

								}
							]

						},
						{
							title: "Four",
							children: []
						}
					]
				}]
		};
		app.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		app.model.options = {
			extensions: ["dnd"],
			dnd: {
				autoExpandMS: 400,
				focusOnClick: true,
				preventVoidMoves: true,
				preventRecursiveMoves: true,
				dragStart: function(node, data) {
					return true;
				},
				dragEnter: function(node, data) {
					return true;
				},
				dragDrop: function(node, data) {
					// NOTE here could be implemented view model change, but there is no reference to current node
					data.otherNode.moveTo(node, data.hitMode);
        }
      }
	};
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
