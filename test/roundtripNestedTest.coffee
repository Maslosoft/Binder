test = () ->


	data = {
			'sortable':{
				title: 'Names Collection',
				_class: 'Maslosoft.Koe.SortableHtmlValues',
				items: [
					{
						_class: 'Maslosoft.Koe.HtmlValue',
						text: 'Frank'
					},
					{
						_class: 'Maslosoft.Koe.HtmlValue',
						text: 'Sara'
					},
					{
						_class: 'Maslosoft.Koe.HtmlValue',
						text: 'John'
					},
					{
						_class: 'Maslosoft.Koe.HtmlValue',
						text: 'Anna'
					},
					{
						_class: 'Maslosoft.Koe.HtmlValue',
						text: 'Joseph'
					}
				]
			}
		};
	balin.model = ko.tracker.factory data
	ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'))

	doRound = () ->
		json = JSON.stringify balin.model
		res = JSON.parse json
		console.log res
		for index, model of res
			if !!balin.model[index]
				ko.tracker.fromJs(balin.model[index], res[index])
			else
				balin.model[index] = ko.tracker.factory res[index]

	elem = jQuery('#roundtripNestedTest')

	describe 'Test if will allow roundtrip of nested arrays, using ko.tracker.factory', ->
		
		it 'Should have same title after getting data from JSON', ->
			console.log balin.model.sortable
			assert.equal balin.model.sortable.title, 'Names Collection'
			doRound()
			assert.equal balin.model.sortable.title, 'Names Collection'

		it 'Should allow pop', ->
			assert.equal balin.model.sortable.items.length, 5, 'That there are 5 items at beginning'
			assert.equal elem.find('div').length, 5, 'That there are 5 items at beginning in DOM'
			balin.model.sortable.items.pop()

			assert.equal balin.model.sortable.items[0].text, 'Frank', 'That first item is Frank'
			assert.equal balin.model.sortable.items.length, 4, 'That one element was removed from array'
			assert.equal elem.find('div').length, 4, 'That DOM elements are 4 too'

			doRound()

			assert.equal balin.model.sortable.items[0].text, 'Frank', 'That first item is still Frank'
			assert.equal balin.model.sortable.items.length, 4, 'That one element remains removed from array'
			assert.equal elem.find('div').length, 4, 'That DOM elements are 4 too'

		it 'Should allow push', ->
			model = balin.model.sortable
			assert.equal model.items.length, 4, 'That there are still 4 items from previous test'
			model.items.push new Maslosoft.Koe.HtmlValue({text: 'new'})

			assert.equal model.items.length, 5, 'That one element was added'
			assert.equal elem.find('div').length, 5, 'That DOM elements are 5 too'

			doRound()


			assert.equal model.items[4].text, 'new', 'That last item is `new`'
			assert.equal model.items.length, 5, 'That one element remains added'
			assert.equal elem.find('div').length, 5, 'That DOM elements remains 5 too'
			assert.equal elem.find('div')[4].innerHTML, 'new', 'That DOM elements text is `new`'
setTimeout test, 1000