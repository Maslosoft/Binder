<?php require './_header.php'; ?>
<div data-bind="with: app.model.Mangan.Image">
	Filename: <input data-bind="textInput: filename" style="width:50%;"/> <br />
	Image: <img data-bind="src: filename"></img> <br />
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Mangan = {};
		app.model.Mangan.Image = new Maslosoft.Mangan.Model.Image({filename: './images/maslosoft.png'});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>