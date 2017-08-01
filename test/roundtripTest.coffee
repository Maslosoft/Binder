test = () ->


	app.model.Src = new Maslosoft.Ko.BalinDev.Models.Src({filename: 'maslosoft.png'})
	ko.applyBindings({model: app.model}, document.getElementById('ko-balin'))

	doRound = () ->
		json = JSON.stringify app.model
		res = JSON.parse json
		for index, model of res
			app.model[index] = ko.tracker.factory res[index]

	describe 'Test if will allow roundtrip of simple value, using new', ->			
		it 'should have same value after getting data from JSON', ->
			assert.equal app.model.Src.filename, 'maslosoft.png'
			doRound()
			assert.equal app.model.Src.filename, 'maslosoft.png'
setTimeout test, 1000