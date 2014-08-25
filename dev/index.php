<?php require './_header.php'; ?>
<div data-bind="with: app.model.intro">
	  <div data-bind="htmlValue: text"></div>
	  <hr />
	  <div data-bind="html: text"></div>
	  <a href="javascript:debugger;">blah</a>
</div>
<script>
	jQuery(document).ready(function(){
		var textLines = [
			'These are demos for various binding handlers.',
			'This text for example is editable, and is automatically updated in javascript view model.',
			'Hit ctrl + one of <b>b</b>, <i>i</i>, <u>u</u> for <b>bold</b>, <i>italic</i>, <u>underline</u>, or try your other known formatting shortcuts, try drag and drop, paste.',
			'You can access this text via JavaScript:',
			'Open a console',
			'Type `app.model.intro.text` and press enter. Then change something and try again.',
			'This text should apear also below second time, but without editing.'
		];
		app.model.intro = new Maslosoft.KoBalinDev.Models.Intro({text: textLines.join('<br />')});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
