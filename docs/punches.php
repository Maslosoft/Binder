<?php require __DIR__ . '/_header.php'; ?>
<title>Punches</title>
<h1>Punches</h1>
<h3>
	Punches bindings<br />
	<small></small>
</h3>
<p class="error">
	Does not work when using `with` binding
</p>
<p data-bind="with: balin.model.txt1">
	<input data-bind="textInput: text"></input>
<div>This should be escaped value: {{balin.model.txt1.text}}</div>
<div>This should have html value: {{{balin.model.txt1.text}}}</div>
<span rel="tooltip" title="{{balin.model.txt1.text}}" data-original-title="{{balin.model.txt1.text}}">This should have title attribute value of {{balin.model.txt1.text}}</span>
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
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
