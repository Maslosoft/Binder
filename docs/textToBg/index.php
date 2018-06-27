<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Text to Background</title>
<h1>Text to Background Color</h1>
<p>
	The <code>textToBg</code> will convert any text to background color.
    While at first it might sound weird, it might be used to create unique
    colors for different values, for instance enums, types etc.
</p>

<h4>Live Example</h4>
<!-- /trim -->
<table class="table table-condensed">
	<tr>
		<th class="col-xs-4">Standard input field</th>
		<td>
			<input data-bind="textInput: binder.model.html.text" class="col-xs-12"/>
		</td>

	</tr>
	<tr>
		<th>Span <code>span</code> element coloured</th>
		<td>
			<span data-bind="textToBg: binder.model.html.text" class="col-xs-12">&nbsp;</span>
		</td>
	</tr>
</table>
<script>
	window.onload = (function () {
		var data = {text: 'Green;)'};
		binder.model.html = new Maslosoft.Koe.HtmlValue(data);
		binder.model.smileys = ko.tracker.factory({enabled: true});
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
// trim
        $(document).on('click', '#toggleSmileys', function(e){
            binder.model.smileys.enabled = !binder.model.smileys.enabled;
            e.stopPropagation();
            e.preventDefault();
        });
// /trim
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>