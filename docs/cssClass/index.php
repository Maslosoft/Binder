<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>CSS Class</title>
<h1>CSS Class</h1>
<p>
	These are basically shortcuts to enable or disable common CSS classes if expression evaluates to true.
	Syntax is very simple, and allows more clean bindings definition.
	New bindings can be added by providing custom options.
</p>
<h3>Separate view logic from style name</h3>
<p>
	These has advantage over css binding, in that it defines how should be element
	styled, but it does not explicitly define concrete CSS class on binding. Classes
	can be changed by options. In this example <code>selected</code>
	class is substituted with <code>btn-danger</code>, by following code:<br />
	<pre class="javascript">ko.bindingHandlers.selected.options.className = "btn-danger"</pre>
	This needs to be done before applying bindings.
</p>
<h3>Adding new CSS Class binding handlers</h3>
<p>
	New binding handlers can be added easily, as show in this example with <code>custom</code>
	binding. This can be done using just one line, passing binding handler name as first
	parameter to <code>register</code> method, and apropriatelly cofigured instance of
	<code>Maslosoft.Ko.Balin.CssClass</code>. The syntax is as following:<br />
	<pre>Maslosoft.Ko.Balin.register('myBindingName', new Maslosoft.Ko.Balin.CssClass({className: 'css-class-name'}));</pre>
</p>
<h3>Using CSS Class bindings</h3>
<p>
	To use this binding on element, place apropriate data bind attribute:<br />
	<pre class="html">data-bind="selected: balin.model.selected.isSelected"</pre>
	When <code>balin.model.selected.isSelected</code> value evaluates to <code>true</code>,
	CSS Class configured for <code>selected</code> binding will be added, in this case
	knockout will add <code>btn-danger</code>
</p>
<h5>Using with punches</h5>
<p>
	There is also alternative syntax available, using knockout punches:
	<pre class="html"><?= escapeko('<span selected="{{balin.model.selected.isSelected}}">With punches</span>')?></pre>
	Notice that there are no data bind attribute, but attribute named same as binding name,
	with value wrapped with double curly braces.
</p>
<h2>Live example</h2>
<!-- /trim -->
<?php foreach (['selected', 'active', 'disabled', 'custom'] as $type): ?>
<!-- trim -->
<hr />
<!-- /trim -->
Should be <span data-bind="<?= $type; ?>: true" class="badge"><?= $type; ?></span> if `isSelected` evaluates to true <br />
<label class="btn pad-sides" 
	data-bind="<?= $type; ?>: balin.model.<?= $type; ?>.isSelected">
	<input type="checkbox" 
		data-bind="checked: balin.model.<?= $type; ?>.isSelected" />
	<?= $type . PHP_EOL; ?>
</label>
<span  class="btn pad-sides" 
	data-bind="<?= $type; ?>: balin.model.<?= $type; ?>.isSelected">
	Test Area (<span data-bind="text: balin.model.<?= $type; ?>.isSelected"></span>)
</span>
<span <?= $type;?>="{{balin.model.<?= $type; ?>.isSelected}}" class="btn">With punches</span>
<?php endforeach; ?>
<!-- trim -->
<hr />
<!-- /trim -->
<script>
	window.onload = (function () {
		// Define custom binding
		Maslosoft.Ko.Balin.register('custom', new Maslosoft.Ko.Balin.CssClass({className: 'custom'}));

		balin.model.selected = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: true});
		balin.model.active = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: false});
		balin.model.disabled = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: false});
		balin.model.custom = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: false});
		// Re-style selected binding
		ko.bindingHandlers.selected.options.className = "btn-danger";
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
