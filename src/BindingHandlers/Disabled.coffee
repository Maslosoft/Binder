#
# Disabled binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.Disabled extends @Maslosoft.Binder.CssClass

	constructor: (options) ->
		super new Maslosoft.Binder.CssOptions({className: 'disabled'})
