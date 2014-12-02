balin = [
	'src/_ns.coffee',
	'src/Balin.coffee',
	'src/Base.coffee',
	'src/Options.coffee',
	'src/Options/DateOptions.coffee',
	'src/Options/DateTimeOptions.coffee',
	'src/Options/TimeOptions.coffee',
	'src/BindingHandlers/DateTime.coffee',
	'src/BindingHandlers/DateTimeFormatter.coffee',
	'src/BindingHandlers/Fancytree.coffee',
	'src/BindingHandlers/FileSizeFormatter.coffee',
	'src/BindingHandlers/Href.coffee',
	'src/BindingHandlers/HtmlValue.coffee',
	'src/BindingHandlers/Selected.coffee',
	'src/BindingHandlers/Src.coffee',
	'src/BindingHandlers/TextValue.coffee',
	'src/Tracker.coffee',
	'src/Model.coffee'
]

module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		coffee:
			compile:
				options:
					sourceMap: true
					join: true
					expand: true
				files: [
					'dist/ko.balin.js': balin
				]
		uglify:
			compile:
				files:
					'dist/ko.balin.min.js' : ['dist/ko.balin.js']
		watch:
			compile:
				files: balin
				tasks: ['coffee:compile']

	# These plugins provide necessary tasks.
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-uglify'

	# Default task.
	grunt.registerTask 'default', ['coffee']