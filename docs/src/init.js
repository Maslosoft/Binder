window.binder = {};
window.binder.model = {};
window.binder.widget = {};
var app = window.app;
var body = jQuery('body');
var defaultFontSize = false;
window.binder.increaseFont = function () {
	var body = jQuery('body');
	var fontSize = parseInt(body.css('font-size'));
	if (!defaultFontSize) {
		defaultFontSize = fontSize;
	}
	fontSize++;
	body.css('font-size', fontSize + 'px');
};
window.binder.decreaseFont = function () {
	var body = jQuery('body');
	var fontSize = parseInt(body.css('font-size'));
	if (!defaultFontSize) {
		defaultFontSize = fontSize;
	}
	fontSize--;
	body.css('font-size', fontSize + 'px');
};
window.binder.resetFont = function () {
	if (!defaultFontSize) {
		return;
	}
	var body = jQuery('body');
	body.css('font-size', defaultFontSize + 'px');
};