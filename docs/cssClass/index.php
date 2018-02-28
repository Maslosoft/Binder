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
	class is substituted with <code>btn-danger</code>, by following code:
</p>
<pre class="javascript">ko.bindingHandlers.selected.options.className = "btn-danger"</pre>
<p>
    This needs to be done before applying bindings.
</p>
<h3>Adding new CSS Class binding handlers</h3>
<p>
	New binding handlers can be added easily, as show in this example with <code>custom</code>
	binding. This can be done using just one line, passing binding handler name as first
	parameter to <code>register</code> method, and apropriatelly cofigured instance of
	<code>Maslosoft.Binder.CssClass</code>. The syntax is as following:<br />
</p>
<pre class="javascript">Maslosoft.Binder.register(
            'myBindingName',
            new Maslosoft.Binder.CssClass({
            className: 'css-class-name'
        }));</pre>
<h3>Using CSS Class bindings</h3>
<p>
	To use this binding on element, place apropriate data bind attribute:<br />
</p>
<pre class="javascript">data-bind="selected: binder.model.selected.isSelected"</pre>
<p>
	When <code>binder.model.selected.isSelected</code> value evaluates to <code>true</code>,
	CSS Class configured for <code>selected</code> binding will be added, in this case
	knockout will add <code>btn-danger</code>
</p>
<h5>Using with punches</h5>
<p>
	There is also alternative syntax available, using knockout punches:
</p>
<pre class="html"><?= escapeko('<span selected="{{binder.model.selected.isSelected}}">With punches</span>')?></pre>
<p>
	Notice that there are no data bind attribute, but attribute named same as binding name,
	with value wrapped with double curly braces.
</p>
<h2>Live example</h2>
<!-- /trim -->
<?php foreach (['selected', 'active', 'disabled', 'custom'] as $type): ?>
<!-- trim -->
<p>
    Should be <span style="width: 6em;display: inline-block;text-align: center;" data-bind="<?= $type; ?>: true"><?= $type; ?></span> if <code>isSelected</code> evaluates to true.
</p>
<label class="btn"
	data-bind="<?= $type; ?>: binder.model.<?= $type; ?>.isSelected">

	<input type="checkbox" 
		data-bind="checked: binder.model.<?= $type; ?>.isSelected" />
	<?= $type . PHP_EOL; ?>
</label>
<!-- /trim -->
<span data-bind="<?= $type; ?>: binder.model.<?= $type; ?>.isSelected" class="btn">
	Test Area
</span>
<span <?= $type;?>="{{binder.model.<?= $type; ?>.isSelected}}" class="btn">With punches</span>
<!-- trim -->
<p></p>
<!-- /trim -->
<?php endforeach; ?>
<!-- trim -->
<p></p>
<!-- /trim -->
<script>
	window.onload = (function () {
		// Define custom binding
		Maslosoft.Binder.register(
		    'custom',
            new Maslosoft.Binder.CssClass({
                className: 'custom'
            }));

		binder.model.selected = new Maslosoft.Koe.Selected({isSelected: true});
		binder.model.active = new Maslosoft.Koe.Selected({isSelected: false});
		binder.model.disabled = new Maslosoft.Koe.Selected({isSelected: false});
		binder.model.custom = new Maslosoft.Koe.Selected({isSelected: false});
		// Re-style selected binding
		ko.bindingHandlers.selected.options.className = "btn-danger";
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
