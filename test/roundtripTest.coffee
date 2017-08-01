test = () ->


	balin.model.Src = new Maslosoft.Ko.BalinDev.Models.Src({filename: 'maslosoft.png'})
	ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'))

	doRound = () ->
		json = JSON.stringify balin.model
		res = JSON.parse json
		for index, model of res
			balin.model[index] = ko.tracker.factory res[index]

	describe 'Test if will allow roundtrip of simple value, using new', ->			
		it 'Should have same value after getting data from JSON', ->
			assert.equal balin.model.Src.filename, 'maslosoft.png'
			doRound()
			assert.equal balin.model.Src.filename, 'maslosoft.png'
setTimeout test, 1000