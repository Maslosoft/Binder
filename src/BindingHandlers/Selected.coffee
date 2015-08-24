#
# Selected binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.Selected extends@Maslosoft.Ko.Balin.CssClass

	constructor: (options) ->
		super new Maslosoft.Ko.Balin.CssOptions({className: 'selected'})
