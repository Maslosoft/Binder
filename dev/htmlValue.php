<?php require './_header.php'; ?>
<b class="warn">WARNING: This binding <i>require</i> parent context, like here with `with` binding</b>
<div data-bind="with: app.model.HtmlValue">
	Standard input field: <input data-bind="textInput: text" style="width:50%;"/> <br />
	This should be editable: <span data-bind="htmlValue: text"></span> <br />
</div>

<script>
	jQuery(document).ready(function(){
		app.model.HtmlValue = new Maslosoft.Ko.BalinDev.Models.HtmlValue({text: 'Some text, also <b>with</b> <abbr title="HyperText Markup Language">HTML</abbr>'});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>