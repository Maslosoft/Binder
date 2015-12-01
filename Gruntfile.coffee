balinBare = [
	'src/_ns.coffee',
	'src/Balin.coffee',
	'src/Base.coffee',
	'src/Options.coffee',
	'src/Options/*',
	'src/Base/*'
	'src/BindingHandlers/*',

	'src/Tracker.coffee',
	'src/Model.coffee',
]

# Shallow clone array with slice
balin = balinBare.slice 0
balin.push 'src/_init.coffee'

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
			noinit:
				options:
					sourceMap: true
					join: true
					expand: true
				files: [
					'dist/ko.balin-noinit.js': balinBare
				]

		uglify:
			compile:
				files:
					'dist/ko.balin.min.js' : ['dist/ko.balin.js']
			noinit:
				files:
					'dist/ko.balin-noinit.min.js' : ['dist/ko.balin-noinit.js']

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
	grunt.registerTask 'release', ['coffee', 'uglify']
