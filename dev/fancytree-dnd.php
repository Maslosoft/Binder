<?php require './_header.php'; ?>
Fancy tree drag'n'drop example. <br />
<div data-bind="fancytree: {data: app.model.Tree, dnd: true, autoExpand: true, options: app.model.options}">
</div>

<script>
	jQuery(document).ready(function() {
		data = {
			_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
			title: "Some container",
			children: [
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Zero",	
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "One",
					children: [
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "Two"
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

		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
