<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>1. Using Models</title>
<h1>Using Models</h1>
<h3>
	Creating Object Oriented Models<br />
	<small>CoffeeScript is recommended for easier understanding.</small>
</h3>
<p class="alert alert-success">
	This documentation will use <code>binder.model</code> object to store all observable model instances.<br />
	Each property in this object is instance of observable model.
</p>
<h4>Intuitive data binding</h4>
<p>
	Binder packages comes with <a href="https://github.com/Maslosoft/knockout-es5" target="_blank">Knockout JS <abbr title="EcmaScript 5" rel="tooltip">ES5</abbr> enchanced plugin</a>.
	It provides access to properties in a more natural way. This means, that accessing observable properties 
	in HTML does not require brackets - even when accessing deeply nested value.
</p>
<p>
	Example below will bind deeply nested property of <code>Maslosoft.Koe.Nested</code> model instance:
</p>
<pre class="html">
<?= escapeKo('<input data-bind="textInput: binder.model.nested.rawI18N.name.en"></input>') . PHP_EOL?>
<?= escapeKo('<div data-bind="text: binder.model.nested.rawI18N.name.en"></div>')?>
</pre>
<p>Result of this code is below. Try to change input value:</p>
<div class="well">
<!-- /trim -->
<input data-bind="textInput: binder.model.nested.rawI18N.name.en"></input>
<div data-bind="text: binder.model.nested.rawI18N.name.en"></div>
<!-- trim -->
</div>
<h4>Creating Model</h4>
<p>
	View model in binder package is instance of class. So that it can be reused or extended at will.
</p>
<p>
	To use EcmaScript 5 observable properties, model must extend from <code>Maslosoft.Binder.Model</code>
	class. Using this class provides facility to track nested objects and nested arrays of objects. The
	constructor of this class accepts data parameter (of type object) that will assign passed properties
	to newly created model instance.
</p>
<p class="alert alert-warning">
Model should also have property <code>_class</code>, which is used internally.<br />
This property must have value same as fully qualified class name.
</p>
<p>
	To create new model, extend from <code>Maslosoft.Binder.Model</code> and add properties - of which
	all will be observable:
</p>
<pre class="coffeescript">
class @Maslosoft.Models.MyChecklist extends @Maslosoft.Binder.Model
	_class: "Maslosoft.Models.MyChecklist"
	id: 0
	title: ''
	items: []
</pre>
<!-- /trim -->
<script>
	window.onload = (function () {
		binder.model.nested = new Maslosoft.Koe.Nested({
		rawI18N:{
			name:{
				en:"January",
				pl:"Styczeń"
			},
			description:{
				en:"First month of a year",
				pl:"Pierwszy miesiąc roku"
			}
		}});

		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
