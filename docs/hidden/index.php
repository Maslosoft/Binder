<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Hidden</title>
<h1>Hidden</h1>
<p>
	Hidden binding handler is opposite to built into knockout JS <code>visible</code> binding.
	This will hide element when value evaluates to true.
</p>
<!-- /trim -->
<div>
	<label>
		<input type="checkbox" data-bind="checked: binder.model.Hidden.show, checkedValue: true, uncheckValue: false" value="0" />
		Check to show
	</label>
	<br />
	<div data-bind="hidden: binder.model.Hidden.show">Hidden if checked</div>
	<div data-bind="visible: binder.model.Hidden.show">Visible if checked</div>
</div>

<script>
	window.onload = (function(){
		binder.model.Hidden = new Maslosoft.Koe.Hidden({show: true});
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
