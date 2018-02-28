<div id="dynamicPropertiesTest" data-bind="sortable: {data: Object.keys(binder.model.settings.lang), as: 'key'}">
	<div data-bind="text: binder.model.settings.lang[key]"></div>
</div>
