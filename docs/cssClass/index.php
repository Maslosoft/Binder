<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>CSS Class</title>
<h1>CSS Class</h1>
<p>
	These are basically shortcuts to enable or disable common CSS classes if expression evaluates to true.
	Syntax is very simple, and allows more clean bindings definition.
	New bindings can be added by providing custom options.
</p>
<p>
	These has advantage over css binding, in that it defines how should be element
	styled, but it does not explicitly define CSS on binding. Classes
	can be changed by options. In this example <code>selected</code>
	class is substituted with <code>btn-danger</code>, by following code:<br />
	<code>ko.bindingHandlers.selected.options.className = "btn-danger"</code>
</p>
<!-- /trim -->
<?php foreach (['selected', 'active', 'disabled', 'custom'] as $type): ?>
<hr />
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
<?php endforeach; ?>
<hr />
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
