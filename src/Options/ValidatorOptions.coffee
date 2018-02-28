#
# Configuration class for css bindings
#
class @Maslosoft.Binder.ValidatorOptions extends @Maslosoft.Binder.Options

	#
	# Field for class name
	# @var string
	#
	classField: '_class'

	#
	# CSS selector to find parent element
	# @var string
	#
	parentSelector: '.form-group'

	#
	# Failed validation class name.
	# This class will be added to input if validation fails.
	# @var string
	#
	inputError: 'error'

	#
	# Failed validation parent class name.
	# This class will be added to parent of input if validation fails.
	# @var string
	#
	parentError: 'has-error'

	#
	# Warning validation class name.
	# This class will be added to input if validation has warnings.
	# @var string
	#
	inputWarning: 'warning'

	#
	# Warning validation parent class name.
	# This class will be added to parent of input if validation has warnings.
	# @var string
	#
	parentWarning: 'has-warning'

	#
	# Succeed validation class name.
	# This class will be added to input if validation succeds.
	# @var string
	#
	inputSuccess: 'success'

	#
	# Succeed validation parent class name.
	# This class will be added to parent of input if validation succeds.
	# @var string
	#
	parentSuccess: 'has-success'

	#
	# Selector for error messages. Will scope from input parent.
	# @var string
	#
	errorMessages: '.error-messages'

	#
	# Selector for warning messages. Will scope from input parent.
	# @var string
	#
	warningMessages: '.warning-messages'

