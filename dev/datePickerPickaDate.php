<?php require './_header.php'; ?>
<p class="text-danger">
	Not recommended, use <a href="datePicker.php"> datePicker</a> instead
</p>
<div class="input-group col-md-4 col-sm-6">
	<input data-bind="datePickerPickaDate: app.model.datePicker.date" type="text" class="form-control"/>
</div>
<div data-bind="text: app.model.datePicker.date">

</div>
<a href="#" data-bind="click: function(){app.model.datePicker.date = Math.round(Date.now() / 1000) - 200000;}">Set a bit to past</a> <br/>
<a href="#" data-bind="click: function(){app.model.datePicker.date = Math.round(Date.now() / 1000);}">Set date to now</a> <br />
<a href="#" data-bind="click: function(){app.model.datePicker.date = Math.round(Date.now() / 1000) + 200000;}">Set a bit to future</a>
<script>
	jQuery(document).ready(function(){
		app.model.datePicker = new Maslosoft.Ko.BalinDev.Models.DatePicker;
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>