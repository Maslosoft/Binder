<?php require __DIR__ . '/_header.php'; ?>
<title>Text Value</title>
<h1>Text Value</h1>
<b class="warn">WARNING: This binding <i>require</i> parent context, like here with `with` binding</b>
<div data-bind="with: balin.model.TextValue">
	Standard input field: <input data-bind="textInput: text" style="width:50%;"/> <br />
	This should be editable and ignore any html from above input: <span data-bind="textValue: text"></span> <br />
</div>

<script>
	window.onload = (function(){
		var data = {
			text: 'Some text, also <b>with</b> <abbr title="HyperText Markup Language">HTML</abbr>'
		};
		balin.model.TextValue = new Maslosoft.Ko.BalinDev.Models.TextValue(data);
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>