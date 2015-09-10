<?php require './_header.php'; ?>
<div>
	NOTE: Image resizing is simulated here, src points to static image<br />
	<img data-bind="asset: app.model.Asset, w:32, h:32, p:true"/>
	<img data-bind="asset: app.model.Asset, w:20, h:50, p:false"/>
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Asset = new Maslosoft.Ko.BalinDev.Models.Asset({url: 'assets'});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
