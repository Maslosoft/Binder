<?php require __DIR__ . '/../_header.php'; ?>
<title>Eval</title>
<h1>Eval</h1>
<h3>
	Evaluate bindigs if true<br />
	<small>When not true, binding will not be processed</small><br />
</h3>
<p class="alert alert-danger">
	This is experimental/broken, do not use
</p>
<p>
	Place those on parent element, or via doc comment notation<br />
</p>
<label>
	<input type="checkbox" name="isSelected" data-bind="checked: binder.model.eval.isSelected">
	Enable bindings
</label>
<div data-bind="with: binder.model">
	<p data-bind="eval: eval.isSelected">
	<div data-bind="text: txt.text">This is text put in HTML</div>
</p>
</div>

<script>
	window.onload = (function () {
		var data = {
			text: 'This is text provided via javascript'
		};

		binder.model.txt = new Maslosoft.Koe.TextValue(data);
		binder.model.eval = new Maslosoft.Koe.Selected({isSelected: false});

		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
