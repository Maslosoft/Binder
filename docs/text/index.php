<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Text</title>
<h1>Text</h1>
<p>
	The <code>text</code> binding is same as
    <a href="http://knockoutjs.com/documentation/text-binding.html">
        original <code>text</code> binding
    </a>
    except that is supports plugins to additionally process
    content or element.
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
		<th>Text in <code>span</code> element</th>
		<td>
			<span data-bind="text: binder.model.html.text" class="col-xs-12"></span>
		</td>
	</tr>
    <tr>
        <th>With <code>Smileys</code> demo plugin</th>
        <td>
            <span data-bind="
                text: binder.model.html.text,
                plugins: [{
                    '_class': Maslosoft.Koe.Smileys,
                    enabled: binder.model.smileys.enabled
                }]" class="col-xs-12"></span>
        </td>
    </tr>
</table>
<!-- trim -->
<p>
	<a href="#" id="toggleSmileys"
       data-bind="
       css: {
            'btn-success': binder.model.smileys.enabled,
            'btn-danger': !binder.model.smileys.enabled
       }" class="btn ">Toggle Smileys</a>
</p>
<!-- /trim -->
<script>
	window.onload = (function () {
		var data = {text: 'Text 8) The HTML parts like <div> or & are escaped :)'};
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