<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Text Value</title>
<h1>Text Value</h1>
<p>
	Text Value binding handler is similar to <a href="../htmlValue/">HTML Value</a> binding,
	but it will not allow HTML. All tags will be converted to it's entities values.
</p>
<p>
	In other words, placing <code>textValue</code> binding handler on any element will
	make it behave like a text input.
</p>
<p class="alert alert-danger">
	WARNING: This binding <i>require</i> parent context, like here with <code>with</code> binding
</p>

<!-- /trim -->
<div data-bind="with: balin.model.TextValue">
	Standard input field: <input data-bind="textInput: text" style="width:50%;"/> <br />
	Below block should be editable and ignore any html from above input: 
	<div data-bind="textValue: text" class="well"></div>
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
<?php require __DIR__ . '/../_footer.php'; ?>