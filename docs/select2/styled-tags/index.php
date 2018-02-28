<?php
use Maslosoft\Widgets\JavaScript\Packages\Select2Package;
?>

<?php require __DIR__ . '/../../_header.php'; ?>
<?php if(KO_BALIN_EMBEDDED):?>
    <?php
    new Select2Package;
    ?>
<?php endif; ?>
<!-- trim -->
<title>Select2 Styled Tags</title>
<h1>Select2 Styled Tags</h1>
<p>
	<a href="https://select2.github.io/">Select2</a> is a library enchancing select element.
	This binding handler will demonstrate tags option. This binding handler also
	contains <a href="https://github.com/select2/select2/issues/861">hacks</a> required
	for tags to not pop-up empty results.
</p>
<p>
	This binding handler converts select2 to tags selector.
</p>
<h4>Live example of Twitter Bootstrap styled tags</h4>
<p class="alert alert-warning">
	Select2 package is not bundled with this package
</p>
<style>
    .btn-tag{
        padding: .2em 0.4em;
        margin: .4em .2em 0 .2em;
        display: list-item;
        float:left;
    }
    .tag-input{
        margin-top: .15em !important;
        margin-left: .3em !important;
        min-width: 6em;
    }
</style>
<!-- /trim -->
<div class="form-group">
	<select
		id="select2"
		data-bind="
			tags: {
			    'data': balin.model.options.selected,
			    'tagCss': 'btn btn-default btn-tag',
			    'inputCss': 'form-control tag-input',
			    'placeholder': 'Select tag...'
			}
		"
		class="form-control">
	</select>
</div>
<div data-bind="text: balin.model.options.selected"></div>
<a id="changeIt" href="#">Change programatically to [yes, no, maybe]</a>
<script>
	window.onload = (function () {

		balin.model.options = new Maslosoft.Koe.Options();
		balin.model.options.selected = ['noisy', 'loud'];

		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		// trim
		$('#changeIt').on('click', function (e) {
			var opts = ['yes', 'no', 'maybe'];
			balin.model.options.selected.removeAll();
			var i = 0;
			for (i in opts) {
				balin.model.options.selected.push(opts[i]);
			}
			e.preventDefault();
		});
		// /trim
	});
</script>

<?php require __DIR__ . '/../../_footer.php'; ?>