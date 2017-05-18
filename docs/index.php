<?php require __DIR__ . '/_header.php'; ?>
<title>Documentation</title>
<h1>Documentation</h1>
<?php
$textLines = [
	'These are demos for various binding handlers.<br />',
	'This text for example is editable, and is automatically updated in javascript view model.<br />',
	'Hit ctrl + <b>b</b>, <i>i</i>, <u>u</u> for <b>bold</b>, <i>italic</i>, <u>underline</u>, or try your other known formatting shortcuts, try drag and drop, paste.<br />',
	'You can read or modify this text via JavaScript:<br />',
	'<ol>',
	'<li>Open a console</li>',
	'<li>Type `balin.model.intro.text` and press enter. Then change something and try again.</li>',
	'<li>This text should appear also below second time, but without editing mode.</li>',
	'</ol>'
];
$text = implode("\n\t\t", $textLines);
array_walk($textLines, function(&$value, $index)
{
	$value = json_encode($value);
});
?>
<div data-bind="with: balin.model.intro">
	<div data-bind="htmlValue: text">
		<!--For web spiders, this will be replaced by JavaScript, so here can be placed anything, usually empty-->
		<?= $text; ?>..
		<!--This comments will vanish too-->
	</div>
	<hr />
	<div data-bind="html: text"></div>
</div>
<script type="text/javascript">
	window.onload = function () {
		balin.model.intro = new Maslosoft.Ko.BalinDev.Models.Intro({
			text: [
<?= implode(",\n\t\t\t\t", $textLines) . "\n"; ?>
			].join("\n")
		});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	};
</script>
<?php require __DIR__ . '/_footer.php'; ?>
