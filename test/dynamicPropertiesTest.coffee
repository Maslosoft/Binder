test = () ->
	class @Maslosoft.Ko.BalinDev.Models.Settings extends Maslosoft.Ko.Balin.Model
		_class: 'Maslosoft.Ko.BalinDev.Models.Settings'
		lang: {}

	settings = new Maslosoft.Ko.BalinDev.Models.Settings
	settings.lang.en = 'English'
	settings.lang.pl = 'Polish'

	balin.model.settings = settings

	ko.track balin.model

	ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'))

	doRound = () ->
		json = JSON.stringify balin.model
		res = JSON.parse json

		# Update or create new models
		for index, model of res
			if !!balin.model[index]
				ko.tracker.fromJs(balin.model[index], res[index])
			else
				balin.model[index] = ko.tracker.factory res[index]

	elem = jQuery('#dynamicPropertiesTest')

	describe 'Test if will allow use of dynamic properties and do round-trip', ->

		it 'Should allow adding property', ->
			settings = balin.model.settings
			assert.equal Object.keys(settings.lang).length, 2
			settings.lang.fr = 'Francaise'
			settings.lang.de = 'Deutch'

			assert.equal Object.keys(settings.lang).length, 4
			assert.equal elem.find('div').length, 4, 'That DOM elements are 4 before round trip'
			doRound()
			assert.equal Object.keys(settings.lang).length, 4, 'That there are still 4 languages'
			assert.equal elem.find('div').length, 4, 'That DOM elements are 4 after round trip'

		it 'Should allow removing property', ->
			settings = balin.model.settings
			assert.equal Object.keys(settings.lang).length, 4

			delete settings.lang.fr
			delete settings.lang.de
			delete settings.lang.pl


			settings.lang.en = 'foo'

			assert.equal Object.keys(settings.lang).length, 1
			assert.equal elem.find('div').length, 1, 'That DOM elements are 1 before round trip'
			doRound()
			assert.equal Object.keys(settings.lang).length, 1, 'That there are now 1 languages'
			assert.equal elem.find('div').length, 1, 'That DOM elements are 1 after round trip'
			assert.equal elem.find('div')[0].innerHTML, 'foo', 'That DOM elements is changed to foo'
setTimeout test, 1000