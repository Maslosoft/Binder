
class @Maslosoft.Ko.Balin.Widget extends @Maslosoft.Ko.Balin.Base
	
	init: (element, valueAccessor, allBindings, context) =>
		
		className = @getValue valueAccessor

		ref = allBindings.get 'ref'

		# Ref is string, try to create new widget and set ref
		if typeof(ref) is 'string' or not ref

			if typeof(className) isnt 'function' then return

			if typeof(className.constructor) isnt 'function' then return

			try
				widget = new className
			catch Error
				return
			if ref
				setRefByName ref, widget


			if ref
				ref = widget
		else
#			console.log 'By ref...'
#			console.log ref, typeof(ref)
			if typeof(ref) is 'object'
#				console.log 'Assign ref...'
				widget = ref

		params = allBindings.get 'params'
		
		if params
			for name, value of params
				widget[name] = value

		if typeof(widget.init) is 'function'
			widget.init(element)
		
		if typeof(widget.dispose) is 'function'
			ko.utils.domNodeDisposal.addDisposeCallback element, widget.dispose
		
	update: (element, valueAccessor) =>