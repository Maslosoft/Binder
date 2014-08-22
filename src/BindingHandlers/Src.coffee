#
# Html value binding
#
class @Maslosoft.Ko.Balin.Src extends @Maslosoft.Ko.Balin.Base

	update: (element, valueAccessor) =>
		src = @getValue(valueAccessor)
		if element.src isnt src
			element.src = src