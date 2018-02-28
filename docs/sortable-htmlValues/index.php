<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Sortable HTML Values</title>
<h1>Sortable HTML Values</h1>
<p>
	This demo combines ability to track nested structures of objects
	together with <code>contenteditable</code> editable elements support.
</p>
<p>
	Try to rearrange nodes by handle or to change names directly editing - or
	via text input. Notice how second non-sortable list stays in sync
	with editable one.
</p>
<div>
	<a href="#" data-bind="click: addNode">Add new node programatically</a>
</div>
<!-- /trim -->
<div data-bind="with: binder.model.SortableHtmlValues">
	<div>Sortable: <input data-bind="textInput: title"/> <span data-bind="htmlValue: title"></span></div>
	<div id="dev" data-bind="sortable: {data: items, connectClass: 'Names', options: {distance: 10}}">
		<div>
			<input data-bind="textInput: text"/>
			<span data-bind="htmlValue: text"></span>
			<span data-bind="textValue: text"></span>
			<span style="cursor:ns-resize;">&#x2195;</span>
		</div>
	</div>
	<hr />
	<div>Foreach: <input data-bind="textInput: title"/> <span data-bind="htmlValue: title"></span></div>
	<div data-bind="foreach: items">
		<div>
			<input data-bind="textInput: text"/>
			<span data-bind="htmlValue: text"></span>
			<span data-bind="textValue: text"></span>
		</div>
	</div>
</div>
<script>
	window.onload = (function(){
		var nodeId = 0;
		window.addNode = function (data, e) {
			nodeId++;
			var model = new Maslosoft.Koe.HtmlValue;
			model.text = 'New name #' + nodeId;
			binder.model.SortableHtmlValues.items.push(model);
			e.stopPropagation();
			e.preventDefault();
		};
		var data = {
			title: 'Names Collection',
			items: [
				{
					_class: 'Maslosoft.Koe.HtmlValue',
					text: 'Frank'
				},
				{
					_class: 'Maslosoft.Koe.HtmlValue',
					text: 'Sara'
				},
				{
					_class: 'Maslosoft.Koe.HtmlValue',
					text: 'John'
				},
				{
					_class: 'Maslosoft.Koe.HtmlValue',
					text: 'Anna'
				},
				{
					_class: 'Maslosoft.Koe.HtmlValue',
					text: 'Joseph'
				}
			]
		};
		binder.model.SortableHtmlValues = new Maslosoft.Koe.SortableHtmlValues(data);
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>