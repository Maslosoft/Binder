<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Enum CSS Formatter</title>
<h1>Enum CSS Formatter</h1>
<p>
	This binding handler is specifically created to apply CSS classes depending on
	enumerable bindable value. Use case include but are not limited to
	displaying different colors for different status of data.
</p>
<h4>Live Example</h4>
<p>
	In this example proper color is displayed based on numeric value. Additionally
	label is has text value set via <a href="../enumFormatter/">Enum Formatter</a>
</p>
<div class="well">
<!-- /trim -->
	<label>
	Raw Status Value <input data-bind="textInput: balin.model.Enum.status"/> (0, 1, 2, 3)
	</label>
	<br />
	<label>
		<input type="radio" data-bind="checked: balin.model.Enum.status, checkedValue: 0" value="0" />
		Status Zero
	</label>
	<label>
		<input type="radio" data-bind="checked: balin.model.Enum.status, checkedValue: 1" value="1" />
		Status One
	</label>
	<label>
		<input type="radio" data-bind="checked: balin.model.Enum.status, checkedValue: 2" value="2" />
		Status Two
	</label>
	<label>
		<input type="radio" data-bind="checked: balin.model.Enum.status, checkedValue: 3" value="3" />
		Status Three
	</label>
	<br />
	Formatted: <span class="label" data-bind="enumCssClassFormatter: {data: balin.model.Enum.status, values:['label-danger', 'label-warning', 'label-info', 'label-success']}, enumFormatter: {data: balin.model.Enum.status, values:['Zero', 'One', 'Two', 'Three']}"></span>
	<br />
<!-- trim -->

</div>
<p class="alert alert-warning">
	<code>checkedValue</code> in this example is required here, as status values are integers.
</p>
<!-- /trim -->

<script>
	window.onload = (function(){
		balin.model.Enum = new Maslosoft.Koe.Enum({status: 1});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
