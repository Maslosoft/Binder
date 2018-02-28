#
# Asset binding handler
#
class @Maslosoft.Binder.Asset extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindings, viewModel, bindingContext) =>
		$element = $(element)

		# Get dimensions defined by other bindings
		width = allBindings.get 'w' or allBindings.get 'width' or null
		height = allBindings.get 'h' or allBindings.get 'height' or null

		# Get propotional flag if set
		proportional = allBindings.get 'p' or allBindings.get 'proportional' or null

		model = @getValue(valueAccessor)

		# Try to get timestamp
		if model.updateDate
			date = model.updateDate
			sec = date.sec
		url = model.url

		# Create new url including width, height and if it should cropped proportionally
		src = []

		# Add base url of asset
		src.push url

		# Add width
		if width
			src.push "w/#{width}"

		# Add height
		if height
			src.push "h/#{height}"

		# Crop to provided dimensions if not proportional
		if proportional is false
			src.push "p/0"

		# Add timestamp
		if sec
			src.push sec

		# Join parts of url
		src = src.join '/'

		if $element.attr("src") != src
			$element.attr "src", src
		return
