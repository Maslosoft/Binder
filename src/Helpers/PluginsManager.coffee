

class PluginsManager

	classField: '_class'

	element: null

	#
	#
	# @var object[]
	#
	plugins: null

	constructor: (@element = null, @classField = '_class') ->
		@plugins = new Array

	#
	# Create configured instances out of configuration
	# containing _class and optional params
	#
	# Example configuration for one plugin:
	# ```
	# {
	# 	_class: Maslosoft.BinderDev.RegExpValidator,
	# 	pattern: '^[a-z]+$',
	# 	allowEmpty: false
	# }
	# ```
	#
	# Example configuration for many plugins:
	# ```
	# [
	# 	{
	# 		_class: Maslosoft.BinderDev.EmailValidator,
	# 		label: 'E-mail'
	# 	},
	# 	{
	# 		_class: Maslosoft.BinderDev.RequiredValidator,
	# 		label: 'E-mail'
	# 	}
	# ]
	# ```
	#
	# @param object
	# @return object[]
	#
	from: (configuration) ->

		element = @element
		classField = @classField
		@plugins = new Array

		if not configuration
			return @plugins

		if configuration.constructor is Array
			cfg = configuration
		else
			cfg = [configuration]

		for config in cfg
	#			console.log config

			if not config[classField]
				error "Parameter `#{classField}` must be defined for plugin on element:", element
				continue

			if typeof(config[classField]) isnt 'function'
				error "Parameter `#{classField}` must be plugin compatible class, binding defined on element:", element
				continue

			# Store class name first, as it needs to be removed
			className = config[classField]

			# Remove class key, to not interrupt plugin configuration
			delete(config[classField])

			# Instantiate plugin
			plugin = new className
			for index, value of config
				plugin[index] = null
				plugin[index] = value

			@plugins.push plugin

			return @plugins

	getElementValue: (element, value) =>

		for plugin in @plugins
			if typeof(plugin.getElementValue) is 'function'
				value = plugin.getElementValue element, value
		return value

	getModelValue: (element, value) =>

		for plugin in @plugins
			if typeof(plugin.getModelValue) is 'function'
				value = plugin.getModelValue element, value
		return value