<?php require './_header.php'; ?>
<div>
	Size: <input data-bind="textInput: app.model.FileSizeFormatter.size"/> (in bytes) <br />
	Formatted: <span data-bind="fileSizeFormatter: app.model.FileSizeFormatter.size"></span> <br />
	Formatted with ko punches: <span fileSizeFormatter="{{app.model.FileSizeFormatter.size}}"></span>
</div>

<script>
	jQuery(document).ready(function(){
		app.model.FileSizeFormatter = new Maslosoft.Ko.BalinDev.Models.FileSizeFormatter({size: 123456});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
