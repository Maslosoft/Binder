<?php require './_header.php'; ?>
<h3>
	Bootstrap styled<br />
	<small>Validates if value will change</small>
</h3>
<p>
	<b>Note:</b> Validators used in this example are for demo purpose,
	not recommended for production environment
</p>

<div data-bind="with: app.model.txt1" class="form-group">
	<label class="control-label" for="txt1">Validate input if it's only a-z:</label>
	<input class="form-control" id="txt1" data-bind="textInput: text, validator: {_class: Maslosoft.Ko.BalinDev.RegExpValidator, pattern: '^[a-z]+$', allowEmpty: false}" style="width:50%;"/>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>

<div data-bind="with: app.model.txt1a" class="form-group">
	<label class="control-label" for="txt1a">Validate input if it's only a-z:</label>
	<input class="form-control" id="txt1a" data-bind="textInput: text, validator: [{_class: Maslosoft.Ko.BalinDev.RequiredValidator}, {_class: Maslosoft.Ko.BalinDev.EmailValidator}]" style="width:50%;"/>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>

<div data-bind="with: app.model.txt2" class="form-group">
	<label class="control-label" for="txt2">Validate (empty) textarea if it's only a-z:</label>
	<textarea class="form-control" id="txt2" data-bind="textInput: text, validator: {_class: Maslosoft.Ko.BalinDev.RegExpValidator, pattern: '^[a-z]+$', allowEmpty: false}" style="width:50%;"></textarea>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<div data-bind="with: app.model.txt3" class="form-group">
	<label class="control-label" for="txt3">Validate contenteditable if it's only a-z, A-Z, 0-9 _:</label>
	<div class="form-control" id="txt3" data-bind="htmlValue: text, validator: [{_class: Maslosoft.Ko.BalinDev.RegExpValidator, pattern: '~^[A-Za-z0-9_]+$~', allowEmpty: false}]" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>

<div data-bind="with: app.model.txt3" class="form-group">
	<label class="control-label" for="txt4">Validate contenteditable if it's not empty and valid email:</label>
	<div class="form-control" id="txt4" data-bind="htmlValue: text, validator: [{_class: Maslosoft.Ko.BalinDev.EmailValidator, label: 'E-mail'}, {_class: Maslosoft.Ko.BalinDev.RequiredValidator, label: 'E-mail'}]" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<div data-bind="with: app.model.txt3" class="form-group">
	<label class="control-label" for="txt4">Validate contenteditable if it's not empty and valid email (reverse validation order):</label>
	<div class="form-control" id="txt5" data-bind="htmlValue: text, validator: [{_class: Maslosoft.Ko.BalinDev.RequiredValidator, label: 'E-mail'}, {_class: Maslosoft.Ko.BalinDev.EmailValidator, label: 'E-mail'}]" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<div data-bind="with: app.model.txt3" class="form-group">
	<label class="control-label" for="txt5">Validate contenteditable - required:</label>
	<div class="form-control" id="txt6" data-bind="htmlValue: text, validator: {_class: Maslosoft.Ko.BalinDev.RequiredValidator, model: $data}" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<div data-bind="with: app.model.txt6" class="form-group">
	<label class="control-label" for="txt6">This should raise errors in console, but continue to work with any proper validator (required):</label>
	<div class="form-control" id="txt7" data-bind="htmlValue: text, validator: [{_class: Maslosoft.Ko.BalinDev.RequiredValidator, label: 'Address'}, {foo:'bar'}, {_class:'DoesNotExists'}, {_class: Maslosoft.Ko.BalinDev.BogusValidator}]" style="width:50%;"></div>
	<div class="error-messages"></div>
	<div class="warning-messages"></div>
</div>
<script>
	jQuery(document).ready(function () {
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

		app.model.txt1 = new Maslosoft.Ko.BalinDev.Models.TextValue(data1);
		app.model.txt2 = new Maslosoft.Ko.BalinDev.Models.TextValue(data2);
		app.model.txt3 = new Maslosoft.Ko.BalinDev.Models.TextValue(data3);
		app.model.txt6 = new Maslosoft.Ko.BalinDev.Models.TextValue(data6);

		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
