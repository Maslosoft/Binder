<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Widget</title>
<h1>Widget</h1>
<p>
	Widget Binding Handler creates widget dynamically. This binding handler will
    apply params to widget and call <code>init</code> method if available when
    creating widget and <code>dispose</code> method when widget should be destroyed.
</p>
<p>
    Both <code>init</code> and <code>dispose</code> method will receive current
    element as parameter.
</p>
<p>
    All parameters passed to <code>params</code> will be applied to widget <i>object</i>
    matching parameter name to object instance property name.
</p>
<p>
    The <code>ref</code> option will set value of passed reference <i>name</i> to
    widget instance. The <code>ref</code> value <i>must</i> be of type string, representing
    path to javascript reference. Using this parameter it is possible to use widget
    outside Knockout JS scope.
</p>
<h5>Example Widget Output:</h5>
<a href="javascript://" onclick="balin.model.toggle.enabled = !balin.model.toggle.enabled">Toggle Widget</a>
|
    <a href="javascript://" onclick="console.log(balin.model.ref);">Show ref (in console)</a>
<!-- /trim -->
<!-- ko if: balin.model.toggle.enabled -->
<div data-bind="widget: Maslosoft.Ko.BalinDev.Widgets.MyWidget,params: {title:'My Title'},ref: 'balin.model.ref'" class="well">

</div>
<!-- /ko -->
<!-- trim -->
<h5>Widget log:</h5>
<div id="widgetLog" class="well">

</div>
<!-- /trim -->
<script>
	window.onload = (function () {
		balin.model.toggle = ko.tracker.factory({enabled: true});

		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>