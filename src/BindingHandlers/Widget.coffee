
class @Maslosoft.Ko.Balin.Widget extends @Maslosoft.Ko.Balin.Base
	
	init: (element, valueAccessor, allBindings, context) =>
		
		className = @getValue valueAccessor
		widget = new className
		
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