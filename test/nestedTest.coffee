

class Task
	name: 'test'



describe 'Task instance', ->
	it 'should not fail', ->
		jQuery(document).ready () ->
			app.model.Src = new Maslosoft.Ko.BalinDev.Models.Src({filename: './images/maslosoft.png'})
			ko.applyBindings({model: app.model})
		
	it 'should have name', ->
		task = new Task
		task.name.should.equal "test"