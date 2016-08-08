<?php require './_header.php'; ?>
<div>
	This creates widget action url dynamically.<br/>
	<a href="" data-bind="widgetId: 'ms_1', activity: 'sort', params: {name: 'asc'}">Acitivity link</a><br />
	<a href="" data-bind="widget: app.model.Widget, activity: 'sort', params: {name: 'asc'}">Widget Activity link</a><br />
	<a href="" data-bind="widget: app.model.Widget, activity: 'sort', params: 'sss'">Widget Activity link simple param</a><br />
	<a href="" data-bind="widget: app.model.Widget, activity: 'status', params: 0">Widget Action link simple numeric param</a><br />
	<a href="" rel="tooltip" title="My tooltip" data-bind="widget: app.model.Widget, activity: 'sort'">Widget Activity link no params with tooltip</a><br />

</div>

<script>
	jQuery(document).ready(function () {
		app.model.Tooltip = new Maslosoft.Ko.BalinDev.Models.Tooltip({title: 'This is tooltip'});
		app.model.Widget = {
			id: 'ms_2'
		};
		ko.applyBindings({model: app.model});
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
		});
</script>
<?php require './_footer.php'; ?>