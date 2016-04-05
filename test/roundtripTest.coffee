


app.model.Src = new Maslosoft.Ko.BalinDev.Models.Src({filename: 'maslosoft.png'})
ko.applyBindings({model: app.model})

doRound = () ->
	json = JSON.stringify app.model
	res = JSON.parse json
	for index, model of res
		app.model[index] = ko.tracker.factory res[index]

describe 'Test if will allow roundtrip of simple value, using new', ->
	it 'should not fail', ->
		
		
	it 'should have name', ->
		assert.equal app.model.Src.filename, 'maslosoft.png'
		doRound()
		assert.equal app.model.Src.filename, 'maslosoft.png'
