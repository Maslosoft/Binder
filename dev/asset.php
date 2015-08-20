<?php require './_header.php'; ?>
<div>
	NOTE: Src attribute in this example will be broken<br />
	<img data-bind="asset: app.model.Asset, w:32, h:32, p:true"/>
	<img data-bind="asset: app.model.Asset, w:20, h:50, p:false"/>
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Asset = new Maslosoft.Ko.BalinDev.Models.Asset({url: 'images/maslosoft.png'});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
