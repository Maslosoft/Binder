<?php require './_header.php'; ?>
<div data-bind="fancytree: app.model.Tree.children">
</div>
<hr />
<div data-bind="fancytree: {data: app.model.Tree.children, autoExpand: true, options: {checkbox: true}}">
</div>
<hr />
<div data-bind="fancytree: {data: app.model.Tree2.children, options: {checkbox: true}}">
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
		app.model.Tree2 = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
