<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Data Attribute</title>
<h1>Data Attribute</h1>
<h3>
	Data dynamic binding<br />
	<small>Will apply data-* attributes</small> <br/>
</h3>
<h4>Binding Data Attributes</h4>
<p>
	This binding handler will attach any observable value to HTML data attribute. The
	attribute to bound to is choosed by adding suffix to bindable name.
</p>
<p>
	For instance, applying binding named <code>data.name</code> will set HTML attribut <code>data-name</code>
	to passed observable value.
</p>
<p>
	The following code:
</p>
<pre class="html">
<?= escapeko('<span data-bind="data.name: myObservable"></span>');?>
</pre>
<p>
	Will result in element having <code>data-name</code> attribute added:
</p>
<pre class="html">
<?= escapeko('<span data-bind="data.name: myObservable" data-name="My Observable Value"></span>');?>
</pre>
<h4>Live Example</h4>
<p>Results are not visible, try inspecting elements to verify that bindings have been applied.</p>
<!-- /trim -->
<span data-bind="data.title: binder.model.txt1.text" class="label label-success">Should have <code>data-title</code> HTML attribute of a simple string value</span>
<span data-bind="data.full: binder.model.txt1" class="label label-success">Should have <code>data-full</code> HTML attribute of json encoded object value</span>

<script>
	window.onload = (function () {
		var data1 = {
			text: 'Val1'
		};

		binder.model.txt1 = new Maslosoft.Koe.TextValue(data1);

		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
