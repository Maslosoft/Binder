<?php require __DIR__ . '/../_header.php'; ?>
<title>Fancytree - 2 dnd</title>
<h1>Fancytree - 2 dnd</h1>
<div>
	Fancy tree drag'n'drop example. <br />
	<b>NOTE:</b> Make sure that `children` field of model is dereferenced, see Maslosoft.Ko.BalinDev.Models.TreeItem in dev/src/Model.coffee <br />
	<b class="error">NOTE: This is currently broken</b>
</div>
<div class="row">
	<div class="col-sm-4">
		<h4>Drag only list</h4>
		<ul  data-bind="foreach: {data: balin.model.list.children}">
			<li data-bind="draggable: {data: $data, options: {connectToFancytree: true}}">{{title}}</li>
		</ul>
	</div>
	<div class="col-sm-4">
		<h4>Drag only</h4>
		<div data-bind="fancytree: {data: balin.model.Tree, drag: true, autoExpand: true, options: balin.model.options}">
		</div>
	</div>
	<div class="col-sm-4">
		<h4>Drop target and DND tree</h4>
		<div data-bind="fancytree: {data: balin.model.Tree2, dnd: true, autoExpand: true, options: balin.model.options}">
		</div>
	</div>
</div>
<script>
	window.onload = (function () {
		var listData = {
			children: [
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Affenpinscher",
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Afghan Shepherd"
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Aidi",
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Airedale Terrier"
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Akbash"
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Akita Inu"
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
					title: "Afghan Hound"

				}
			]
		}
		balin.model.list = new Maslosoft.Ko.BalinDev.Models.TreeItem(listData);
		var data = {
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
		balin.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);
		data2 = {
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
		balin.model.Tree2 = new Maslosoft.Ko.BalinDev.Models.TreeItem(data2);
		balin.model.options = {
			dnd:{
				draggable: {
					scroll: false
				}
			}
		};
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
