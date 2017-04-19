if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}

class @Maslosoft.Ko.BalinDev.RegExpValidator extends @Maslosoft.Ko.Balin.BaseValidator

	pattern: ''

	flags: ''

	allowEmpty: true

	isValid: (value) ->
		if @allowEmpty and not value
			return true
		regexp = new RegExp @pattern, @flags
		valid = regexp.test(value)
		if not valid
			@addError "Should match #{@pattern}"
		return valid
