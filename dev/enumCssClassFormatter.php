<?php

use Maslosoft\Ilmatar\Widgets\Form\ActiveForm;
use Maslosoft\Ilmatar\Components\Controller;
?>
<?php
/* @var $this Controller */
/* @var $form ActiveForm */
?>

<?php require './_header.php'; ?>
<div>
	Status: <input data-bind="textInput: app.model.Enum.status"/> (0, 1, 2, 3) <br />
	<label>
		<input type="radio" data-bind="checked: app.model.Enum.status" value="0" />
		Status Zero
	</label>
	<label>
		<input type="radio" data-bind="checked: app.model.Enum.status" value="1" />
		Status One
	</label>
	<label>
		<input type="radio" data-bind="checked: app.model.Enum.status" value="2" />
		Status Two
	</label>
	<label>
		<input type="radio" data-bind="checked: app.model.Enum.status" value="3" />
		Status Three
	</label>
	<br />
	Formatted: <span class="label" data-bind="enumCssClassFormatter: {data: app.model.Enum.status, values:['label-danger', 'label-warning', 'label-info', 'label-success']}, enumFormatter: {data: app.model.Enum.status, values:['Zero', 'One', 'Two', 'Three']}"></span>
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Enum = new Maslosoft.Ko.BalinDev.Models.Enum({status: 1});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
