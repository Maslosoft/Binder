<div id="dynamicPropertiesTest" data-bind="sortable: {data: Object.keys(app.model.settings.lang), as: 'key'}">
	<div data-bind="text: app.model.settings.lang[key]"></div>
</div>
