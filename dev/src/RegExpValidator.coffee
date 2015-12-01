if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}

class @Maslosoft.Ko.BalinDev.RegExpValidator extends @Maslosoft.Ko.Balin.BaseValidator

	pattern: ''

	flags: ''

	getErrors: () ->
		return ["Should match #{@pattern}"]

	isValid: (value) ->
		regexp = new RegExp @pattern, @flags
		return regexp.test(value)
