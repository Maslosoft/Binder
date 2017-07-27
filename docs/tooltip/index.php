<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Tooltip</title>
<h1>Tooltip</h1>
<p>
	This adds tooltips dymanically without reinitializing tooltip on update.
</p>
<p>
	Try to change text in input, this will update tooltip too.
</p>
<p class="alert alert-warning">
	NOTE: This requires slightly different tooltip initialization, using <code>selector</code> option.
</p>
<!-- /trim -->
<div>
	<input data-bind="textInput: balin.model.Tooltip.title"></input><br/>
	<b data-bind="tooltip: balin.model.Tooltip.title">Should have tooltip</b>
</div>

<script>
	window.onload = (function () {
		balin.model.Tooltip = new Maslosoft.Ko.BalinDev.Models.Tooltip({title: 'This is tooltip text'});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
