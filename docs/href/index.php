<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>HREF Attribute</title>
<h1>HREF Attribute</h1>
<p>
	HREF binding handler is a shorthand for <code>attr</code> binding handler.
</p>
<!-- /trim -->
<table class="table table-condensed">
	<tr>
		<th>Raw Link href</th>
		<td>
			<input data-bind="textInput: balin.model.Href.filename"/>
		</td>
	</tr>
	<tr>
		<th>Link with <code>data-bind</code></th>
		<td>
			<a data-bind="href: balin.model.Href.filename">This should point to above url</a>
		</td>
	</tr>
	<tr>
		<th>Link with punches</th>
		<td>
			<a href="{{balin.model.Href.filename}}">Using ko punches</a>
		</td>
	</tr>
	<tr>
		<th>Link with target <code>_blank</code></th>
		<td>
			<a data-bind="href: balin.model.Href.filename" target="_blank">This should open in new window</a>
		</td>
	</tr>
</table>
<!-- trim -->
<p>
	Link value can be changed via JavaScript: <a data-bind="click: function(){balin.model.Href.filename = '#';}" href="#">Set href to `#`</a>.
</p>
<p>
	Example of using <code>stopPropagation</code> option:
</p>
<!-- /trim -->
<table class="table table-condensed">
	<tr>
		<th>Default behavior</th>
		<td>
			<span onclick="alert('Clicked on span around link')">
				<a data-bind="href: balin.model.Href.filename">This should show alert</a>
			</span>
		</td>
	</tr>
	<tr>
		<th>Option <code>stopPropagation</code> set to <code>true</code></th>
		<td>
			<span onclick="alert('Clicked on span around link')">
				<a data-bind="href: balin.model.Href.filename, stopPropagation: true">This should <i>not</i> show alert</a>
			</span>
		</td>
	</tr>
</table>

<script>
	window.onload = (function(){
		balin.model.Href = new Maslosoft.Ko.BalinDev.Models.Href({filename: 'http://example.com/'});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
