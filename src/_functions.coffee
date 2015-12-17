assert = (expr) ->
	if not console then return
	console.assert expr

log = (expr) ->
	if not console then return
	console.log expr

warn = (expr, element = null) ->
	if not console then return
	console.warn expr
	if element is null then return
	console.warn element

error = (expr, element = null) ->
	if not console then return
	console.error expr
	if element is null then return
	console.error element
