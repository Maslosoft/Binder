<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>ID Attribute</title>
<h1>ID Attribute</h1>
<p>
	ID binding handler is a shorthand for elements which require <code>id</code>
	attribute to be dynamically updated. This is intended for easier binding of
    <code>id</code> attribute without using <code>attr</code> binding.
</p>
<h4>Live example</h4>
<p class="alert alert-success">
	In this example <code>with</code> binding is used, making HTML code even more clean.
</p>
<div data-bind="with: binder.model.withId" class="row">
    <div class="form-group col-xs-6 col-md-3">
	    <label for="id-input">Element ID: </label>
<!-- /trim -->
<input id="id-input" class="form-control" data-bind="textInput: id">
<!-- trim -->
    </div>
    <div class="col-xs-12">
<!-- /trim -->
Element with <code>id</code> binding: <span data-bind="id: id, text: 'ID: ' + id" class="badge"></span> <br>
Element with <code>id</code> punches: <span id="{{id}}" data-bind="text: 'ID: ' + id" class="badge"></span> <br />
<!-- trim -->
    </div>
</div>
<div class="clearfix"></div>
<p></p>
<p>
	<a href="#" onclick="binder.model.withId.id = 'id-one';return false;" class="btn btn-success">Set to <code>id-one</code></a>
	<a href="#" onclick="binder.model.withId.id = 'id-two';return false;"  class="btn btn-success">Set to <code>id-two</code></a>
</p>
<!-- /trim -->
<script>
	window.onload = (function(){
		binder.model.withId = new Maslosoft.Koe.Id({id: 'id-initial'});
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>