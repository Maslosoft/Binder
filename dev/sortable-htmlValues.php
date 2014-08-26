<?php require './_header.php'; ?>
<script>
	app.model.Content.AssetCollection.items = app.model.Content.AssetCollection.items.slice(0, 2);
</script>
<div data-bind="with: app.model.Content.AssetCollection">
	<div>Sortable: <input data-bind="textInput: title"/> <span data-bind="htmlValue: title"></span></div>
	<div id="dev" data-bind="sortable: {data: items, connectClass: 'AssetGroup', options: {distance: 10}}">
		<div>
			<input data-bind="textInput: title"/>
			<span data-bind="htmlValue: title"></span>
			<span data-bind="textValue: title"></span>
		</div>
	</div>
	<div>Foreach:</div>
	<div data-bind="foreach: items">
		<div>
			<input data-bind="textInput: title"/>
			<span data-bind="htmlValue: title"></span>
			<span data-bind="textValue: title"></span>
		</div>
	</div>
</div>
<script>
	jQuery(document).ready(function(){
		ko.applyBindings({model: app.model});
		// See http://stackoverflow.com/questions/3390786/jquery-ui-sortable-selectable
//				jQuery('#dev').selectable();
	});
</script>
<?php require './_footer.php'; ?>