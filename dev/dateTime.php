<?php require './_header.php'; ?>
NOTE: By default datetime bindings are registered with default options.
To customize, re-register with custom options possibly with other name too.<br />
Unix timestamp value:
<input type="text" data-bind="textInput: app.model.DateTime.date"/>
Date time:
<div data-bind="dateTimeFormatter: app.model.DateTime.date"></div>
Date:
<div data-bind="dateFormatter: app.model.DateTime.date"></div>
Time:
<div data-bind="timeFormatter: app.model.DateTime.date"></div>
Time ago:
<div data-bind="timeAgoFormatter: app.model.DateTime.date"></div>
Locale date time
<div data-bind="localeDateTime: app.model.DateTime.date"></div>
Locale date time with ko punches
<div localeDateTime="{{app.model.DateTime.date}}"></div>


<script>
	jQuery(document).ready(function () {
		// Custom register time related binding handlers
		Maslosoft.Ko.Balin.register('localeDateTime', new Maslosoft.Ko.Balin.DateTimeFormatter({displayFormat: 'LL'}));

		app.model.DateTime = new Maslosoft.Ko.BalinDev.Models.DateTime();
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
