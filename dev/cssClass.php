<?php require './_header.php'; ?>
<p>
	These are basically shortcuts to enable or disable common CSS classes if expression evaluates to true.
	Syntax is very simple, and allows more clean bindings definition.
	New bindings can be added by providing custom options.
</p>
<?php foreach (['selected', 'active', 'disabled', 'custom'] as $type): ?>
	<p>
		Div below should be <span class="<?= $type; ?>"><?= $type; ?></span> if `isSelected` evaluates to true <br />
		<label class="pad-sides" data-bind="<?= $type; ?>: app.model.<?= $type; ?>.isSelected">
			<input type="checkbox" data-bind="checked: app.model.<?= $type; ?>.isSelected" />
			<?= $type; ?>
		</label>
	<div  class="pad-sides" data-bind="<?= $type; ?>: app.model.<?= $type; ?>.isSelected">
		Test Area (<span data-bind="text: app.model.<?= $type; ?>.isSelected"></span>)
	</div>
	</p>
<?php endforeach; ?>

<script>
	jQuery(document).ready(function () {
		// Define custom binding
		Maslosoft.Ko.Balin.register('custom', new Maslosoft.Ko.Balin.CssClass({className: 'custom'}));

		app.model.selected = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: true});
		app.model.active = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: false});
		app.model.disabled = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: false});
		app.model.custom = new Maslosoft.Ko.BalinDev.Models.Selected({isSelected: false});
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
