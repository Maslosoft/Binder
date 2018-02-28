test = () ->
	class @Maslosoft.Koe.Settings extends Maslosoft.Binder.Model
		_class: 'Maslosoft.Koe.Settings'
		lang: {}

	settings = new Maslosoft.Koe.Settings
	settings.lang.en = 'English'
	settings.lang.pl = 'Polish'

	binder.model.settings = settings

	ko.track binder.model

	ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'))

	doRound = () ->
		json = JSON.stringify binder.model
		res = JSON.parse json

		# Update or create new models
		for index, model of res
			if !!binder.model[index]
				ko.tracker.fromJs(binder.model[index], res[index])
			else
				binder.model[index] = ko.tracker.factory res[index]

	elem = jQuery('#dynamicPropertiesTest')

	describe 'Test if will allow use of dynamic properties and do round-trip', ->

		it 'Should allow adding property', ->
			settings = binder.model.settings
			assert.equal Object.keys(settings.lang).length, 2
			settings.lang.fr = 'Francaise'
			settings.lang.de = 'Deutch'

			assert.equal Object.keys(settings.lang).length, 4
			assert.equal elem.find('div').length, 4, 'That DOM elements are 4 before round trip'
			doRound()
			assert.equal Object.keys(settings.lang).length, 4, 'That there are still 4 languages'
			assert.equal elem.find('div').length, 4, 'That DOM elements are 4 after round trip'

		it 'Should allow removing property', ->
			settings = binder.model.settings
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