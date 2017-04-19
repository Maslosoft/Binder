<?php require __DIR__ . '/_header.php'; ?>
<title>Sortable HTML Values</title>
<h1>Sortable HTML Values</h1>
<div>
	<a href="#" data-bind="click: addNode">Add new node programatically</a>
</div>
<div data-bind="with: balin.model.SortableHtmlValues">
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
			var model = new Maslosoft.Ko.BalinDev.Models.HtmlValue;
			model.text = 'New name #' + nodeId;
			balin.model.SortableHtmlValues.items.push(model);
			e.stopPropagation();
			e.preventDefault();
		};
		var data = {
			title: 'Names Collection',
			items: [
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'Frank'
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'Sara'
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'John'
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'Anna'
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'Joseph'
				}
			]
		};
		balin.model.SortableHtmlValues = new Maslosoft.Ko.BalinDev.Models.SortableHtmlValues(data);
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		// See http://stackoverflow.com/questions/3390786/jquery-ui-sortable-selectable
//				jQuery('#dev').selectable();
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>