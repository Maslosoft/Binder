<?php require __DIR__ . '/../_header.php'; ?>
<title>HTML Value</title>
<h1>HTML Value</h1>
<b class="warn">WARNING: This binding <i>require</i> parent context, like here with `with` binding</b>
<div data-bind="with: balin.model.HtmlValue">
	Standard input field: <input data-bind="textInput: text" style="width:50%;"/> <br />
	This should be editable: <span data-bind="htmlValue: text" id="editableField"></span> <br />
	<a href="#" id="replaceAction">Replace text via arbitrary action</a> <br />
	<a href="#" id="restoreAction">Restore text via arbitrary action</a> <br />
</div>

<script>
	window.onload = (function () {
		balin.model.HtmlValue = new Maslosoft.Ko.BalinDev.Models.HtmlValue({text: 'Some text, also <b>with</b> <abbr title="HyperText Markup Language">HTML</abbr>'});
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