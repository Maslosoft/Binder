#
# Acl binding
# This adds class from options if value is true
#
class @Maslosoft.Ko.Balin.Acl extends @Maslosoft.Ko.Balin.Base
	
	allow = null

	init: () =>
		if not Maslosoft.Ko.Balin.Acl.allow
			throw new Error("Acl binding handler requires Maslosoft.Ko.Balin.Acl.allow to be function checking permissions")

		if typeof(Maslosoft.Ko.Balin.Acl.allow) isnt 'function'
			throw new Error("Acl binding handler requires Maslosoft.Ko.Balin.Acl.allow to be function checking permissions")

	update: (element, valueAccessor) =>
		acl = @getValue(valueAccessor)
		value = Maslosoft.Ko.Balin.Acl.allow(acl)

		# Forward to visible
		ko.bindingHandlers.visible.update element, ->
			value