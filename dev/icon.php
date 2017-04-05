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
	Note: src atrtibute will be broken in this example<br />
	<img data-bind="icon: app.model.Image" /><br />

	Size: <input data-bind="textInput: app.model.Icon.iconSize" /><br />
	<img data-bind="icon: app.model.Icon" />
	<br />
	Svg example (should not add scaling params):<br/>
	<img data-bind="icon: app.model.svg" />
	<br />
	<div data-bind="text: app.model.Image.icon"></div>
	<div data-bind="text: app.model.Image.isImage"></div>
	<div data-bind="text: app.model.Image.iconSize"></div>

</div>

<script>
	jQuery(document).ready(function(){
		app.model.Image = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/maslosoft.png',
			isImage: true,
			iconSize: 64,
			updateDate: 123
		});
		app.model.Icon = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/maslosoft.png',
			isImage: false,
			iconSize: 64
		});
		app.model.svg = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/balin.svg',
			isImage: true,
			iconSize: 64
		});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
