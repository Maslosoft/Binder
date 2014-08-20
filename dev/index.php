<!DOCTYPE html>
<!--
To change this license header, choose License Headers in Project Properties.
To change this template file, choose Tools | Templates
and open the template in the editor.
-->
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
		<script src="../bower_components/jquery/dist/jquery.min.js"></script>
		<script src="../bower_components/jquery-ui/jquery-ui.min.js"></script>
		<script src="../bower_components/knockout/dist/knockout.debug.js"></script>
		<script src="../bower_components/knockout-es5/dist/knockout-es5.js"></script>
		<script src="../bower_components/knockout-sortable/build/knockout-sortable.js"></script>
		<script src="./src/_ns.js"></script>
		<script src="../src/Tracker.js"></script>
		<script src="./src/Model.js"></script>
		<script src="./src/init.js"></script>
	</head>
	<body>
		<div>Sortable:</div>
		<div data-bind="sortable: app.model.Content.AssetCollection.items">
			<div>
				<input data-bind="textInput: title"/>
			</div>
		</div>
		<div>Foreach:</div>
		<div data-bind="foreach: app.model.Content.AssetCollection.items">
			<div>
				<input data-bind="textInput: title"/>
			</div>
		</div>
		<script>
			jQuery(document).ready(function(){
				ko.applyBindings({model: app.model});
			});
		</script>
	</body>
</html>
