<?php require './_header.php'; ?>
<h3>
	Data dynamic binding<br />
	<small>Will apply data-* attributes</small>
</h3>
<p>
	<div data-bind="data.title: app.model.txt1.text">This div should have data-title of a simple string value</div>
	<div data-bind="data.model: app.model.txt1">This div should have data-model of json encoded object value</div>
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
