<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Date Time Formatters</title>
<h1>Date Time Formatters</h1>
<p>
	This is a set of binding handlers built on top of <a href="https://momentjs.com/">Moment.js</a>
	library, providing human readable date and time in different manners.
</p>
<h4>Adding new formats</h4>
<p class="alert alert-success">
By default datetime bindings are registered with default options.<br />
To customize, re-register with custom options possibly with other name too.
</p>
<p>
	New handler formats can be created by creating new instance of one of:
	<ul>
		<li><code>Maslosoft.Binder.DateFormatter</code></li>
		<li><code>Maslosoft.Binder.DateTimeFormatter</code></li>
		<li><code>Maslosoft.Binder.TimeFormatter</code></li>
		<li><code>Maslosoft.Binder.TimeAgoFormatter</code></li>
	</ul>
	Passing different parameters to constructor, and registering it via <code>Maslosoft.Binder.register</code>.
</p>
<h4>Live Example</h4>
<!-- /trim -->
<table class="table table-condensed">
	<tr>
		<th>Unix timestamp value:</th>
		<td>
			<input type="text" data-bind="textInput: binder.model.DateTime.date"/>
		</td>
	</tr>
	<tr>
		<th>Date time:</th>
		<td>
			<span data-bind="dateTimeFormatter: binder.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Date:</th>
		<td>
			<span data-bind="dateFormatter: binder.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Time:</th>
		<td>
			<span data-bind="timeFormatter: binder.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Time ago:</th>
		<td>
			<span data-bind="timeAgoFormatter: binder.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Locale date time</th>
		<td>
			<span data-bind="localeDateTime: binder.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Locale date time with ko punches</th>
		<td>
			<span localeDateTime="{{binder.model.DateTime.date}}"></span>
		</td>
	</tr>
</table>
<!-- trim -->
<a id="resetDate" class="btn btn-success">Set to now</a>
<a id="timerToggle"  class="btn btn-success">Toggle timer</a>
<a id="timerDirectionToggle"  class="btn btn-success">Toggle timer direction</a>
<!-- /trim -->
<script>
	window.onload = (function () {
		// Custom register time related binding handlers
		Maslosoft.Binder.register('localeDateTime', new Maslosoft.Binder.DateTimeFormatter({displayFormat: 'LL'}));
		// trim
		// Toggle timer handler
		var isActive = false;
		var intervalId = '';
		var direction = 1;
		var inc = function(){
			binder.model.DateTime.date = binder.model.DateTime.date + direction;
		};
		$('#timerToggle').click(function(){

			if(!isActive){
				intervalId = setInterval(inc, 10);
				$('#timerToggle').addClass('btn-danger');
				isActive = true;
			}else{
				clearInterval(intervalId);
				$('#timerToggle').removeClass('btn-danger');
				isActive = false;
			}
		});
		$('#timerDirectionToggle').click(function(){
			if(direction === 1){
				$('#timerDirectionToggle').addClass('btn-danger');
				direction = -1;
			}else{
				$('#timerDirectionToggle').removeClass('btn-danger');
				direction = 1;
			}
		});
		// Handle reset date
		$('#resetDate').click(function(){
			binder.model.DateTime.date = Math.floor(Date.now() / 1000);
		});
		// /trim

		binder.model.DateTime = new Maslosoft.Koe.DateTime();
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
