window.balin = {};
window.balin.model = {};
var app = window.app;
var body = jQuery('body');
var defaultFontSize = false;
window.balin.increaseFont = function () {
	var body = jQuery('body');
	var fontSize = parseInt(body.css('font-size'));
	if (!defaultFontSize) {
		defaultFontSize = fontSize;
	}
	fontSize++;
	body.css('font-size', fontSize + 'px');
};
window.balin.decreaseFont = function () {
	var body = jQuery('body');
	var fontSize = parseInt(body.css('font-size'));
	if (!defaultFontSize) {
		defaultFontSize = fontSize;
	}
	fontSize--;
	body.css('font-size', fontSize + 'px');
};
window.balin.resetFont = function () {
	if (!defaultFontSize) {
		return;
	}
	var body = jQuery('body');
	body.css('font-size', defaultFontSize + 'px');
};