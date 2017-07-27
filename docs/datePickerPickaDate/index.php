<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Date Picker - Pick a Date</title>
<h1>Date Picker - Pick A Date</h1>
<p>
	Experimental date picker based on pick a date. This demo will most probably not work at all...
</p>
<p class="alert alert-danger">
	Not recommended, use <a href="datePicker.php"> datePicker</a> instead
</p>
<!-- /trim -->
<div class="input-group col-md-4 col-sm-6">
	<input data-bind="datePickerPickaDate: balin.model.datePicker.date" type="text" class="form-control"/>
</div>
<div data-bind="text: balin.model.datePicker.date">

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
<?php require __DIR__ . '/../_footer.php'; ?>