<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Google Maps</title>
<h1>Google Maps</h1>
<p class="alert alert-warning">
	Development version of google maps binding handler.
    NOTE: Requires API key.
</p>
<!-- /trim -->
<div data-bind="googlemap: binder.model.map">

</div>
<script>
	window.onload = (function(){
	    var cfg = {
	       lat: 10,
           lng: 10,
           zoom: 10
        };
		binder.model.map = new Maslosoft.Koe.Map(cfg);
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
