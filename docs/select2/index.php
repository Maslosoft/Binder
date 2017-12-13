<?php use Maslosoft\Zamm\Widgets\DocNavRecursive;

require __DIR__ . '/../_header.php'; ?>
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