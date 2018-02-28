
class @Maslosoft.Binder.WidgetUrl extends @Maslosoft.Binder.Base

	getData: (element, valueAccessor, allBindings, bindingName) ->
		src = @getValue(valueAccessor)

		data = {}
		data.id = allBindings.get('widgetId') or src.id

		if allBindings.get('widget')
			data.id = allBindings.get('widget').id

		data[bindingName] = allBindings.get(bindingName) or src[bindingName]

		# Need to check for undefined here,
		# as params might be `0` or `` or `false`
		bindingParams = allBindings.get('params');
		if typeof(bindingParams) is undefined
			data.params = src.params
		else
			data.params = bindingParams
		
		data.params = @getValue(data.params)

		if typeof(src) is 'string'
			data[bindingName] = src
		
		return data

	createUrl: (widgetId, action, params, terminator) =>
		
		args = [];
		# Assign one value params
		
		if typeof(params) is 'string' or typeof(params) is 'number'
			# Skip empty strings
			if params isnt "" or typeof(params) is 'number'
				args.push "" + params
		else
			for name, value of params
				name = encodeURIComponent("" + name)
				value = encodeURIComponent("" + value)
				args.push "#{name}:#{value}"
		
		href = "#{terminator}#{widgetId}.#{action}";
		
		if args.length is 0
			return href;
		else
			args = args.join(',', args)
			return "#{href}=#{args}"

	setRel: (element) =>

		hasRel = false
		isPlain = false
		rels = []
		rel = element.getAttribute('rel')
		if rel
			rels = rel.split(' ')
			for relValue in rels
				if relValue is 'plain'
					isPlain = true
				if relValue is 'virtual'
					hasRel = true

		if not hasRel and not isPlain
			rels.push 'virtual'

		element.setAttribute('rel', rels.join(' '))