if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}

class @Maslosoft.Ko.BalinDev.Validator extends @Maslosoft.Ko.Balin.BaseValidator

	pattern: ''

	flags: ''

	getErrors: () ->

	isValid: (value) ->
		regexp = new RegExp @pattern, @flags
		return regexp.test(value)
