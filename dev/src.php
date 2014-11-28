<?php require './_header.php'; ?>
<div data-bind="with: app.model.Src">
	Filename: <input data-bind="textInput: filename" style="width:50%;"/> <br />
	<a href="#" onclick="app.model.Src.filename = './images/maslosoft.png'">Set to image 1</a> |
	<a href="#" onclick="app.model.Src.filename = './images/maslosoft2.png'">Set to image 2</a> <br />
	Image: <img data-bind="src: filename"></img> <br />
</div>

<script>
	jQuery(document).ready(function(){
		app.model.Src = new Maslosoft.Ko.BalinDev.Models.Src({filename: './images/maslosoft.png'});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>