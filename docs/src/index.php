<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>SRC Attribute</title>
<h1>SRC Attribute</h1>
<p>
	Src binding handler is a shorthand for elements which require
    <code>src</code>
	attribute to be dynamically updated.
    This binding should be used with elements supporting <code>src</code>
    attribute like images and iframes,
    <code>img</code> and <code>iframe</code> tags respectively.
    The <code>src</code> binding handler itself is not limited to
    images and iframes however, the binding will add <code>src</code>
    attribute if element does not have one.
</p>
<h4>Elements having <code>src</code> attribute</h4>
<ul>
    <li>audio - the URL of the audio file</li>
    <li>embed - the address of the external file to embed</li>
    <li>iframe - the address of the document to embed in the <code>iframe</code> tag</li>
    <li>img - the URL of an image</li>
    <li>input - the URL of the image to use as a submit button (only for type="image")</li>
    <li>script - the URL of an external script file</li>
    <li>source - Required when <code>source</code> tag is used in <code>audio</code> and <code>video</code> tags. Specifies the URL of the media file</li>
    <li>track - the URL of the track file containing subtitles or caption for <code>video</code> or <code>audio</code> tags</li>
    <li>video - the URL of the video file</li>
</ul>
<h4>Live example</h4>
<p class="alert alert-success">
	In this example <code>with</code> binding is used, making HTML code even more clean.
</p>

<div data-bind="with: binder.model.Src" class="row">
    <div class="form-group col-xs-6 col-md-3">
        <label for="filename-input">Filename: </label>
<!-- /trim -->
<input data-bind="textInput: filename" id="filename-input" class="form-control"/>
<!-- trim -->
    </div>
</div>
<div class="clearfix"></div>
<p></p>
<!-- /trim -->
<p data-bind="with: binder.model.Src">
Image with <code>src</code> binding: <img data-bind="src: filename"></img> <br />
Image with <code>src</code> punches: <img src="{{filename}}"></img> <br />
</p>
<!-- trim -->
<p class="alert alert-danger">
    While it is possible to use knockout punches for <code>src</code>
    attribute it is highly <b>not</b> recommended as browser <b>will
    request resource</b> named as binding value -
    in this example: <code>{<!-- -->{filename}<!-- -->}</code> -
    before bindings evaluation.
</p>
<p>
	<a href="#" onclick="binder.model.Src.filename = 'images/maslosoft.png';return false;" class="btn btn-success">Set to image 1</a>
	<a href="#" onclick="binder.model.Src.filename = 'images/maslosoft2.png';return false;"  class="btn btn-success">Set to image 2</a>
</p>
<!-- /trim -->
<script>
	window.onload = (function(){
		binder.model.Src = new Maslosoft.Koe.Src({filename: 'images/maslosoft.png'});
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>