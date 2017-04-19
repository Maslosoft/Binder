<?php require __DIR__ . '/_header.php'; ?>
<title>Hidden</title>
<h1>Hidden</h1>
<div>
	<label>
		<input type="checkbox" data-bind="checked: balin.model.Hidden.show, checkedValue: true, uncheckValue: false" value="0" />
		Check to show
	</label>
	<br />
	<div data-bind="hidden: balin.model.Hidden.show">Hidden if checked</div>
	<div data-bind="visible: balin.model.Hidden.show">Visible if checked</div>
</div>

<script>
	window.onload = (function(){
		balin.model.Hidden = new Maslosoft.Ko.BalinDev.Models.Hidden({show: true});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
