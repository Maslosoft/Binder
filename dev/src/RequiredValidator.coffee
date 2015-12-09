if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}

class @Maslosoft.Ko.BalinDev.RequiredValidator extends @Maslosoft.Ko.Balin.BaseValidator

	getErrors: () ->
		return ["This is required"]

	isValid: (value) ->
		return !!value
