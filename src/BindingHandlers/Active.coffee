#
# Disabled binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.Active extends @Maslosoft.Binder.CssClass

	constructor: (options) ->
		super new Maslosoft.Binder.CssOptions({className: 'active'})
