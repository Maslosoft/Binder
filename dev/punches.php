<?php require './_header.php'; ?>
<h3>
	Punches bindings<br />
	<small></small>
</h3>
<p class="error">
	Does not work when using `with` binding
</p>
<p data-bind="with: app.model.txt1">
	<input data-bind="textInput: text"></input>
<div>This should be escaped value: {{app.model.txt1.text}}</div>
<div>This should have html value: {{{app.model.txt1.text}}}</div>
<span rel="tooltip" title="{{app.model.txt1.text}}" data-original-title="{{app.model.txt1.text}}">This should have title attribute value of {{app.model.txt1.text}}</span>
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
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
	});
</script>
<?php require './_footer.php'; ?>
