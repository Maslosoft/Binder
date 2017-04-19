<?php require __DIR__ . '/_header.php'; ?>
<title>HTML Tree</title>
<h1>HTML Tree</h1>
HTML tree example. <br />
It builds nested HTML list out of tree structure.
<ul data-bind="htmlTree: balin.model.Tree">
</ul>

<script>
	window.onload = (function () {
		data = {
			_class: 'Maslosoft.Ko.BalinDev.Models.TreeItem',
			title: "Some container",
			children: [
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
		balin.model.Tree = new Maslosoft.Ko.BalinDev.Models.TreeItem(data);

		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
