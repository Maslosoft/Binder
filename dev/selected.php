<?php require './_header.php'; ?>
Div below should be <span class="selected">selected</span> if `isSelected` evaluates to true <br />
<div data-bind="selected: app.model.Selected.isSelected">Selection div. Is selected? <span data-bind="text: app.model.Selected.isSelected"></span>.</div>
<a href="#" onclick="app.model.Selected.isSelected = true;">Select</a> |
<a href="#" onclick="app.model.Selected.isSelected = false;">Unselect</a> <br />


<script>
	jQuery(document).ready(function(){
		app.model.Selected = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: false});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>