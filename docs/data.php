<?php require __DIR__ . '/_header.php'; ?>
<title>Data Attribute</title>
<h1>Data Attribute</h1>
<h3>
	Data dynamic binding<br />
	<small>Will apply data-* attributes</small>
</h3>
<p>
<div data-bind="data.title: balin.model.txt1.text">This div should have data-title of a simple string value</div>
<div data-bind="data.model: balin.model.txt1">This div should have data-model of json encoded object value</div>
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

		balin.model.txt1 = new Maslosoft.Ko.BalinDev.Models.TextValue(data1);
		balin.model.txt2 = new Maslosoft.Ko.BalinDev.Models.TextValue(data2);
		balin.model.txt3 = new Maslosoft.Ko.BalinDev.Models.TextValue(data3);

		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
