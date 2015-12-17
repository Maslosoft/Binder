<?php require './_header.php'; ?>
<h3>
	Model data binding<br />
	<small>Will apply data-model attribute with optionally selected fields</small>
</h3>
<p>
	<div data-bind="model: app.model.txt1">This div should have data-model with all fields</div>
	<div data-bind="model: app.model.txt2, fields: ['text']">This div should have data-model with text field</div>
	<div data-bind="model: app.model.txt2, fields: ['text', 'bogus']">This div should have data-model with text field and ignore `bogus` field (should console warn)</div>
</p>

<script>
	jQuery(document).ready(function () {
		var data1 = {
			text: 'Val1'
		};
		var data2 = {
			text: 'Val2'
		};
		var data3 = {
			text: 'Val3'
		};

		app.model.txt1 = new Maslosoft.Ko.BalinDev.Models.TextValue(data1);
		app.model.txt2 = new Maslosoft.Ko.BalinDev.Models.TextValue(data2);
		app.model.txt3 = new Maslosoft.Ko.BalinDev.Models.TextValue(data3);

		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
