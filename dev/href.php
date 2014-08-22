<?php require './_header.php'; ?>
<div>
	Link href: <input data-bind="textInput: app.model.Mangan.Image.filename"/> <br />
	Link: <a data-bind="href: app.model.Mangan.Image.filename">This should point to above url</a> <br />
	Link: <a data-bind="href: app.model.Mangan.Image.filename" target="_blank">This should open in new window</a> <br />
	<a data-bind="click: function(){app.model.Mangan.Image.filename = '#';}" href="#">Set href to `#`</a> <br />
	<span onclick="alert('Clicked on span around link')">Link: <a data-bind="href: app.model.Mangan.Image.filename">This should show alert</a></span> <br />
	<span onclick="alert('Clicked on span around link')">Link: <a data-bind="href: app.model.Mangan.Image.filename, stopPropagation: true">This should <i>not</i> show alert</a></span> <br />
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Mangan = {};
		app.model.Mangan.Image = new Maslosoft.Mangan.Model.Image({filename: 'http://example.com/'});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>