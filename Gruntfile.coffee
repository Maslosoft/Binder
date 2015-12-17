balinBare = [
	'src/_functions.coffee',
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

# Bundle setup
bundle = [
	'bower_components/knockout/dist/knockout.js'
	'bower_components/knockout-es5/dist/knockout-es5.min.js'
	'bower_components/knockout-sortable/build/knockout-sortable.min.js'
	'bower_components/knockout.punches/knockout.punches.min.js'
]

balinBundle = bundle.slice 0
balinBundle.push 'dist/ko.balin.min.js'

balinBundleNoinit = bundle.slice 0
balinBundleNoinit.push 'dist/ko.balin-noinit.min.js'

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
		concat:
			bundle:
				src: balinBundle
				dest: 'dist/ko.balin.bundle.min.js'
			bundleNoinit:
				src: balinBundleNoinit
				dest: 'dist/ko.balin.bundle-noinit.min.js'
		watch:
			compile:
				files: balin
				tasks: ['coffee:compile']

	# These plugins provide necessary tasks.
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-concat'

	# Default task.
	grunt.registerTask 'default', ['coffee']
	grunt.registerTask 'release', ['coffee', 'uglify', 'concat']
