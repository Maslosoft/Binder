<?php require __DIR__ . '/../_header.php'; ?>
<title>Video Playlist</title>
<h1>Video Playlist</h1>
<div>
	Videos
</div>
<div data-bind="foreach: balin.model.list.videos">
	<div>
		<div data-bind="videoThumb: url" style="height:67px;width:100px;background-size:cover;display:inline-block;">
		</div>
		<input data-bind="textInput: url" style="width: 50%;"/>
		<a href="#" class="remove">Remove</a>
	</div>
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
<div data-bind="if: !balin.model.list.videos.length">
	<b>Add some videos to initialize playlist</b>
</div>
<!--A bit of layout to make player smaller-->
<div class="row">
	<div class="col-md-6 col-xs-12 col-sm-8">
		<div data-bind="videoPlaylist: balin.model.list.videos">

		</div>
	</div>
	<div class="col-md-6 col-xs-12 col-sm-8">
		<div data-bind="videoPlaylist: {data: balin.model.list.videos, urlField: 'url', titleField: 'title'}">

		</div>
	</div>
</div>
<script>
	window.onload = (function () {
		var list = new Maslosoft.Ko.BalinDev.Models.Videos;
		list.videos.push(new Maslosoft.Ko.BalinDev.Models.Video({url: 'https://vimeo.com/181612110'}));
		list.videos.push(new Maslosoft.Ko.BalinDev.Models.Video({url: 'https://www.youtube.com/watch?v=RzpRU347BDU'}));
		balin.model.list = list;
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
		$(document).on('click', '.remove', function(e){
			var model = ko.dataFor(e.currentTarget);
			console.log(model);
			balin.model.list.videos.remove(model);
			e.preventDefault();
		});
		$(document).on('click', '.add', function(e){
			url = $('#newVideo').val();
			console.log(url);
			if(!url){
				return false;
			}
			var model = new Maslosoft.Ko.BalinDev.Models.Video({url: url});
			balin.model.list.videos.push(model);
			e.preventDefault();
		});
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
