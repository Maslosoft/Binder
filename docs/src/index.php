<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>SRC Attribute</title>
<h1>SRC Attribute</h1>
<p>
	Src binding handler is a shorthand for elements which require <code>src</code>
	attribute to be dynamically updated. This applies to images and iframes.
</p>
<h4>Live example</h4>
<p class="alert alert-success">
	In this example <code>with</code> binding is used, making HTML code even more clean.
</p>
<!-- /trim -->
<p data-bind="with: balin.model.Src">
	Filename: <input data-bind="textInput: filename" style="width:50%;"/> <br />
	Image with src binding: <img data-bind="src: filename"></img> <br />
	Image with src punches: <img src="{{filename}}"></img> <br />
</p>
<!-- trim -->
<p>
	<a href="#" onclick="balin.model.Src.filename = 'images/maslosoft.png';return false;" class="btn btn-success">Set to image 1</a>
	<a href="#" onclick="balin.model.Src.filename = 'images/maslosoft2.png';return false;"  class="btn btn-success">Set to image 2</a>
</p>
<!-- /trim -->
<script>
	window.onload = (function(){
		balin.model.Src = new Maslosoft.Koe.Src({filename: 'images/maslosoft.png'});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>