<?php

use Maslosoft\Widgets\JavaScript\Packages\BootstrapDatepickerPackage;
?>
<?php require __DIR__ . '/../_header.php'; ?>

<?php if (KO_BALIN_EMBEDDED): ?>
	<?php new BootstrapDatepickerPackage ?>
<?php endif; ?>
<!-- trim -->
<title>Date Picker</title>
<h1>Date Picker</h1>
<p>
	This binding handler is bootstrap datepicker based. Picker is meant to be used additionally, leaving input
	for typing with keyboard.
</p>
<h4>Ninja Skills</h4>
<p>
	This component is enchanced with <a href="http://www.datejs.com/" target="_blank">Date JS</a>, so it has some ninja
	features. Try to type "now", "sunday", "next monday" into date inputs and then press <kbd>Enter</kbd>.
	Other options include, but are not limited to:
	<ul>
		<li>+1 day</li>
		<li>+5 weeks</li>
		<li>-2 years</li>
		<li>+2 y</li>
	</ul>
</p>
<h4>Live Example</h4>
<!-- /trim -->
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
<div data-bind="dateFormatter: balin.model.datePicker.date" class="label label-success"></div>
<!-- trim -->
<p>
<br />
<a class="btn btn-success" href="#" data-bind="click: function(){balin.model.datePicker.date = Math.round(Date.now() / 1000) - 200000;}">Set a bit to past</a>
<a class="btn btn-success" href="#" data-bind="click: function(){balin.model.datePicker.date = Math.round(Date.now() / 1000);}">Set date to now</a>
<a class="btn btn-success" href="#" data-bind="click: function(){balin.model.datePicker.date = Math.round(Date.now() / 1000) + 200000;}">Set a bit to future</a>
</p>
<!-- /trim -->
<script>
	window.onload = (function(){
		balin.model.datePicker = new Maslosoft.Koe.DatePicker;
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>