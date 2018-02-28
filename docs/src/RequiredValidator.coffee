if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.BinderDev
	@Maslosoft.BinderDev = {}

class @Maslosoft.BinderDev.RequiredValidator extends @Maslosoft.Binder.BaseValidator


	isValid: (value) ->
		valid = !!value
		if not valid
			if @label
				@addError "{attribute} is required", {attribute: @label}
			else
				@addError "This field is required"
		return valid
