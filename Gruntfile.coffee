binderBare = [
	'src/_functions.coffee',
	'src/_ns.coffee',
	'src/Binder.coffee',
	'src/Base.coffee',
	'src/Options.coffee',
	'src/Options/*',
	'src/Base/*'
	'src/BindingHandlers/*',
	'src/Helpers/*',
	'src/Widgets/**/*.coffee',
	'src/Tracker.coffee',
	'src/Model.coffee',
]

# Shallow clone array with slice
binder = binderBare.slice 0
binder.push 'src/_init.coffee'

# Bundle setup
bundle = [
	'bower_components/proxy-polyfill/proxy.min.js'
	'node_modules/weakmap/weakmap.min.js'
	'bower_components/knockout/dist/knockout.js'
	'bower_components/knockout-es5/dist/knockout-es5.min.js'
	'bower_components/knockout-sortable/build/knockout-sortable.min.js'
	'bower_components/knockout.punches/knockout.punches.min.js'
	'bower_components/maslosoft-playlist/dist/playlist.min.js'
]
bundleDev = [
	'bower_components/proxy-polyfill/proxy.js'
	'node_modules/weakmap/weakmap.js'
	'bower_components/knockout/dist/knockout.debug.js'
	'bower_components/knockout-es5/dist/knockout-es5.js'
	'bower_components/knockout-sortable/build/knockout-sortable.js'
	'bower_components/knockout.punches/knockout.punches.js'
	'bower_components/maslosoft-playlist/dist/playlist.js'
]

binderBundle = bundle.slice 0
binderBundle.push 'dist/ko.binder.min.js'

binderDevBundle = bundleDev.slice 0
binderDevBundle.push 'dist/ko.binder.js'

binderBundleNoinit = bundle.slice 0
binderBundleNoinit.push 'dist/ko.binder-noinit.min.js'

binderDevBundleNoinit = bundleDev.slice 0
binderDevBundleNoinit.push 'dist/ko.binder-noinit.js'

module.exports = (grunt) ->

	# Project configuration.
	grunt.initConfig
		coffee:
			compile:
				options:
					sourceMap: true
					join: true
					expand: true
					extDot: 'last'
				files: [
					'dist/ko.binder.js': binder
				]
			noinit:
				options:
					sourceMap: true
					join: true
					expand: true
					extDot: 'last'
				files: [
					'dist/ko.binder-noinit.js': binderBare
				]

		uglify:
			compile:
				files:
					'dist/ko.binder.min.js' : ['dist/ko.binder.js']
			noinit:
				files:
					'dist/ko.binder-noinit.min.js' : ['dist/ko.binder-noinit.js']
		concat:
			bundle:
				src: binderBundle
				dest: 'dist/ko.binder.bundle.min.js'
			bundleDev:
				src: binderDevBundle
				dest: 'dist/ko.binder.bundle.js'
			bundleNoinit:
				src: binderBundleNoinit
				dest: 'dist/ko.binder.bundle-noinit.min.js'
			bundleDevNoinit:
				src: binderDevBundleNoinit
				dest: 'dist/ko.binder.bundle-noinit.js'
		watch:
			compile:
				files: binder
				tasks: ['coffee:compile']

	# These plugins provide necessary tasks.
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-concat'

	# Default task.
	grunt.registerTask 'default', ['coffee']
	grunt.registerTask 'release', ['coffee', 'uglify', 'concat']
