#
# Icon binding handler
# This is to select proper icon or scaled image thumbnail
#
class @Maslosoft.Binder.Icon extends @Maslosoft.Binder.Base

	update: (element, valueAccessor, allBindings) =>
		$element = $(element)
		model = @getValue(valueAccessor)

		extra = @getValue(allBindings)

		iconField = allBindings.get("iconField") or 'icon'
		if not model
			if console
				console.warn 'Binding value for `icon` binding not defined, skipping. Element:'
				console.warn element
				console.warn (new Error).stack
			return
		src = model[iconField]

		isSvg = false
		if src.match /\.(svg)$/
			isSvg = true

		nameSuffix = ''
		if src.match /\.(jpg|jped|gif|png|svg)$/
			matched = src.match /[^\/]*?\.(jpg|jped|gif|png|svg)$/
			nameSuffix = matched[0]
			src = src.replace /[^\/]*?\.(jpg|jped|gif|png|svg)$/, ""

		if not nameSuffix and model.filename
			nameSuffix = model.filename

		# Get icon size
		# TODO This should be configurable with options
		if typeof model.iconSize is 'undefined'
			defaultSize = 16
		else
			defaultSize = model.iconSize

		size = allBindings.get("iconSize") or defaultSize
		regex = new RegExp("/" + defaultSize + "/", "g")

		# Check if it's image
		# TODO This should be configurable with options
		if typeof model.isImage is 'undefined'
			isImage = true
		else
			isImage = model.isImage

		# This is to not add scaling params for svg's
		if isSvg
			isImage = false

		# TODO This must be configurable with options
		if isImage
			# Get image thumbnail
			# End with /
			if not src.match(new RegExp("/$"))
				src = src + '/'
			# Dimensions are set
			if src.match(new RegExp("/w/", "g"))
				src = src.replace(regex, "/" + size + "/")
			# Dimensions are not set, set it here
			else
				src = src + "w/#{size}/h/#{size}/p/0/"
				
			# Add timestamp if set
			if model.updateDate
				date = null
				if model.updateDate.sec
					date = model.updateDate.sec
				else
					date = model.updateDate
				if typeof(date) is 'number'
					src = src + date
				if typeof(date) is 'string'
					src = src + date
		else
			# Calculate size steps for normal icons
			fixedSize = 16
			if size > 16
				fixedSize = 32
			if size > 32
				fixedSize = 48
			if size > 48
				fixedSize = 512
			src = src.replace(regex, "/" + fixedSize + "/")

		if src.match /\/$/
			src = src + nameSuffix
		else
			src = src + '/' + nameSuffix

		if extra.cachebusting
			src = src + '?' + new Date().getTime()

		# Update src only if changed
		if $element.attr("src") != src

			if extra.preloader
				$element.attr 'src', extra.preloader

			preload $element, src

		# Set max image dimensions
		$element.css
			width: "#{size}px"
			height: 'auto'
			maxWidth: '100%'

		return
