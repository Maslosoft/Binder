<?php require './_header.php'; ?>
NOTE: By default datetime bindings are registered with default options.
To customize, re-register with custom options possibly with other name too.<br />
<input type="text" data-bind="textInput: app.model.DateTime.date"/>
<div data-bind="localeDateTime: app.model.DateTime.date"></div>

<script>
	jQuery(document).ready(function () {
		// Custom register time related binding handlers
		ko.bindingHandlers.localeDateTime = new Maslosoft.Ko.Balin.DateTimeFormatter({displayFormat: 'LL'});

		app.model.DateTime = new Maslosoft.Ko.BalinDev.Models.DateTime();
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
