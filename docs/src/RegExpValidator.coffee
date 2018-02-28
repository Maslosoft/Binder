if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.BinderDev
	@Maslosoft.BinderDev = {}

class @Maslosoft.BinderDev.RegExpValidator extends @Maslosoft.Binder.BaseValidator

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
