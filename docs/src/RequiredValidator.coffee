if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}

class @Maslosoft.Ko.BalinDev.RequiredValidator extends @Maslosoft.Ko.Balin.BaseValidator


	isValid: (value) ->
		valid = !!value
		if not valid
			if @label
				@addError "{attribute} is required", {attribute: @label}
			else
				@addError "This field is required"
		return valid
