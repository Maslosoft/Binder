
class @Maslosoft.Ko.Balin.WidgetUrl extends @Maslosoft.Ko.Balin.Base

	getData: (element, valueAccessor, allBindings, bindingName) ->
		src = @getValue(valueAccessor)

		data = {}
		data.id = allBindings.get('widgetId') or src.id

		if allBindings.get('widget')
			data.id = allBindings.get('widget').id

		data[bindingName] = allBindings.get(bindingName) or src[bindingName]
		data.params = allBindings.get('params') or src.params

		if typeof(src) is 'string'
			data[bindingName] = src
		
		return data

	createUrl: (widgetId, action, params, terminator) =>
		
		args = [];
		if typeof(params) is 'string' or typeof(params) is 'number'
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