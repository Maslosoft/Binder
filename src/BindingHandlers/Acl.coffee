#
# Acl binding
# This adds class from options if value is true
#
class @Maslosoft.Binder.Acl extends @Maslosoft.Binder.Base
	
	allow = null

	init: () =>
		if not Maslosoft.Binder.Acl.allow
			throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions")

		if typeof(Maslosoft.Binder.Acl.allow) isnt 'function'
			throw new Error("Acl binding handler requires Maslosoft.Binder.Acl.allow to be function checking permissions")

	update: (element, valueAccessor) =>
		acl = @getValue(valueAccessor)
		value = Maslosoft.Binder.Acl.allow(acl)

		# Forward to visible
		ko.bindingHandlers.visible.update element, ->
			value