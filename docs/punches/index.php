<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Punches</title>
<h1>Punches</h1>
<h3>
	Punches bindings<br />
	<small></small>
</h3>
<p>
	Punches is a <a href="https://mbest.github.io/knockout.punches/" target="_blank">knockut JS library</a> bundled with this package. It provides natural syntax for binding handlers.
</p>
<p class="alert alert-danger">
	Does not work when using <code>with</code> binding
</p>
<!-- /trim -->
<p data-bind="with: binder.model.txt1">
	<input data-bind="textInput: text"></input>
	<div>This should be escaped value: {{binder.model.txt1.text}}</div>
	<div>This should have html value: {{{binder.model.txt1.text}}}</div>
	<span rel="tooltip" title="{{binder.model.txt1.text}}" data-original-title="{{binder.model.txt1.text}}">This should have title attribute value of {{binder.model.txt1.text}}</span>
</p>

<script>
	window.onload = (function () {
		var data1 = {
			text: 'Val1'
		};
		var data2 = {
			text: 'Val2'
		};
		var data3 = {
			text: 'Val3'
		};

		binder.model.txt1 = new Maslosoft.Koe.TextValue(data1);
		binder.model.txt2 = new Maslosoft.Koe.TextValue(data2);
		binder.model.txt3 = new Maslosoft.Koe.TextValue(data3);

		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
