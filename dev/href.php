<?php require './_header.php'; ?>
<div>
	Link href: <input data-bind="textInput: app.model.Href.filename"/> <br />
	Link: <a data-bind="href: app.model.Href.filename">This should point to above url</a> <br />
	Link: <a href="{{app.model.Href.filename}}">Using ko punches</a> <br />
	Link: <a data-bind="href: app.model.Href.filename" target="_blank">This should open in new window</a> <br />
	<a data-bind="click: function(){app.model.Href.filename = '#';}" href="#">Set href to `#`</a> <br />
	<span onclick="alert('Clicked on span around link')">Link: <a data-bind="href: app.model.Href.filename">This should show alert</a></span> <br />
	<span onclick="alert('Clicked on span around link')">Link: <a data-bind="href: app.model.Href.filename, stopPropagation: true">This should <i>not</i> show alert</a></span> <br />
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Href = new Maslosoft.Ko.BalinDev.Models.Href({filename: 'http://example.com/'});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
