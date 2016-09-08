<?php require './_header.php'; ?>
<div>
	Videos
</div>
<div data-bind="foreach: app.model.list.videos">
	<input data-bind="textInput: url" style="width: 50%;"/>
	<a href="#" class="remove">Remove</a>
</div>
<div>
	Fill url into field below to add video
</div>
<div>
	<input id="newVideo" value="https://www.youtube.com/watch?v=IxGvm6btP1A" style="width: 50%;"/> <a href="#" class="add">Add</a>
</div>
<p>
	NOTE: CSS is not included in package!
</p>
<!--A bit of layout to make player smaller-->
<div class="row">
	<div class="col-md-5 col-xs-12 col-sm-8">
		<div data-bind="videoPlaylist: app.model.list.videos">

		</div>
	</div>
</div>
<script>
	jQuery(document).ready(function () {
		var list = new Maslosoft.Ko.BalinDev.Models.Videos;
		list.videos.push(new Maslosoft.Ko.BalinDev.Models.Video({url: 'https://vimeo.com/181612110'}));
		list.videos.push(new Maslosoft.Ko.BalinDev.Models.Video({url: 'https://www.youtube.com/watch?v=RzpRU347BDU'}));
		app.model.list = list;
		ko.applyBindings({model: app.model});
		$(document).on('click', '.remove', function(e){
			var model = ko.dataFor(e.currentTarget);
			console.log(model);
			app.model.list.videos.remove(model);
			e.preventDefault();
		});
		$(document).on('click', '.add', function(e){
			url = $('#newVideo').val();
			console.log(url);
			if(!url){
				return false;
			}
			var model = new Maslosoft.Ko.BalinDev.Models.Video({url: url});
			app.model.list.videos.push(model);
			e.preventDefault();
		});
	});
</script>
<?php require './_footer.php'; ?>
