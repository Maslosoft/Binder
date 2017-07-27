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
	Only drawback of this binding handler is that it requires parent binding. This limitation comes
	from event handling design - that the events cannot be attached to <code>contenteditable</code>
	elements.
</p>
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
	<a href="#" id="replaceAction">Replace text via arbitrary action</a> <br />
	<a href="#" id="restoreAction">Restore text via arbitrary action</a> <br />
</p>
<!-- trim -->
<script>
	window.onload = (function () {
		balin.model.HtmlValue = new Maslosoft.Ko.BalinDev.Models.HtmlValue({text: 'Editable text <b>with</b> <abbr title="HyperText Markup Language">HTML</abbr>'});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));

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
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>