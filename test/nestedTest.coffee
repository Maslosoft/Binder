

class Task
	name: 'test'



describe 'TODO', ->
	it 'should not fail', ->
		
	it 'should have name', ->
		task = new Task
		task.name.should.equal "test"