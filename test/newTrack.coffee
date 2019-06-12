fromJs: (model, jsData) =>
	for name, value of jsData
		if typeof(value) is 'object'
			if Array.isArray value
#					console.log "Array " + name
				console.log value
				model[name] = ko.track [], {deep: false}
				for item, index in value
					model[name][index] = @factory item
			else
				if model[name]
					@fromJs model[name], value
				else
					model[name] = @factory value
		else
			model[name] = value