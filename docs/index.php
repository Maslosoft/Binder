<?php require __DIR__ . '/_header.php'; ?>
<!-- trim -->
<title>Documentation</title>
<h1>Documentation</h1>
<!-- /trim -->
<?php
$textLines = [
	'These are demos and documentation for various binding handlers.<br />',
	'This text for example is editable, and is automatically',
	'updated in JavaScript view model.<br />',
	'Hit ctrl + <b>b</b>, <i>i</i>, <u>u</u> for <b>bold</b>,',
	'<i>italic</i>, <u>underline</u>, or try your other known ',
	'formatting shortcuts, try drag and drop, paste.<br />',
	'You can read or modify this text via JavaScript:<br />',
	'<ol>',
	'<li>Open a console</li>',
	'<li>Type <code>binder.model.intro.text</code> and press enter. Then ',
	'change something and try again.</li>',
	'<li>This text should appear also below second time, ',
	'but without editing mode. However any changes will be updated instantly</li>',
	'</ol>'
];
$text = implode("\n\t\t", $textLines);
array_walk($textLines, function(&$value, $index)
{
	$value = json_encode($value);
});
?>
<div data-bind="with: binder.model.intro">
	<div data-bind="htmlValue: text"></div>
	<hr />
	<div data-bind="html: text"></div>
</div>
<script type="text/javascript">
	window.onload = function () {
		// trim
		var introText = [
<?= implode(",\n\t\t\t\t", $textLines) . "\n"; ?>
			].join("\n")
		// /trim
		binder.model.intro = new Maslosoft.Koe.Intro({
			text: introText
		});
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	};
</script>
<?php require __DIR__ . '/_footer.php'; ?>
