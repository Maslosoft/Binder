<?php require __DIR__ . '/../_header.php'; ?>
<title>Decimal Formatter</title>
<h1>Decimal Formatter</h1>
<div>
	Value: <input data-bind="textInput: balin.model.DecimalFormatter.value"/><br />
	Formatted: <span data-bind="decimalFormatter: balin.model.DecimalFormatter.value"></span> <br />
	Formatting customized: <span data-bind="decimalFormatter: balin.model.DecimalFormatter.value, precision: 3, thousandSeparator: ',', decimalSeparator: '.', suffix: '&yen;'"></span> <br />
	Formatting prefix: <span data-bind="decimalFormatter: balin.model.DecimalFormatter.value, prefix: '$'"></span> <br />
	Formatted with ko punches: <span decimalFormatter="{{balin.model.DecimalFormatter.value}}"></span>
</div>

<script>
	window.onload = (function(){
		balin.model.DecimalFormatter = new Maslosoft.Ko.BalinDev.Models.DecimalFormatter({value: 234123.4567});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>