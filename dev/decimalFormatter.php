<?php require './_header.php'; ?>
<div>
	Value: <input data-bind="textInput: app.model.DecimalFormatter.value"/><br />
	Formatted: <span data-bind="decimalFormatter: app.model.DecimalFormatter.value"></span> <br />
	Formatting customized: <span data-bind="decimalFormatter: app.model.DecimalFormatter.value, precision: 3, thousandSeparator: ',', decimalSeparator: '.', suffix: '&yen;'"></span> <br />
	Formatting prefix: <span data-bind="decimalFormatter: app.model.DecimalFormatter.value, prefix: '$'"></span> <br />
	Formatted with ko punches: <span decimalFormatter="{{app.model.DecimalFormatter.value}}"></span>
</div>

<script>
	jQuery(document).ready(function(){
		app.model.DecimalFormatter = new Maslosoft.Ko.BalinDev.Models.DecimalFormatter({value: 234123.4567});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>