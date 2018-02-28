<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>HTML Value</title>
<h1>HTML Value</h1>
<p class="alert alert-danger">WARNING: This binding <i>require</i> parent context, like here with `with` binding</p>
<p>
	Purpose of HTML Value is to allow two way data interchange with <code>contenteditable</code> enabled elements.
	Adding this binding to any element will make it editable, and will provide changed back to
	JavaScript via observables, as any other bindings.
</p>
<p>
	HTML Value binding handler supports observable value updates in many editing cases, including:
	<ul>
		<li>Pasting text with <kbd>ctrl+v</kbd> as well with mouse drag and drop</li>
		<li>Cutting text with <kbd>ctrl+x</kbd></li>
		<li>Dragging selected part of text</li>
		<li>Cut and paste from context menu</li>
		<li>Via keyboard typing</li>
		<li>When HTML element is updated via JavaScript user action</li>
	</ul>
</p>
<h4>Limitations</h4>
<p>
	HTML Value binding handler requires parent binding. Be it <code>with</code>, or <code>foreach</code>. This limitation comes
	from browsers event handling design - that the events cannot be attached to <code>contenteditable</code>
	elements.
</p>
<p>
	This binding handler does not clean up anything. What browser will generate, this will be passed
	to observable value.
</p>
<h4>Live Example</h4>
<!-- /trim -->
<table data-bind="with: balin.model.HtmlValue" class="table table-condensed">
	<tr>
		<th class="col-xs-4">Standard input field</th>
		<td>
			<input data-bind="textInput: text" class="col-xs-12"/>
		</td>

	</tr>
	<tr>
		<th>Content editable <code>span</code> element</th>
		<td>
			<span data-bind="htmlValue: text" id="editableField" class="col-xs-12"></span>
		</td>
		
	</tr>
</table>
<!-- trim -->
<p>
	<a href="#" id="replaceAction" class="btn btn-success">Replace text via arbitrary action</a>
	<a href="#" id="restoreAction" class="btn btn-success">Restore text via arbitrary action</a> <br />
</p>
<!-- /trim -->
<script>
	window.onload = (function () {
		var data = {text: 'Editable text <b>with</b> <abbr title="HyperText Markup Language">HTML</abbr>'};
		balin.model.HtmlValue = new Maslosoft.Koe.HtmlValue(data);
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		// trim
		// These are helpers for this page only, irrelevant for real usage
		var original = '';
		var f = $('#editableField');
		var stop = function(e){
			e.stopPropagation();
			e.preventDefault();
		}
		$(document).on('click', '#replaceAction', function(e){
			if(!original){
				original = f.html();
			}
			f.html('A <b>new</b> text from action, should update view model too.');
			stop(e)
		})
		$(document).on('click', '#restoreAction', function(e){
			if(original){
				f.html(original);
				original = '';
			}
			stop(e)
		})
		// /trim
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>