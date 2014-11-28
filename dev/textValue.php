<?php require './_header.php'; ?>
<b class="warn">WARNING: This binding <i>require</i> parent context, like here with `with` binding</b>
<div data-bind="with: app.model.TextValue">
	Standard input field: <input data-bind="textInput: text" style="width:50%;"/> <br />
	This should be editable and ignore any html from above input: <span data-bind="textValue: text"></span> <br />
</div>

<script>
	jQuery(document).ready(function(){
		var data = {
			text: 'Some text, also <b>with</b> <abbr title="HyperText Markup Language">HTML</abbr>'
		};
		app.model.TextValue = new Maslosoft.Ko.BalinDev.Models.TextValue(data);
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>