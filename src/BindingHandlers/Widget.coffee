
class @Maslosoft.Ko.Balin.Widget extends @Maslosoft.Ko.Balin.Base
	
	init: (element, valueAccessor, allBindings, context) =>
		
		className = @getValue valueAccessor
		
		if typeof(className) isnt 'function' then return
		
		if typeof(className.constructor) isnt 'function' then return
		
		try
			widget = new className
		catch Error
			return
		
		params = allBindings.get 'params'
		
		if params
			for name, value of params
				widget[name] = value
		
		ref = allBindings.get 'ref'
		setRefByName ref, widget
		console.log ref
		
		if ref
			ref = widget
		
		if typeof(widget.init) is 'function'
			widget.init(element)
		
		if typeof(widget.dispose) is 'function'
			ko.utils.domNodeDisposal.addDisposeCallback element, widget.dispose
		
	update: (element, valueAccessor) =>