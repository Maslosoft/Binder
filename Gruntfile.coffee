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
					'dist/ko.balin.js': [
						'src/_ns.coffee',
						'src/Balin.coffee',
						'src/Base.coffee',
						'src/Options.coffee',
						'src/BindingHandlers/*.coffee',
						'src/Tracker.coffee'
					]
				]
		uglify:
			compile:
				files:
					'dist/ko.balin.min.js' : ['dist/ko.balin.js']
		watch:
			compile:
				files: ['src/*.coffee', 'src/Options/*.coffee', 'src/BindingHandlers/*.coffee']
				tasks: ['coffee:compile']

	# These plugins provide necessary tasks.
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-uglify'

	# Default task.
	grunt.registerTask 'default', ['coffee']