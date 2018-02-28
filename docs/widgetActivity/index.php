<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Widget Activity</title>
<h1>Widget Activity</h1>
<p>
	Widget Action Binding Handler creates widget activity url dynamically. The widget
	activity is a standard formatted URL from <a href="/ilmatar-widgets/">Ilmatar Widgets</a>
	project to feed non-data-changing actions.
</p>
<!-- /trim -->
<div>
	<a href="" data-bind="widgetId: 'ms_1', activity: 'sort', params: {name: 'asc'}">Acitivity link</a><br />
	<a href="" data-bind="widget: binder.model.Widget, activity: 'sort', params: {name: 'asc'}">Widget Activity link</a><br />
	<a href="" data-bind="widget: binder.model.Widget, activity: 'sort', params: 'sss'">Widget Activity link simple param</a><br />
	<a href="" data-bind="widget: binder.model.Widget, activity: 'status', params: 0">Widget Action link simple numeric param</a><br />
	<a href="" rel="tooltip" title="My tooltip" data-bind="widget: binder.model.Widget, activity: 'sort'">Widget Activity link no params with tooltip</a><br />

</div>

<script>
	window.onload = (function () {
		binder.model.Tooltip = new Maslosoft.Koe.Tooltip({title: 'This is tooltip'});
		binder.model.Widget = {
			id: 'ms_2'
		};
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
		});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>