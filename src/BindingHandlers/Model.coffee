#
# Model binding handler
# This is to bind selected model properties to data-model field
#
class @Maslosoft.Ko.Balin.Model extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor, allBindings) =>

		# Setup binding
		model = @getValue(valueAccessor)
		fields = allBindings.get("fields") or null

		# Bind all fields if not set `fields` binding
		if fields is null
			@bindModel(element, model)
			return

		# Bind only selected fields
		modelStub = {}
		for field in fields
			# Filter out undefined model fields
			if typeof(model[field]) is 'undefined'
				warn "Model field `field` is undefined on element:", element
			else
				modelStub[field] = model[field]

			@bindModel(element, modelStub)


	bindModel: (element, model) ->

		# Do not stringify scalars
		if typeof(value) not in ['string', 'number']
			modelString = JSON.stringify(model)

		element.setAttribute('data-model', modelString)
