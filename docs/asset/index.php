<?php require __DIR__ . '/../_header.php'; ?>
<title>Asset</title>
<h1>Asset</h1>
<div>
	NOTE: Image resizing is simulated here, src points to static image<br />
	<img data-bind="asset: balin.model.Asset, w:32, h:32, p:true"/>
	<img data-bind="asset: balin.model.Asset, w:20, h:50, p:false"/>
</div>

<script>
	window.onload = (function(){
		balin.model.Asset = new Maslosoft.Ko.BalinDev.Models.Asset({url: 'assets'});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
