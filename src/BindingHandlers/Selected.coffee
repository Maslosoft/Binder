#
# Selected binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.Selected extends@Maslosoft.Binder.CssClass

	constructor: (options) ->
		super new Maslosoft.Binder.CssOptions({className: 'selected'})
