<?php require __DIR__ . '/_header.php'; ?>
<title>Date Picker</title>
<h1>Date Picker</h1>
<form class="form">
	<div class="form-group">
		<div class="input-group col-md-4 col-sm-6">
			<input data-bind="datePicker: balin.model.datePicker.date" type="text" class="form-control"/>
		</div>
	</div>
	<div class="form-group">
		<div class="input-group col-md-4 col-sm-6">
			<input data-bind="datePicker: balin.model.datePicker.date, dateOptions: {format: 'yyyy/mm/dd'}" type="text" class="form-control"/>
		</div>
	</div>
	<div class="form-group">
		<div class="input-group col-md-4 col-sm-6">
			<input data-bind="datePicker: balin.model.datePicker.date, dateOptions: {format: 'dd.mm.yyyy'}" type="text" class="form-control"/>
		</div>
	</div>
	<div class="form-group">
		<div class="input-group col-md-4 col-sm-6">
			<input data-bind="datePicker: balin.model.datePicker.date" type="text" class="form-control"/>
		</div>
	</div>
</form>
<div data-bind="dateFormatter: balin.model.datePicker.date">

</div>
<a href="#" data-bind="click: function(){balin.model.datePicker.date = Math.round(Date.now() / 1000) - 200000;}">Set a bit to past</a> <br/>
<a href="#" data-bind="click: function(){balin.model.datePicker.date = Math.round(Date.now() / 1000);}">Set date to now</a> <br />
<a href="#" data-bind="click: function(){balin.model.datePicker.date = Math.round(Date.now() / 1000) + 200000;}">Set a bit to future</a>
<script>
	window.onload = (function(){
		balin.model.datePicker = new Maslosoft.Ko.BalinDev.Models.DatePicker;
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>