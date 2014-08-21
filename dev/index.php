<?php require './_header.php'; ?>
<?php foreach (new DirectoryIterator(__DIR__) as $file): ?>
	<?php if (strpos($file->getFilename(), '_') === 0) continue; ?>
	<?php if ($file->getExtension() != 'php') continue; ?>
	<span class="link">
		<a href="./<?= $file->getFilename(); ?>"><?= substr($file->getFilename(), 0, -4); ?></a>
	</span>
<?php endforeach; ?>
<?php require './_footer.php'; ?>
