test = () ->


	binder.model.Src = new Maslosoft.Koe.Src({filename: 'maslosoft.png'})
	ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'))

	doRound = () ->
		json = JSON.stringify binder.model
		res = JSON.parse json
		for index, model of res
			binder.model[index] = ko.tracker.factory res[index]

	describe 'Test if will allow roundtrip of simple value, using new', ->			
		it 'Should have same value after getting data from JSON', ->
			assert.equal binder.model.Src.filename, 'maslosoft.png'
			doRound()
			assert.equal binder.model.Src.filename, 'maslosoft.png'
setTimeout test, 1000