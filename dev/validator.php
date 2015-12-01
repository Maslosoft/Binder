<?php require './_header.php'; ?>
<div data-bind="with: app.model.TextValue">
	Validate input if it's only a-z: <br />
	<input data-bind="textInput: text, validator: {class: Maslosoft.Ko.BalinDev.Validator, pattern: '^[a-z]+$'}" style="width:50%;"/> <br />
</div>
<div data-bind="with: app.model.TextValue">
	Validate textarea if it's only a-z: <br />
	<textarea data-bind="textInput: text, validator: {class: Maslosoft.Ko.BalinDev.Validator, pattern: '^[a-z]+$'}" style="width:50%;"></textarea> <br />
</div>
<div data-bind="with: app.model.TextValue">
	Validate contenteditable if it's only a-z: <br />
	<div data-bind="htmlValue: text, validator: {class: Maslosoft.Ko.BalinDev.Validator, pattern: '^[a-z]+$'}" style="width:50%;"></div> <br />
</div>


<script>
	jQuery(document).ready(function () {
		var data = {
			text: 'Text value'
		};
		app.model.TextValue = new Maslosoft.Ko.BalinDev.Models.TextValue(data);
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>