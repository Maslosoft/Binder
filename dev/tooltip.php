<?php require './_header.php'; ?>
<div>
	This adds tooltips dymanically without reinitializing tooltip on update.<br/>
	NOTE: This requires to slightly different tooltip initialization, using <code>selector</code> option.<br/>
	Example included in this page.<br />
	<input data-bind="textInput: app.model.Tooltip.title"></input><br/>
	<b data-bind="tooltip: app.model.Tooltip.title">Should have tooltip</b>
</div>

<script>
	jQuery(document).ready(function () {
		app.model.Tooltip = new Maslosoft.Ko.BalinDev.Models.Tooltip({title: 'This is tooltip text'});
		ko.applyBindings({model: app.model});
		jQuery('body').tooltip({
			selector: '[rel~="tooltip"]'
		});
	});
</script>
<?php require './_footer.php'; ?>
