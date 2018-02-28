<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>File Size Formatter</title>
<h1>File Size Formatter</h1>
<p>
	As a name states, this is a one way binding to display human readable file sizes
	in bytes, kilobytes, megabytes and so on up to YottaByte range.
</p>
<!-- /trim -->
<table class="table table-condensed">
	<tr>
		<th>Size</th>
		<td>
			<input data-bind="textInput: binder.model.FileSizeFormatter.size"/> (in bytes) <br />
		</td>
	</tr>
	<tr>
		<th>Formatted</th>
		<td>
			<span data-bind="fileSizeFormatter: binder.model.FileSizeFormatter.size"></span>
		</td>
	</tr>
	<tr>
		<th>Formatted with ko punches</th>
		<td>
			<span fileSizeFormatter="{{binder.model.FileSizeFormatter.size}}"></span>
		</td>
	</tr>
</table>

<script>
	window.onload = (function(){
		binder.model.FileSizeFormatter = new Maslosoft.Koe.FileSizeFormatter({size: 123456});
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
