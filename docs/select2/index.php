<?php
use Maslosoft\Zamm\Widgets\DocNavRecursive;
use Maslosoft\Ilmatar\Widgets\JavaScript\Packages\Select2Package;

require __DIR__ . '/../_header.php'; ?>
<?php if(KO_BALIN_EMBEDDED):?>
	<?php
	new Select2Package;
	?>
<?php endif; ?>
<!-- trim -->
<title>Select2</title>
<h1>Select2</h1>

<p>
    Currently there are following select2 flavors:
</p>

<?php if(KO_BALIN_EMBEDDED):?>
<?= new DocNavRecursive(); ?>
<?php endif;?>

<?php require __DIR__ . '/../_footer.php'; ?>