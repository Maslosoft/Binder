<?php require __DIR__ . '/../_header.php'; ?>
<?php
use Maslosoft\Widgets\JavaScript\Packages\VideoPlaylist;
if(KO_BALIN_EMBEDDED) {
	new VideoPlaylist;
}
?>
<!-- trim -->
<title>Video Playlist</title>
<h1>Video Playlist</h1>
<p>
	Video Playlist is a wrapper for Maslosoft Video Playlist JavaScript library
	for creating sequential player out of video links from YouTube, Vimeo
	and possibly other providers.
</p>
<p>
	This example features also <code>videoThumb</code> binding, which will
	set element background image to video thumbnail extracted from provided video URL.
</p>
<p class="alert alert-warning">
	NOTE: CSS is not included in this package!
</p>
<!-- /trim -->
<table data-bind="foreach: balin.model.list.videos" class="table table-condensed">
<tr>
	<td class="col-xs-1">
		<div data-bind="videoThumb: url" style="height:67px;width:100px;background-size:cover;display:inline-block;">
		</div>		
	</td>
	<td>
		<input data-bind="textInput: url" style="width: 50%;"/>
	</td>
	<td class="col-xs-1">
		<a href="#" class="remove">Remove</a>
	</td>
</tr>
</table>
<!-- trim -->
<div>
	Fill url into field below to add video
</div>
<div>
	<input id="newVideo" value="https://www.youtube.com/watch?v=IxGvm6btP1A" style="width: 50%;"/> <a href="#" class="add">Add</a>
</div>

<div data-bind="if: !balin.model.list.videos.length">
	<b>Add some videos to initialize playlist</b>
</div>
<hr />
<!-- /trim -->
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
		var list = new Maslosoft.Koe.Videos;
		list.videos.push(new Maslosoft.Koe.Video({url: 'https://vimeo.com/181612110'}));
		list.videos.push(new Maslosoft.Koe.Video({url: 'https://www.youtube.com/watch?v=RzpRU347BDU'}));
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
			var model = new Maslosoft.Koe.Video({url: url});
			balin.model.list.videos.push(model);
			e.preventDefault();
		});
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
