#
# Eval binding handler
#
class @Maslosoft.Binder.Eval extends @Maslosoft.Binder.Base

	init: (element, valueAccessor) =>
		# Let bindings proceed as normal *only if* my value is false
		allowBindings = @getValue valueAccessor
		console.log allowBindings
		return { controlsDescendantBindings: !allowBindings }

	update: (element, valueAccessor) =>
		# Let bindings proceed as normal *only if* my value is false
		allowBindings = @getValue valueAccessor
		console.log allowBindings
		return { controlsDescendantBindings: !allowBindings }