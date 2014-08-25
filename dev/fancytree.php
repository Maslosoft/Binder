<?php require './_header.php'; ?>
<div data-bind="fancytree: app.model.Tree">
</div>

<script>
	jQuery(document).ready(function() {
		data = {
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
		};
		app.model.Tree = {};
		app.model.Tree.children = [new Maslosoft.Ko.BalinDev.Models.TreeItem(data)];
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
