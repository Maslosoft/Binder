<?php require __DIR__ . '/_header.php'; ?>
<title>Date time</title>
<h1>Date time</h1>
NOTE: By default datetime bindings are registered with default options.
To customize, re-register with custom options possibly with other name too.<br />
Unix timestamp value:
<input type="text" data-bind="textInput: balin.model.DateTime.date"/>
Date time:
<div data-bind="dateTimeFormatter: balin.model.DateTime.date"></div>
Date:
<div data-bind="dateFormatter: balin.model.DateTime.date"></div>
Time:
<div data-bind="timeFormatter: balin.model.DateTime.date"></div>
Time ago:
<div data-bind="timeAgoFormatter: balin.model.DateTime.date"></div>
Locale date time
<div data-bind="localeDateTime: balin.model.DateTime.date"></div>
Locale date time with ko punches
<div localeDateTime="{{balin.model.DateTime.date}}"></div>


<script>
	window.onload = (function () {
		// Custom register time related binding handlers
		Maslosoft.Ko.Balin.register('localeDateTime', new Maslosoft.Ko.Balin.DateTimeFormatter({displayFormat: 'LL'}));

		balin.model.DateTime = new Maslosoft.Ko.BalinDev.Models.DateTime();
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
