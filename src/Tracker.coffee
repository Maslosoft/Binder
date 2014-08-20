@Maslosoft.Ko.getType = (type) ->
	if x and typeof x is 'object'
		if x.constructor is Date then return 'date'
		if x.constructor is Array then return 'array'
	return typeof x

@Maslosoft.Ko.objByName = (name, context = window) ->
			args = Array.prototype.slice.call(arguments, 2)
			ns = name.split "."
			func = context
			for n, i in ns
				func = func[n]
			return func

class @Maslosoft.Ko.Track
	
	factory: (data) =>
		# Return if falsey value
		if not data then return data

		# Check if has prototype
		if data._class
			className = data._class.replace(/\\/g, '.')
			ref = @Maslosoft.Ko.objByName(className)
			if ref
				return new ref(data)
			else
				console.error("Class #{className} not found, using default object")
				console.warn(data)

		# Track generic object
		if typeof data is 'object'
			for name, value of data
				data[name] = @factory(value)
			data = ko.track(data)
			
		return data
		
		

ko.tracker = new @Maslosoft.Ko.Track

class @Maslosoft.Ko.TrackTest extends @Maslosoft.Components.Model
	name: ''
	nested: null

	_class: 'Maslosoft\\Ko\\TrackTest'
	rawI18N: null
	parentId: null

class @Maslosoft.Ko.TrackTestNest extends @Maslosoft.Components.Model
	_class: 'Maslosoft\\Ko\\TrackTestNest'
	name: ''