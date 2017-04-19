<?php require __DIR__ . '/_header.php'; ?>
<title>HREF Attribute</title>
<h1>HREF Attribute</h1>
<div>
	Link href: <input data-bind="textInput: balin.model.Href.filename"/> <br />
	Link: <a data-bind="href: balin.model.Href.filename">This should point to above url</a> <br />
	Link: <a href="{{balin.model.Href.filename}}">Using ko punches</a> <br />
	Link: <a data-bind="href: balin.model.Href.filename" target="_blank">This should open in new window</a> <br />
	<a data-bind="click: function(){balin.model.Href.filename = '#';}" href="#">Set href to `#`</a> <br />
	<span onclick="alert('Clicked on span around link')">Link: <a data-bind="href: balin.model.Href.filename">This should show alert</a></span> <br />
	<span onclick="alert('Clicked on span around link')">Link: <a data-bind="href: balin.model.Href.filename, stopPropagation: true">This should <i>not</i> show alert</a></span> <br />
</div>

<script>
	window.onload = (function(){
		balin.model.Href = new Maslosoft.Ko.BalinDev.Models.Href({filename: 'http://example.com/'});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
