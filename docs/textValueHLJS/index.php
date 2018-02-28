<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Text Value HLJS</title>
<h1>Text Value HLJS</h1>
<p>
	This binding will make any element behave like text input - same as <a href="../textValue/"><code>textValue</code></a>, but additionally it will try to highlight code with <a href="https://highlightjs.org/">HLJS Library</a>.
</p>
<p class="alert alert-danger">WARNING: This binding <i>require</i> parent context, like here with <code>with</code> binding</p>
<!-- /trim -->
<div data-bind="with: binder.model.TextValue">
	Standard input field: <input data-bind="textInput: text" style="width:50%;"/> <br />
	Below should be editable and ignore any html from above input and have highlight: <div data-bind="textValueHlJs: text"></div>
</div>

<script>
	window.onload = (function(){
		var data = {
			text: 'Some text, also <b>with</b> <abbr title="HyperText Markup Language">HTML</abbr>'
		};
		binder.model.TextValue = new Maslosoft.Koe.TextValue(data);
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
