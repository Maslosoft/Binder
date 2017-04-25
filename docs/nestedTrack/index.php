<?php require __DIR__ . '/../_header.php'; ?>
<title>Nested Tracking</title>
<h1>Nested Tracking</h1>
<style>
	input, textarea, .result p{
		width: 300px;
		display:inline-block;
	}
</style>
<div data-bind="with: balin.model.Nested">
	<div>
		<input type="text" data-bind="textInput: rawI18N.name.en" />
		<input type="text" data-bind="textInput: rawI18N.name.pl" />
	</div>
	<div>
		<textarea data-bind="textInput: rawI18N.description.en"></textarea>
		<textarea data-bind="textInput: rawI18N.description.pl"></textarea>
	</div>
	<div class="result">
		<p data-bind="html: '<b>' + rawI18N.name.en + '</b>: ' + rawI18N.description.en"></p>
		<p data-bind="html: '<b>' + rawI18N.name.pl + '</b>: ' + rawI18N.description.pl"></p>
	</div>
</div>

<script type="text/javascript">
	window.onload = (function () {

		var data = {
			"user": {
				"id": {
					 "$id": "54c7bb28c79fda522c8b45a9"
				},
				"isGuest": false,
				"email": "pmaselkowski@gmail.com",
				"username": "admin",
				"firstName": "",
				"lastName": "",
				"fullName": "",
				"avatarUrl": "\/uac\/user\/getAvatar\/id\/54c7bb28c79fda522c8b45a9\/",
				"_class": "Maslosoft\\Ilmatar\\Modules\\Ua\\Vm\\WebUserVm"
		  },
		  "Content": {
				"PageMenu": {
					 "active": true,
					 "code": "mainMenu",
					 "name": "Menu g\u0142\u00f3wne",
					 "roots": [],
					 "sort": "",
					 "items": [],
					 "itemIds": [
						  {
								"$id": "51b616fcc0986e30026d0748"
						  },
						  {
								"$id": "51b61e39c0986ec90249e37c"
						  },
						  {
								"$id": "51e7dd4cc0986e9b57d916f4"
						  }
					 ],
					 "id": "51b61d58c0986ec7022f7a88",
					 "createUser": "admin",
					 "createDate": 1370889560,
					 "updateUser": "admin",
					 "updateDate": 1377709390,
					 "rawI18N": {
						  "pl": "Menu g\u0142\u00f3wne",
						  "en": "Menu g\u0142\u00f3wne",
						  "name": {
								"en": "Menu g\u0142\u00f3wne"
						  }
					 },
					 "_id": "51b61d58c0986ec7022f7a88",
					 "_key": "51b61d44c0986ec9024011af",
					 "_class": "Maslosoft\\Menulis\\Content\\Models\\PageMenu",
					 "meta": {}
				}
		  },
			Nested:{
		_class:'Maslosoft.Ko.BalinDev.Models.Nested',
		rawI18N:{
			name:{
				en:"January",
				pl:"Styczeń"
			},
			description:{
				en:"First month of a year",
				pl:"Pierwszy miesiąc roku"
			}
		}
	}
	};
		balin.model = ko.tracker.factory(data);
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>