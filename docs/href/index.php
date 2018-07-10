<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<style>
    #spanHref::after{
        content: attr(href);
    }
</style>
<title>HREF Attribute</title>
<h1>HREF Attribute</h1>
<p>
	HREF binding handler is a shorthand for <code>attr</code> binding handler for links <code>href</code>
	attribute. Base syntax uses data bind HTML attribute:
</p>
<pre class="html"><?= escapeko('<a data-bind="href: binder.model.Href.filename">Text</a>');?></pre>
<h5>Using with punches syntax</h5>
<p>
	This binding, as well many others can be used with alternative syntax, called ko punches. Just
	set <code>href</code> attribute to observable reference wrapped with curly braces:
</p>
<pre class="html"><?= escapeko('<a href="{{binder.model.Href.filename}}">Text</a>'); ?></pre>
<h2>Live example</h2>
<!-- /trim -->
<table class="table table-condensed">
	<tr>
		<th class="col-xs-6">Raw Link href</th>
		<td class="col-xs-6">
			<input data-bind="textInput: binder.model.Href.filename"/>
		</td>
	</tr>
	<tr>
		<th>Link with <code>data-bind</code></th>
		<td>
			<a data-bind="href: binder.model.Href.filename">This should point to above url</a>
		</td>
	</tr>
    <tr>
        <th>Will wear-out inner <code>a</code> tags. Useful with user provided data.</th>
        <td>
            <a data-bind="href: binder.model.Href.filename"><span data-bind="html: binder.model.Inner.filename"></span></a>
        </td>
    </tr>
	<tr>
		<th>Link with punches</th>
		<td>
			<a href="{{binder.model.Href.filename}}">Using ko punches</a>
		</td>
	</tr>
	<tr>
		<th>Link with target <code>_blank</code></th>
		<td>
			<a data-bind="href: binder.model.Href.filename" target="_blank">This should open in new window</a>
		</td>
	</tr>
    <tr>
        <th>Span element</th>
        <td>
            <span id="spanHref" data-bind="href: binder.model.Href.filename">This should have href attribute:&nbsp;</span>
        </td>
    </tr>
</table>
<!-- trim -->
<p>
	Link value can be changed via JavaScript: <a data-bind="click: function(){binder.model.Href.filename = '#';}" href="#">Set href to `#`</a>.
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
				<a data-bind="href: binder.model.Href.filename">This should show alert</a>
			</span>
		</td>
	</tr>
	<tr>
		<th>Option <code>stopPropagation</code> set to <code>true</code></th>
		<td>
			<span onclick="alert('Clicked on span around link')">
				<a data-bind="href: binder.model.Href.filename, stopPropagation: true">This should <i>not</i> show alert</a>
			</span>
		</td>
	</tr>
</table>

<script>
	window.onload = (function(){
		binder.model.Href = new Maslosoft.Koe.Href({filename: 'http://example.com/'});
        binder.model.Inner = new Maslosoft.Koe.Href({filename: '<a href="http://example.org/">Should not have inner link inside</a>'});
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
