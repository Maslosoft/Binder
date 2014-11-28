<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<title></title>
		<style>
			body{
				font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
				font-size: 14px;
				line-height: 20px;
				color: #333333;
			}
			pre
			{
				-moz-tab-size: 4;
				-o-tab-size:   4;
				tab-size:      4;
			}
			.ui-selected{
				background: darkorange;
			}
			nav ul, nav ul li{
				list-style: none;
				margin: 0px 2px;
				padding: 2px;
			}
			nav ul{
				background: url('./images/menuBg.jpg') no-repeat;
				background-size: cover;
			}
			nav ul li{
				display: inline-block;
				color: white;
			}
			nav ul li a, nav ul li a:hover{
				color: white;
			}
			b.warn {
				color: #cc0000;
			}
		</style>
		<link rel="stylesheet" href="../bower_components/highlightjs/styles/monokai_sublime.css" />
		<link rel="stylesheet" href="../bower_components/fancytree/dist/skin-win7/ui.fancytree.min.css" />
		<link rel="stylesheet" href="../bower_components/bootstrap/dist/css/bootstrap.css"/>
		
		
		
		<script src="../bower_components/jquery/dist/jquery.min.js"></script>
		<script src="../bower_components/jquery-ui/jquery-ui.min.js"></script>
		<script src="../bower_components/knockout/dist/knockout.debug.js"></script>
		<script src="./src/knockout-es5.js"></script>
		<script src="../bower_components/knockout-sortable/build/knockout-sortable.js"></script>
		<script src="../bower_components/moment/min/moment-with-locales.min.js"></script>
		<script src="../bower_components/highlightjs/highlight.pack.js"></script>
		<script src="../bower_components/fancytree/dist/jquery.fancytree-all.js"></script>
		<script src="../dist/ko.balin.js"></script>
		<script src="./src/Model.js"></script>
		
		<script>
			window.app = {};
			window.app.model = {};
			Maslosoft.Ko.Balin.registerDefaults();
		</script>
		<?php
		foreach (new DirectoryIterator(__DIR__) as $file)
		{
			if (strpos($file->getFilename(), '_') === 0)
			{
				continue;
			}
			if ($file->getFilename() === 'index.php')
			{
				continue;
			}
			if ($file->getExtension() != 'php')
			{
				continue;
			}
			if (strstr($file->getFilename(), '-'))
			{
				$combined[$file->getFilename()] = substr($file->getFilename(), 0, -4);
			}
			else
			{
				$simple[$file->getFilename()] = substr($file->getFilename(), 0, -4);
			}
		}
		?>
	</head>
	<body>
		<div class="container-fluid">
			<nav>
				<h1><?= basename($_SERVER['SCRIPT_FILENAME'], '.php') ?></h1>
				<ul>
					<li class="link">
						<a href="./index.php">Index</a>
					</li>
					<li class="link">
						|
					</li>
					<?php foreach ($simple as $file => $name): ?>
						<li class="link">
							<a href="./<?= $file; ?>"><?= ucfirst($name); ?></a>
						</li>
					<?php endforeach; ?>
					<li class="link">
						|
					</li>
					<?php foreach ($combined as $file => $name): ?>
						<li class="link">
							<a href="./<?= $file; ?>"><?= str_replace('-', ' - ', ucfirst($name)); ?></a>
						</li>
					<?php endforeach; ?>
				</ul>
			</nav>
			<hr />
			<?php
			ob_start()
			?>