<?php require './_header.php'; ?>
<h3>
	Evaluate bindigs if true<br />
	<small>When not true, binding will not be processed</small><br />
</h3>
<p class="alert alert-danger">
	This is experimental/broken, do not use
</p>
<p>
	Place those on parent element, or via doc comment notation<br />
</p>
<label>
	<input type="checkbox" name="isSelected" data-bind="checked: app.model.eval.isSelected">
	Enable bindings
</label>
<div data-bind="with: app.model">
	<p data-bind="eval: eval.isSelected">
	<div data-bind="text: txt.text">This is text put in HTML</div>
</p>
</div>

<script>
	jQuery(document).ready(function () {
		var data = {
			text: 'This is text provided via javascript'
		};

		app.model.txt = new Maslosoft.Ko.BalinDev.Models.TextValue(data);
		app.model.eval = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: false});

		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
