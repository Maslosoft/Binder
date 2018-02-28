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
<p>
    However when <code>ref</code> is object, and no <code>widget</code> param is present,
    this binding will reuse existing object.
</p>
<h5>Example Widget Output:</h5>
<a href="javascript://" onclick="binder.model.toggle.enabled = !binder.model.toggle.enabled">Toggle Widget</a>
|
    <a href="javascript://" onclick="console.log(binder.model.ref);">Show ref (in console)</a>
<!-- /trim -->
<!-- ko if: binder.model.toggle.enabled -->
<div data-bind="widget: Maslosoft.BinderDev.Widgets.MyWidget,params: {title:'My Title'},ref: 'binder.model.ref'" class="well">

</div>
<!-- /ko -->
<!-- trim -->
<h5>Widget log:</h5>
<div id="widgetLog" class="well">

</div>
    <h5>Example Widget With <code>ref</code> reusing existing object:</h5>
<!-- /trim -->
    <div data-bind="ref: binder.widget.other" class="well">

    </div>
<!-- trim -->
    <h5>Widget log of second widget:</h5>
    <div id="widgetLog2" class="well">

    </div>
<!-- /trim -->
<script>
	window.onload = (function () {
		binder.model.toggle = ko.tracker.factory({enabled: true});

		binder.widget.other = new Maslosoft.BinderDev.Widgets.MyOtherWidget();
        binder.widget.other.title = 'Title set in JavaScript';

		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>