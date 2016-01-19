<?php require './_header.php'; ?>
<div>
	Fancy tree drag'n'drop example. <br />
	<b>NOTE:</b> Make sure that `children` field of model is dereferences, see Maslosoft.Ko.BalinDev.Models.TreeItem in dev/src/Model.coffee
</div>
<div class="row">
<div class="col-sm-6">
	<div data-bind="fancytree: {data: app.model.Tree, dnd: true, autoExpand: true, options: app.model.options}">
	</div>
</div>
<div class="col-sm-6">
	<div data-bind="fancytree: {data: app.model.Tree2, dnd: true, autoExpand: true, options: app.model.options}">
	</div>
</div>
</div>
<script>
	jQuery(document).ready(function() {
		data = {
			_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
			title: "Dogs",
			children: [
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Affenpinscher",
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Afghan Hound",
					children: [
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "Afghan Shepherd"
						},
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "Aidi",
							children: [
								{
									_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
									title: "Airedale Terrier"
								},
								{
									_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
									title: "Akbash"
								}
							]

						},
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "Akita Inu"
						}
					]
				}
			]
		};
		app.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		data = {
			_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
			title: "Cats",
			children: [
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Abyssinian",
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Aegean"
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "American Curl",
					children: [
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "American Bobtail",
							children: [
								{
									_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
									title: "American Shorthair"
								}
							]

						},
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "American Wirehair"
						},
						{
							_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
							title: "Arabian Mau"
						}
					]
				}
			]
		};
		app.model.Tree2 = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
