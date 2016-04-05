balinBare = [
	'src/_functions.coffee',
	'src/_ns.coffee',
	'src/Balin.coffee',
	'src/Base.coffee',
	'src/Options.coffee',
	'src/Options/*',
	'src/Base/*'
	'src/BindingHandlers/*',
	'src/Helpers/*',
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
bundleDev = [
	'bower_components/knockout/dist/knockout.debug.js'
	'bower_components/knockout-es5/dist/knockout-es5.js'
	'bower_components/knockout-sortable/build/knockout-sortable.js'
	'bower_components/knockout.punches/knockout.punches.js'
]

balinBundle = bundle.slice 0
balinBundle.push 'dist/ko.balin.min.js'

balinDevBundle = bundleDev.slice 0
balinDevBundle.push 'dist/ko.balin.js'

balinBundleNoinit = bundle.slice 0
balinBundleNoinit.push 'dist/ko.balin-noinit.min.js'

balinDevBundleNoinit = bundleDev.slice 0
balinDevBundleNoinit.push 'dist/ko.balin-noinit.js'

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
			bundleDev:
				src: balinDevBundle
				dest: 'dist/ko.balin.bundle.js'
			bundleNoinit:
				src: balinBundleNoinit
				dest: 'dist/ko.balin.bundle-noinit.min.js'
			bundleDevNoinit:
				src: balinDevBundleNoinit
				dest: 'dist/ko.balin.bundle-noinit.js'
		watch:
			compile:
				files: balin
				tasks: ['coffee', 'uglify', 'concat']

	# These plugins provide necessary tasks.
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-concat'

	# Default task.
	grunt.registerTask 'default', ['coffee']
	grunt.registerTask 'release', ['coffee', 'uglify', 'concat']
