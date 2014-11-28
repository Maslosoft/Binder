<?php require './_header.php'; ?>
<div data-bind="with: app.model.SortableHtmlValues">
	<div>Sortable: <input data-bind="textInput: title"/> <span data-bind="htmlValue: title"></span></div>
	<div id="dev" data-bind="sortable: {data: items, connectClass: 'Names', options: {distance: 10}}">
		<div>
			<input data-bind="textInput: text"/>
			<span data-bind="htmlValue: text"></span>
			<span data-bind="textValue: text"></span>
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
	jQuery(document).ready(function(){
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
		app.model.SortableHtmlValues = new Maslosoft.Ko.BalinDev.Models.SortableHtmlValues(data);
		ko.applyBindings({model: app.model});
		// See http://stackoverflow.com/questions/3390786/jquery-ui-sortable-selectable
//				jQuery('#dev').selectable();
	});
</script>
<?php require './_footer.php'; ?>