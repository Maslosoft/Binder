if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}

class @Maslosoft.Ko.BalinDev.EmailValidator extends @Maslosoft.Ko.Balin.BaseValidator

	pattern: '^[a-z]+@[a-z]+\\.[a-z]+$'

	allowEmpty: true

	getErrors: () ->
		return ["Please enter valid email"]

	isValid: (value) ->
		console.log value
		if @allowEmpty and not value
			return true
		
		regexp = new RegExp @pattern, @flags
		return regexp.test(value)
