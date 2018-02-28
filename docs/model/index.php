<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Data Model Attribute</title>
<h1>Data Model Attribute</h1>
<h3>
	Model data binding<br />
	<small>Will apply data-model attribute with optionally selected fields</small>
</h3>
<!-- /trim -->
<div data-bind="model: balin.model.txt1">Should have data-model with all fields</div>
<div data-bind="model: balin.model.txt2, fields: ['text']">Should have data-model with text field</div>
<div data-bind="model: balin.model.txt2, fields: ['text', 'bogus']">Should have data-model with text field and ignore `bogus` field (should console warn)</div>

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

		balin.model.txt1 = new Maslosoft.Koe.TextValue(data1);
		balin.model.txt2 = new Maslosoft.Koe.TextValue(data2);
		balin.model.txt3 = new Maslosoft.Koe.TextValue(data3);

		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
