#
# Register binding handler
# @param string name
# @params Maslosoft.Ko.Balin.Base handler
#
@Maslosoft.Ko.Balin.register = (name, handler) ->
	ko.bindingHandlers[name] = handler
	if handler.writable
		ko.expressionRewriting.twoWayBindings[name] = true

#
# Register default set of binding handlers
#
@Maslosoft.Ko.Balin.registerDefaults = () ->
	Maslosoft.Ko.Balin.register('htmlValue', new Maslosoft.Ko.Balin.HtmlValue)
	