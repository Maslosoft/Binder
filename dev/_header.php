<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
		<script src="../bower_components/jquery/dist/jquery.min.js"></script>
		<script src="../bower_components/jquery-ui/jquery-ui.min.js"></script>
		<script src="../bower_components/knockout/dist/knockout.debug.js"></script>
		<script src="./src/knockout-es5.js"></script>
		<script src="../bower_components/knockout-sortable/build/knockout-sortable.js"></script>
		<script src="../bower_components/moment/min/moment-with-locales.min.js"></script>
		<script src="../bower_components/highlightjs/highlight.pack.js"></script>
		<script src="./src/_ns.js"></script>
		<script src="../dist/ko.balin.js"></script>
		<script src="./src/Model.js"></script>
		<script src="./src/init.js"></script>

		<link rel="stylesheet" href="../bower_components/highlightjs/styles/monokai_sublime.css">
		<style>
			pre
			{
				-moz-tab-size: 4;
				-o-tab-size:   4;
				tab-size:      4;
			}
			.ui-selected{
				background: darkorange;
			}
		</style>
		<script>
			Maslosoft.Ko.Balin.registerDefaults();
		</script>
	</head>
	<body>
		<div>
			<h1><?= basename($_SERVER['SCRIPT_FILENAME'], '.php') ?></h1>
			<?php foreach (new DirectoryIterator(__DIR__) as $file): ?>
				<?php if (strpos($file->getFilename(), '_') === 0) continue; ?>
				<?php if ($file->getExtension() != 'php') continue; ?>
				<span class="link">
					<a href="./<?= $file->getFilename(); ?>"><?= substr($file->getFilename(), 0, -4); ?></a>
				</span>
			<?php endforeach; ?>
		</div>
		<hr />
		<?php
		ob_start()
		?>