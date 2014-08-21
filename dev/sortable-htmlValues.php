<?php require './_header.php'; ?>
<style>
	.ui-selected{
		background: darkorange;
	}
</style>
<script>
	Maslosoft.Ko.Balin.register('htmlValue', new Maslosoft.Ko.Balin.HtmlValue);
	app.model.Content.AssetCollection.items = app.model.Content.AssetCollection.items.slice(0, 2);
</script>
<div>Sortable: <input data-bind="textInput: app.model.Content.AssetCollection.title"/> <span data-bind="htmlValue: app.model.Content.AssetCollection.title"></span></div>
<div id="dev" data-bind="sortable: {data: app.model.Content.AssetCollection.items, connectClass: 'AssetGroup', options: {distance: 10, cancel: ':input,button,[contenteditable]'}}">
	<div>
		<input data-bind="textInput: title"/>
		<span data-bind="htmlValue: title"></span>
	</div>
</div>
<div>Foreach:</div>
<div data-bind="foreach: app.model.Content.AssetCollection.items">
	<div>
		<input data-bind="textInput: title"/>
		<span data-bind="htmlValue: title"></span>
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