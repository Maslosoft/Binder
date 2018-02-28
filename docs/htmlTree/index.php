<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>HTML Tree</title>
<h1>HTML Tree</h1>
<p>
	HTML Tree Binding handler builds nested HTML list out of tree structure.
</p>
<p>
	Tree structure should contain nested nodes in property <code>children</code>,
	example structure is included in this example.
</p>
<!-- /trim -->
<ul data-bind="htmlTree: binder.model.Tree">
</ul>

<script>
	window.onload = (function () {
		data = {
			_class: 'Maslosoft.Koe.TreeItem',
			title: "Some container",
			children: [
				{
					_class: 'Maslosoft.Koe.TreeItem',
					title: "One",
					children: [
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Two"
						},
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Three",
							children: [
								{
									_class: 'Maslosoft.Koe.TreeItem',
									title: "Three-Two"
								},
								{
									_class: 'Maslosoft.Koe.TreeItem',
									title: "Three-Three"
								}
							]

						},
						{
							_class: 'Maslosoft.Koe.TreeItem',
							title: "Four"
						}
					]
				}
			]
		};
		binder.model.Tree = new Maslosoft.Koe.TreeItem(data);

		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
