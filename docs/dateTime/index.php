<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Date time</title>
<h1>Date time</h1>
<p>
NOTE: By default datetime bindings are registered with default options.
To customize, re-register with custom options possibly with other name too.<br />
</p>
<!-- /trim -->
<table class="table table-condensed">
	<tr>
		<th>Unix timestamp value:</th>
		<td>
			<input type="text" data-bind="textInput: balin.model.DateTime.date"/>
		</td>
	</tr>
	<tr>
		<th>Date time:</th>
		<td>
			<span data-bind="dateTimeFormatter: balin.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Date:</th>
		<td>
			<span data-bind="dateFormatter: balin.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Time:</th>
		<td>
			<span data-bind="timeFormatter: balin.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Time ago:</th>
		<td>
			<span data-bind="timeAgoFormatter: balin.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Locale date time</th>
		<td>
			<span data-bind="localeDateTime: balin.model.DateTime.date"></span>
		</td>
	</tr>
	<tr>
		<th>Locale date time with ko punches</th>
		<td>
			<span localeDateTime="{{balin.model.DateTime.date}}"></span>
		</td>
	</tr>
</table>
<a id="resetDate">Set to now</a> <a id="timerToggle">Toggle timer</a> <a id="timerDirectionToggle">Toggle timer direction</a> 
<script>
	window.onload = (function () {
		// Custom register time related binding handlers
		Maslosoft.Ko.Balin.register('localeDateTime', new Maslosoft.Ko.Balin.DateTimeFormatter({displayFormat: 'LL'}));

		// Toggle timer handler
		var isActive = false;
		var intervalId = '';
		var direction = 1;
		var inc = function(){
			balin.model.DateTime.date = balin.model.DateTime.date + direction;
		};
		$('#timerToggle').click(function(){

			if(!isActive){
				intervalId = setInterval(inc, 10);
				isActive = true;
			}else{
				clearInterval(intervalId);
				isActive = false;
			}
		});
		$('#timerDirectionToggle').click(function(){
			if(direction === 1){
				direction = -1;
			}else{
				direction = 1;
			}
		});
		// Handle reset date
		$('#resetDate').click(function(){
			balin.model.DateTime.date = Math.floor(Date.now() / 1000);
		});
		

		balin.model.DateTime = new Maslosoft.Ko.BalinDev.Models.DateTime();
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
