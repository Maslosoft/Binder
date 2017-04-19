<?php require __DIR__ . '/_header.php'; ?>
<title>File Size Formatter</title>
<h1>File Size Formatter</h1>
<div>
	Size: <input data-bind="textInput: balin.model.FileSizeFormatter.size"/> (in bytes) <br />
	Formatted: <span data-bind="fileSizeFormatter: balin.model.FileSizeFormatter.size"></span> <br />
	Formatted with ko punches: <span fileSizeFormatter="{{balin.model.FileSizeFormatter.size}}"></span>
</div>

<script>
	window.onload = (function(){
		balin.model.FileSizeFormatter = new Maslosoft.Ko.BalinDev.Models.FileSizeFormatter({size: 123456});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
