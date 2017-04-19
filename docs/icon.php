<?php

use Maslosoft\Ilmatar\Widgets\Form\ActiveForm;
use Maslosoft\Ilmatar\Components\Controller;
?>
<?php

/* @var $this Controller */
/* @var $form ActiveForm */
?>

<?php require __DIR__ . '/_header.php'; ?>
<title>Icon</title>
<h1>Icon</h1>
<div>
	Note: src atrtibute will be broken in this example<br />
	<img data-bind="icon: balin.model.Image" /><br />

	Size: <input data-bind="textInput: balin.model.Icon.iconSize" /><br />
	<img data-bind="icon: balin.model.Icon" />
	<br />
	Svg example (should not add scaling params):<br/>
	<img data-bind="icon: balin.model.svg" />
	<br />
	<div data-bind="text: balin.model.Image.icon"></div>
	<div data-bind="text: balin.model.Image.isImage"></div>
	<div data-bind="text: balin.model.Image.iconSize"></div>

</div>

<script>
	window.onload = (function(){
		balin.model.Image = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/maslosoft.png',
			isImage: true,
			iconSize: 64,
			updateDate: 123
		});
		balin.model.Icon = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/maslosoft.png',
			isImage: false,
			iconSize: 64
		});
		balin.model.svg = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/balin.svg',
			isImage: true,
			iconSize: 64
		});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
