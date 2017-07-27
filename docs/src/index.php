<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>SRC Attribute</title>
<h1>SRC Attribute</h1>
<p>
	Src binding handler is a shorthand for elements which require <code>src</code>
	attribute to be dynamically updated. This applies to images and iframes.
</p>
<!-- /trim -->
<div data-bind="with: balin.model.Src">
	Filename: <input data-bind="textInput: filename" style="width:50%;"/> <br />
	<a href="#" onclick="balin.model.Src.filename = 'images/maslosoft.png';return false;">Set to image 1</a> |
	<a href="#" onclick="balin.model.Src.filename = 'images/maslosoft2.png';return false;">Set to image 2</a> <br />
	Image: <img data-bind="src: filename"></img> <br />
	Image with punches: <img src="{{filename}}"></img> <br />
</div>

<script>
	window.onload = (function(){
		balin.model.Src = new Maslosoft.Ko.BalinDev.Models.Src({filename: 'images/maslosoft.png'});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>