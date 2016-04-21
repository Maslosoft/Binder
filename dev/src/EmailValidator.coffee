if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}

class @Maslosoft.Ko.BalinDev.EmailValidator extends @Maslosoft.Ko.Balin.BaseValidator

	pattern: '^[a-z]+@[a-z]+\\.[a-z]+$'

	allowEmpty: true

	isValid: (value) ->
		if @allowEmpty and not value
			return true

		# Example warning
		if value.match(/com/)
			console.log 'warn...'
			@addWarning "This domain has frequently rejected our e-mail. Please add admin@example.com to your whitelist. This is example warnings message."

		regexp = new RegExp @pattern, @flags
		valid = regexp.test(value)
		if not valid
			@addError "Please enter valid e-mail"
		return valid
