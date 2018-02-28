<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Enum Formatter</title>
<h1>Enum Formatter</h1>
<p>
	Enum formatter binding handler is specifically created to display human readable text depending on
	enumerable bindable value. Use case include but are not limited to
	displaying different status texts for different data.
</p>
<h4>Live Example</h4>
<p>
	In this example numeric enumerable data is displayed in human readable text value.
</p>
<div class="well">
<!-- /trim -->
	<label>
	Raw Status: <input data-bind="textInput: balin.model.Enum.status"/> (0, 1, 2, 3) <br />
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
	Formatted: <span data-bind="enumFormatter: {data: balin.model.Enum.status, values:['Zero', 'One', 'Two', 'Three']}"></span>
	
<!-- trim -->
<br />
</div>
<p class="alert alert-warning">
	NOTE: <code>checkedValue</code> is required in this example, as status values are integers.
</p>

<script>
	window.onload = (function(){
		balin.model.Enum = new Maslosoft.Koe.Enum({status: 1});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
