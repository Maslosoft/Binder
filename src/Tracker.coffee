@Maslosoft.Ko.getType = (type) ->
	if x and typeof x is 'object'
		if x.constructor is Date then return 'date'
		if x.constructor is Array then return 'array'
	return typeof x

@Maslosoft.Ko.objByName = (name, context = window) ->
	args = Array.prototype.slice.call(arguments, 2)
	ns = name.split "."
	func = context
	part = []
	for n, i in ns
		part.push n
		if typeof func[n] is 'undefined'
			throw new Error "Name part `#{part.join('.')}` not found while accesing #{name}"
		func = func[n]
	return func

class @Maslosoft.Ko.Track

	factory: (data) =>
		# Return if falsey value
		if not data then return data

		# Check if has prototype
		if data._class and typeof(data._class) is 'string'
			# Convert PHP class name to js class name
			className = data._class.replace(/\\/g, '.')
			try
				ref = Maslosoft.Ko.objByName(className)
			catch Error
				console.warn("Could not resolve class name `#{className}`")

			if ref
				return new ref(data)
			else
				console.warn("Class `#{className}` not found, using default object")
				console.debug(data)

		# Track generic object
		if typeof(data) is 'object'
			data = ko.track(data, {deep: true})
			# Check if array (different loop used here)
			if Array.isArray data
				for model, index in data
					data[index] = @factory model
			else
				for name, value of data
					data[name] = @factory(value)
		
		return data

	fromJs: (model, jsData) =>
		for name, value of jsData
			if typeof(value) is 'object'
				if model[name]
					@fromJs model[name], value
				else
					model[name] = @factory value
			else
				model[name] = value

ko.tracker = new @Maslosoft.Ko.Track
