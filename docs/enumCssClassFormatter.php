<?php require __DIR__ . '/_header.php'; ?>
<title>Enum CSS Formatter</title>
<h1>Enum CSS Formatter</h1>
<div>
	Status: <input data-bind="textInput: balin.model.Enum.status"/> (0, 1, 2, 3) <br />
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
	NOTE: <code>checkedValue</code> is required here, as status values are integers.
</div>

<script>
	window.onload = (function(){
		balin.model.Enum = new Maslosoft.Ko.BalinDev.Models.Enum({status: 1});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
