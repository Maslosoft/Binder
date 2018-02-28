<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Decimal Formatter</title>
<h1>Decimal Formatter</h1>
<p>
	Decimal formatter is a one way binding that can be used to format floating point 
	values. This includes setting precision, decimal separator, thousand separator
	as well allows adding prefixes and suffixes - mostly for currencies displaying.
</p>
<h4>Live Example</h4>
<!-- /trim -->
<table class="table table-condensed">
	<tr>
		<th>Raw Value</th>
		<td>
			<input data-bind="textInput: balin.model.DecimalFormatter.value"/>
		</td>
	</tr>
	<tr>
		<th>Formatted</th>
		<td>
			<span data-bind="decimalFormatter: balin.model.DecimalFormatter.value"></span>
		</td>
	</tr>
	<tr>
		<th>Formatting customized</th>
		<td>
			 <span 
			 data-bind="
			 	decimalFormatter: balin.model.DecimalFormatter.value, 
			 	precision: 3, 
			 	thousandSeparator: ',', 
			 	decimalSeparator: '.', 
			 	suffix: '&yen;'
			 	"></span>
		</td>
	</tr>
	<tr>
		<th>Formatting prefix</th>
		<td>
			<span 
			data-bind="
				decimalFormatter: balin.model.DecimalFormatter.value, 
				prefix: '$'
				"></span>
		</td>
	</tr>
	<tr>
		<th>Formatted with ko punches</th>
		<td>
			<span decimalFormatter="{{balin.model.DecimalFormatter.value}}"></span>
		</td>
	</tr>
</table>

<script>
	window.onload = (function(){
		balin.model.DecimalFormatter = new Maslosoft.Koe.DecimalFormatter({value: 234123.4567});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>