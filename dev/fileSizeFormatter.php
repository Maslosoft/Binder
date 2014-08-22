<?php require './_header.php'; ?>
<div>
	Size: <input data-bind="textInput: app.model.Mangan.Image.size"/> <br />
	Formatted: <span data-bind="fileSizeFormatter: app.model.Mangan.Image.size"></span>
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Mangan = {};
		app.model.Mangan.Image = new Maslosoft.Mangan.Model.Image({size: 123456});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>