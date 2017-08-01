<div id="dynamicPropertiesTest" data-bind="sortable: {data: Object.keys(balin.model.settings.lang), as: 'key'}">
	<div data-bind="text: balin.model.settings.lang[key]"></div>
</div>
