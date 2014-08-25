<?php require './_header.php'; ?>
<?php
$textLines = [
	'These are demos for various binding handlers.',
	'This text for example is editable, and is automatically updated in javascript view model.',
	'Hit ctrl + one of <b>b</b>, <i>i</i>, <u>u</u> for <b>bold</b>, <i>italic</i>, <u>underline</u>, or try your other known formatting shortcuts, try drag and drop, paste.',
	'You can access this text via JavaScript:',
	'Open a console',
	'Type `app.model.intro.text` and press enter. Then change something and try again.',
	'This text should apear also below second time, but without editing.'
];
$text = implode('<br />', $textLines);
?>
<div data-bind="with: app.model.intro">
	<div data-bind="htmlValue: text">
		<!--For web spiders, this will be replaced by JavaScript, so here can be placed anything, usually empty-->
		<?= $text; ?>..
		<!--This comments will vanish too-->
	</div>
	<hr />
	<div data-bind="html: text"></div>
	<a href="javascript:debugger;">blah</a>
</div>
<script>
	jQuery(document).ready(function(){
		app.model.intro = new Maslosoft.Ko.BalinDev.Models.Intro({text: <?= json_encode($text); ?>});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
