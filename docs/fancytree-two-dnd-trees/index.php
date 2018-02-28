<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Fancytree Drag'n'Drop Between Trees</title>
<h1>Fancytree Drag and Drop Between Trees</h1>
<div>
<p>
	Fancy tree drag and drop between two trees example.
</p>
	<p class="alert alert-warning">
	<b>Make sure that <code>children</code> field of model is dereferenced, see Maslosoft.Koe.TreeItem in <code>docs/src/Model.coffee</code>	
	</p>
	<p class="alert alert-danger">
		This is currently broken
	</p>
</div>
<!-- /trim -->
<div class="row">
	<div class="col-sm-4">
		<h4>Drag only list</h4>
		<ul  data-bind="foreach: {data: binder.model.list.children}">
			<li data-bind="draggable: {data: $data, options: {connectToFancytree: true}}">{{title}}</li>
		</ul>
	</div>
	<div class="col-sm-4">
		<h4>Drag only</h4>
		<div data-bind="fancytree: {data: binder.model.Tree, drag: true, autoExpand: true, options: binder.model.options}">
		</div>
	</div>
	<div class="col-sm-4">
		<h4>Drop target and DND tree</h4>
		<div data-bind="fancytree: {data: binder.model.Tree2, dnd: true, autoExpand: true, options: binder.model.options}">
		</div>
	</div>
</div>
<script>
	window.onload = (function () {
		var listData = {
			children: [
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Affenpinscher",
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Afghan Shepherd"
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Aidi",
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Airedale Terrier"
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Akbash"
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Akita Inu"
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Afghan Hound"

				}
			]
		}
		binder.model.list = new Maslosoft.Koe.TreeItem(listData);
		var data = {
			_class: 'Maslosoft.Koe.TreeItem',
			title: "Dogs",
			children: [
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Affenpinscher",
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Afghan Hound",
					children: [
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Afghan Shepherd"
						},
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Aidi",
							children: [
								{
									_class: 'Maslosoft.Koe.TreeItem',
									title: "Airedale Terrier"
								},
								{
									_class: 'Maslosoft.Koe.TreeItem',
									title: "Akbash"
								}
							]

						},
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Akita Inu"
						}
					]
				}
			]
		};
		binder.model.Tree = new Maslosoft.Koe.TreeItem(data);
		data2 = {
			_class: 'Maslosoft.Koe.TreeItem',
			title: "Cats",
			children: [
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Abyssinian",
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "Aegean"
				},
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "American Curl",
					children: [
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "American Bobtail",
							children: [
								{
									_class: 'Maslosoft.Koe.TreeItem',
									title: "American Shorthair"
								}
							]

						},
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "American Wirehair"
						},
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Arabian Mau"
						}
					]
				}
			]
		};
		binder.model.Tree2 = new Maslosoft.Koe.TreeItem(data2);
		binder.model.options = {
			dnd:{
				draggable: {
					scroll: false
				}
			}
		};
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
