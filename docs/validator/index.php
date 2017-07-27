<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Validator</title>
<h1>Validator</h1>
<h3>
	Bootstrap styled<br />
	<small>Validates if value will change</small>
</h3>
<p class="alert alert-warning">
	<b>Note:</b> Validators used in this example are for demo purpose,
	not recommended for production environment
</p>
<p>
	Validator binding handler is designed to handle validation to specialized
	classes, let alone providing only means to perform validation. To
	use <code>validator</code> annotation, it is required to prepare
	validation class first.
</p>
<p>
	It is designed to require minimal effort to add new validation classes. Theese
	should extend from <code>Maslosoft.Ko.Balin.BaseValidator</code>, and only required
	method to implement is <code>isValid(value)</code>, which should return <code>true</code>
	on valid value and <code>false</code> on bogus value. This base class also exposes
	method <code>addError</code> to provide error message, which can be displayed
	under form input.
</p>
<p>
	Additionally any property set on <code>validator</code> binding will be passed to
	instance of validation class. This allows configuring those classes. Validator
	binding accepts single class configuration or array of configuration to allow
	multiple validation rules combined.
</p>
<p>
	When class is not found, error message will be shown in console, however validator
	binding handler will do it's best to continue to work on remaining validator.
</p>
<p>
	Example of configurable regular expression validation class, written in coffescript:
</p>
<pre class="coffescript">
class @Maslosoft.Ko.BalinDev.RegExpValidator extends @Maslosoft.Ko.Balin.BaseValidator

	pattern: ''

	flags: ''

	allowEmpty: true

	isValid: (value) ->
		if @allowEmpty and not value
			return true
		regexp = new RegExp @pattern, @flags
		valid = regexp.test(value)
		if not valid
			@addError "Should match #{@pattern}"
		return valid
</pre>
<!-- /trim -->
<div data-bind="with: balin.model.txt1" class="form-group">
	<label class="control-label" for="txt1">Validate input if it's only a-z:</label>
	<input class="form-control" id="txt1" data-bind="textInput: text, validator: {_class: Maslosoft.Ko.BalinDev.RegExpValidator, pattern: '^[a-z]+$', allowEmpty: false}" style="width:50%;"/>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>

<div data-bind="with: balin.model.txt1a" class="form-group">
	<label class="control-label" for="txt1a">Validate input if it's only a-z:</label>
	<input class="form-control" id="txt1a" data-bind="textInput: text, validator: [{_class: Maslosoft.Ko.BalinDev.RequiredValidator}, {_class: Maslosoft.Ko.BalinDev.EmailValidator}]" style="width:50%;"/>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>

<div data-bind="with: balin.model.txt2" class="form-group">
	<label class="control-label" for="txt2">Validate (empty) textarea if it's only a-z:</label>
	<textarea class="form-control" id="txt2" data-bind="textInput: text, validator: {_class: Maslosoft.Ko.BalinDev.RegExpValidator, pattern: '^[a-z]+$', allowEmpty: false}" style="width:50%;"></textarea>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<div data-bind="with: balin.model.txt3" class="form-group">
	<label class="control-label" for="txt3">Validate contenteditable if it's only a-z, A-Z, 0-9 _:</label>
	<div class="form-control" id="txt3" data-bind="htmlValue: text, validator: [{_class: Maslosoft.Ko.BalinDev.RegExpValidator, pattern: '~^[A-Za-z0-9_]+$~', allowEmpty: false}]" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>

<div data-bind="with: balin.model.txt3" class="form-group">
	<label class="control-label" for="txt4">Validate contenteditable if it's not empty and valid email:</label>
	<div class="form-control" id="txt4" data-bind="htmlValue: text, validator: [{_class: Maslosoft.Ko.BalinDev.EmailValidator, label: 'E-mail'}, {_class: Maslosoft.Ko.BalinDev.RequiredValidator, label: 'E-mail'}]" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<div data-bind="with: balin.model.txt3" class="form-group">
	<label class="control-label" for="txt4">Validate contenteditable if it's not empty and valid email (reverse validation order):</label>
	<div class="form-control" id="txt5" data-bind="htmlValue: text, validator: [{_class: Maslosoft.Ko.BalinDev.RequiredValidator, label: 'E-mail'}, {_class: Maslosoft.Ko.BalinDev.EmailValidator, label: 'E-mail'}]" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<div data-bind="with: balin.model.txt3" class="form-group">
	<label class="control-label" for="txt5">Validate contenteditable - required:</label>
	<div class="form-control" id="txt6" data-bind="htmlValue: text, validator: {_class: Maslosoft.Ko.BalinDev.RequiredValidator, model: $data}" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<div data-bind="with: balin.model.txt6" class="form-group">
	<label class="control-label" for="txt6">This should raise errors in console, but continue to work with any proper validator (required):</label>
	<div class="form-control" id="txt7" data-bind="htmlValue: text, validator: [{_class: Maslosoft.Ko.BalinDev.RequiredValidator, label: 'Address'}, {foo:'bar'}, {_class:'DoesNotExists'}, {_class: Maslosoft.Ko.BalinDev.BogusValidator}]" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<script>
	window.onload = (function () {
		var data1 = {
			text: 'Some Text value'
		};
		var data2 = {
			text: ''
		};
		var data3 = {
			text: 'admin@example.com'
		};

		var data6 = {
			text: 'Partially bogus validators config'
		};

		balin.model.txt1 = new Maslosoft.Ko.BalinDev.Models.TextValue(data1);
		balin.model.txt2 = new Maslosoft.Ko.BalinDev.Models.TextValue(data2);
		balin.model.txt3 = new Maslosoft.Ko.BalinDev.Models.TextValue(data3);
		balin.model.txt6 = new Maslosoft.Ko.BalinDev.Models.TextValue(data6);

		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
