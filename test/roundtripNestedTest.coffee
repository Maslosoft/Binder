


data = {
		'sortable':{
			title: 'Names Collection',
			_class: 'Maslosoft.Ko.BalinDev.Models.SortableHtmlValues',
			items: [
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'Frank'
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'Sara'
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'John'
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'Anna'
				},
				{
					_class: 'Maslosoft.Ko.BalinDev.Models.HtmlValue',
					text: 'Joseph'
				}
			]
		}
	};
app.model = ko.tracker.factory data
ko.applyBindings({model: app.model})

doRound = () ->
	json = JSON.stringify app.model
	res = JSON.parse json

	for index, model of res
		app.model[index] = ko.tracker.factory res[index]

elem = jQuery('#roundtripNestedTest')

describe 'Test if will allow roundtrip of nested arrays, using ko.tracker.factory', ->
	it 'should not fail', ->


	it 'should have name', ->
		assert.equal app.model.sortable.title, 'Names Collection'
		doRound()
		assert.equal app.model.sortable.title, 'Names Collection'

	it 'should allow pop', ->
		assert.equal app.model.sortable.items.length, 5
		assert.equal elem.find('div').length, 5
		app.model.sortable.items.pop()

		assert.equal app.model.sortable.items[0].text, 'Frank', 'That first item is Frank'
		assert.equal app.model.sortable.items.length, 4, 'That one element was removed from array'
		assert.equal elem.find('div').length, 4, 'That DOM elements are 4 too'

		doRound()

		assert.equal app.model.sortable.items[0].text, 'Frank', 'That first item is still Frank'
		assert.equal app.model.sortable.items.length, 4, 'That one element remains removed from array'
		assert.equal elem.find('div').length, 4, 'That DOM elements are 4 too'

	it 'should allow push', ->
		model = app.model.sortable
		assert.equal model.items.length, 4
		model.items.push new Maslosoft.Ko.BalinDev.Models.HtmlValue({text: 'new'})

		assert.equal model.items.length, 5, 'That one element was added'
		assert.equal elem.find('div').length, 5, 'That DOM elements are 5 too'

		doRound()


		assert.equal model.items[4].text, 'new', 'That last item is `new`'
		assert.equal model.items.length, 5, 'That one element remains added'
		assert.equal elem.find('div').length, 5, 'That DOM elements remains 5 too'
		assert.equal elem.find('div')[4].innerHTML, 'new', 'That DOM elements text is `new`'
