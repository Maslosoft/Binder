<?php $mocha = true; ?>
<?php require __DIR__ . '/_header.php'; ?>
<title>Tests</title>
<h1>Tests</h1>
<div id="mocha"></div>
<?php
foreach (new DirectoryIterator(__DIR__ . '/../test') as $file)
{
	if (preg_match('~Test\.js~', $file->getFilename()))
	{
		$test[basename($file->getFilename(), '.js')] = basename($file->getFilename(), '.js');
	}
}
?>
<?php $script = basename($_SERVER['PHP_SELF'], '.php'); ?>
<script>
	chai.should()
	var expect = chai.expect;
	var assert = chai.assert;
	mocha.setup('bdd')
</script>
<?php if (isset($_GET['test'])): ?>
	<?php @include sprintf('../test/%s.php', htmlspecialchars(basename($_GET['test']))); ?>
	<script src="../test/<?= htmlspecialchars($_GET['test']) ?>.js"></script>
<?php else: ?>
	<?php foreach ($test as $script => $name): ?>
			<!-- <script src="../test/<?= $script ?>.js"></script> -->
	<?php endforeach; ?>
<?php endif; ?>
<script>
	window.onload = (function () {
		mocha.checkLeaks();
		mocha.globals(['jQuery']);
		mocha.run();
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>