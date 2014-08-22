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
# Register default set of binding handlers, or part of default set
#
@Maslosoft.Ko.Balin.registerDefaults = (handlers = null) ->
	config = {
		htmlValue: Maslosoft.Ko.Balin.HtmlValue,
		fileSizeFormatter: Maslosoft.Ko.Balin.FileSizeFormatter
	}
	if handlers
		for index, value in handlers
			Maslosoft.Ko.Balin.register(value, config[value])
	else
		for index, value in config
			Maslosoft.Ko.Balin.register(index, value)