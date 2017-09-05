<?php require __DIR__ . '/../../_header.php'; ?>
<!-- trim -->
<title>Select2</title>
<h1>Select2</h1>
<p>
	<a href="https://select2.github.io/">Select2</a> is a library enchancing select element.
	This binding handler will demonstrate tags option. This example also
	contains <a href="https://github.com/select2/select2/issues/861">hacks</a> required
	for tags to not pop-up empty results.
</p>
<p>
	This binding cooperates with <code>options</code> binding handler. To obtain
	value back to observable use <code>value</code> binding handler for single
	selection, or <code>selectedOptions</code> for multiple selector.
</p>
<h4>Live example</h4>
<p class="alert alert-warning">
	Select2 package is not bundled with this package
</p>
<!-- /trim -->
<div class="form-group">
	<select
		id="select2"
		data-bind="
			select2: {
				tags: [],
				multiple: true,
				tokenSeparators: [',', ' '],
				minimumResultsForSearch: 5,
				dropdownCssClass: 'hideSearch',
				data: balin.model.options.selected
			},
			options: balin.model.options.selected,
			selectedOptions: balin.model.options.selected
		"
		class="form-control">
	</select>
</div>
<div data-bind="text: balin.model.options.selected"></div>
<a id="changeIt" href="#">Change programatically to [yes, no, maybe]</a>
<script>
	window.onload = (function(){
		$('#select2').on('select2:opening select2:close', function(e){
				$('body').toggleClass('kill-all-select2-dropdowns', e.type=='select2:opening');
		  });

		balin.model.options = new Maslosoft.Ko.BalinDev.Models.Options();
		balin.model.options.selected = ['noisy', 'loud'];
		
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		// trim
		$('#changeIt').on('click', function(e){
			var opts = ['yes', 'no', 'maybe'];

			balin.model.options.selected = opts;
			
			console.log(balin.model.options.selected);
			e.preventDefault();
		});
		// /trim
	});
</script>

<style>
  body.kill-all-select2-dropdowns .select2-dropdown {
    display: none !important;
  }
  body.kill-all-select2-dropdowns .select2-container--default.select2-container--open.select2-container--below .select2-selection--single, .select2-container--default.select2-container--open.select2-container--below .select2-selection--multiple
  {
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
  }
  .select2-container--default.select2-container--focus .select2-selection--multiple {
    border-color: #66afe9;
    outline: 0;
    -webkit-box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
    box-shadow: inset 0 1px 1px rgba(0,0,0,.075), 0 0 8px rgba(102,175,233,.6);
  }
</style>

<?php require __DIR__ . '/../../_footer.php'; ?>