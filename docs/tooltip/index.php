<?php require __DIR__ . '/../_header.php'; ?>
<title>Tooltip</title>
<h1>Tooltip</h1>
<div>
	This adds tooltips dymanically without reinitializing tooltip on update.<br/>
	NOTE: This requires to slightly different tooltip initialization, using <code>selector</code> option.<br/>
	Example included in this page.<br />
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
