<?php require './_header.php'; ?>
<div>
	<label>
		<input type="checkbox" data-bind="checked: app.model.Hidden.show, checkedValue: true, uncheckValue: false" value="0" />
		Check to show
	</label>
	<br />
	<div data-bind="hidden: app.model.Hidden.show">Hidden if checked</div>
	<div data-bind="visible: app.model.Hidden.show">Visible if checked</div>
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Hidden = new Maslosoft.Ko.BalinDev.Models.Hidden({show: true});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
