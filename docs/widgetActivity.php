<?php require __DIR__ . '/_header.php'; ?>
<title>Widget Activity</title>
<h1>Widget Activity</h1>
<div>
	This creates widget action url dynamically.<br/>
	<a href="" data-bind="widgetId: 'ms_1', activity: 'sort', params: {name: 'asc'}">Acitivity link</a><br />
	<a href="" data-bind="widget: balin.model.Widget, activity: 'sort', params: {name: 'asc'}">Widget Activity link</a><br />
	<a href="" data-bind="widget: balin.model.Widget, activity: 'sort', params: 'sss'">Widget Activity link simple param</a><br />
	<a href="" data-bind="widget: balin.model.Widget, activity: 'status', params: 0">Widget Action link simple numeric param</a><br />
	<a href="" rel="tooltip" title="My tooltip" data-bind="widget: balin.model.Widget, activity: 'sort'">Widget Activity link no params with tooltip</a><br />

</div>

<script>
	window.onload = (function () {
		balin.model.Tooltip = new Maslosoft.Ko.BalinDev.Models.Tooltip({title: 'This is tooltip'});
		balin.model.Widget = {
			id: 'ms_2'
		};
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
		});
</script>
<?php require __DIR__ . '/_footer.php'; ?>