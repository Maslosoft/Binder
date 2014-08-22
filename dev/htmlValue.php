<?php require './_header.php'; ?>
<b>WARNING: This binding <i>require</i> parent context, like here with `with` binding</b>
<div data-bind="with: app.model.Mangan.Image">
	Input: <input data-bind="textInput: filename" style="width:50%;"/> <br />
	This should be editable: <span data-bind="htmlValue: filename"></span> <br />
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Mangan = {};
		app.model.Mangan.Image = new Maslosoft.Mangan.Model.Image({filename: 'Some text, also <b>with</b> <abbr title="HyperText Markup Language">HTML</abbr>'});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>