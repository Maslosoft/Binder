<?php

use Maslosoft\Ilmatar\Components\Helpers\CssFile;
use Maslosoft\Ilmatar\Components\Helpers\JsFile;

define('KO_BALIN_EMBEDDED', defined('YII_DEBUG'));
define('KO_BALIN_STANDALONE', !KO_BALIN_EMBEDDED);

function escapeko($html){
	$html = htmlspecialchars($html);
	$html = str_replace('{', '&lbrace;<!---->', $html);
	$html = str_replace('}', '&rbrace;<!---->', $html);
	return $html;
}

if (KO_BALIN_EMBEDDED):
	new JsFile(__DIR__ . "/src/Model.js");
	new JsFile(__DIR__ . "/src/RegExpValidator.js");
	new JsFile(__DIR__ . "/src/RequiredValidator.js");
	new JsFile(__DIR__ . "/src/BogusValidator.js");
	new JsFile(__DIR__ . "/src/EmailValidator.js");
	new JsFile(__DIR__ . "/src/TitleRenderer.js");
	new JsFile(__DIR__ . "/src/init.js");
	new CssFile(__DIR__ . "/src/init.css");
	echo "<div data-bind='eval:false'>
	<div id='ko-balin'>";
	ob_start();
	return;
endif;
?>
<?php
if(strpos($_SERVER['SCRIPT_NAME'], 'docs/index.php'))
{
	$baseURI = '.';
}
else
{
	$baseURI = '..';
}
$bower = "$baseURI/../bower_components";
$src = "$baseURI/src";
$dist = "$baseURI/../dist";
$images = "$baseURI/images";
$baseHref = "$baseURI/";
?>
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
			.pad-sides{
				padding-left:3px;
				padding-right:3px;
			}

			nav ul, nav ul li{
				list-style: none;
				margin: 0px 2px;
				padding: 2px;
			}
			nav > ul{
				background: url('<?= $images; ?>/menuBg.jpg') no-repeat;
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
			.warning{
				color: #8a6d3b !important;
			}
			.error{
				color:#a94442 !important;
			}
			.success{
				color:#3c763d !important;
			}
			.error-messages{
				color:#a94442 !important;
				font-size: .8em;
				font-weight: bold;
				font-style: italic;
				margin: .5em;
				padding: .3em;
				background: rgba(255, 0,0,.3);
			}
			.warning-messages{
				color:#8a6d3b !important;
				font-size: .8em;
				font-weight: bold;
				font-style: italic;
				margin: .5em;
				padding: .3em;
				background: rgba(255, 255,0,.3);
			}
			.node-title-icon{
				width: 1em;
				height: 1em;
				margin-top: -.3em;
				display: inline-block;
				vertical-align: middle;
				background-size: contain;
			}
		</style>
		<link rel="stylesheet" href="<?= $bower; ?>/highlightjs/styles/monokai_sublime.css" />
		<link rel="stylesheet" href="<?= $bower; ?>/fancytree/dist/skin-win7/ui.fancytree.min.css" />
		<link rel="stylesheet" href="<?= $bower; ?>/bootstrap/dist/css/bootstrap.css"/>
		<link rel="stylesheet" href="<?= $bower; ?>/maslosoft-playlist/dist/playlist.css"/>
		<link rel="stylesheet" href="<?= $bower; ?>/pickadate/lib/themes/classic.css"/>
		<link rel="stylesheet" href="<?= $bower; ?>/pickadate/lib/themes/classic.date.css"/>
		<link rel="stylesheet" href="<?= $bower; ?>/pickadate/lib/themes/classic.time.css"/>
		<link rel="stylesheet" href="<?= $bower; ?>/bootstrap-datepicker/dist/css/bootstrap-datepicker3.css"/>
		<link rel="stylesheet" href="<?= $src; ?>/init.css"/>
		<?php if (isset($mocha)): ?>
			<link rel="stylesheet" href="<?= $bower; ?>/mocha/mocha.css"/>
			<style>
				#mocha{
					margin: 0;
				}
				#mocha-stats{
					position: static;
				}
				#mocha-stats .progress {
					height:40px;
				}
			</style>
		<?php endif; ?>
		<!--jQuery-->
		<script type="text/javascript" src="<?= $bower; ?>/jquery/dist/jquery.min.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/jquery-ui/jquery-ui.min.js"></script>

		<!--ko-->
		<script type="text/javascript" src="<?= $bower; ?>/knockout/dist/knockout.debug.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/knockout-sortable/build/knockout-sortable.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/knockout-es5/dist/knockout-es5.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/knockout.punches/knockout.punches.min.js"></script>
		<script type="text/javascript" src="<?= $dist; ?>/ko.balin.js"></script>

		<!--other libs-->
		<script type="text/javascript" src="<?= $bower; ?>/datejs_original/date.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/pickadate/lib/compressed/picker.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/pickadate/lib/compressed/picker.date.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/pickadate/lib/compressed/picker.time.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/bootstrap-datepicker/dist/js/bootstrap-datepicker.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/moment/min/moment-with-locales.min.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/highlightjs/highlight.pack.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/fancytree/dist/jquery.fancytree-all.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/bootstrap/dist/js/bootstrap.js"></script>
		<script type="text/javascript" src="<?= $bower; ?>/maslosoft-playlist/dist/playlist.js"></script>
		<script type="text/javascript" src="<?= $src; ?>/Model.js"></script>
		<script type="text/javascript" src="<?= $src; ?>/RegExpValidator.js"></script>
		<script type="text/javascript" src="<?= $src; ?>/RequiredValidator.js"></script>
		<script type="text/javascript" src="<?= $src; ?>/BogusValidator.js"></script>
		<script type="text/javascript" src="<?= $src; ?>/EmailValidator.js"></script>
		<script type="text/javascript" src="<?= $src; ?>/TitleRenderer.js"></script>
		<script type="text/javascript" src="<?= $src; ?>/init.js"></script>

		<?php if (isset($mocha)): ?>
			<script type="text/javascript" src="<?= $bower; ?>/mocha/mocha.js"></script>
			<script type="text/javascript" src="<?= $bower; ?>/chai/chai.js"></script>
		<?php endif; ?>


		<?php
		// Include autoload
		$alPath = realpath(__DIR__ . '/../vendor/autoload.php');
		if (file_exists($alPath))
		{
			require_once $alPath;
		}


		$simple = [];
		$combined = [];
		$test = [];
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
			if($file->isDot())
			{
				continue;
			}
			if (!$file->isDir())
			{
				continue;
			}
			if (preg_match('~Test\.php~', $file->getFilename()))
			{
				continue;
			}
			if (strstr($file->getFilename(), '-'))
			{
				$combined[$file->getFilename() . '/'] = $file->getFilename();
			}
			else
			{
				$simple[$file->getFilename() . '/'] = $file->getFilename();
			}
		}
		foreach (new DirectoryIterator(__DIR__ . '/../test') as $file)
		{
			if (preg_match('~Test\.js~', $file->getFilename()))
			{
				$test[$file->getFilename()] = basename($file->getFilename(), '.js');
			}
		}
		ksort($simple);
		ksort($combined);
		ksort($test);
		?>
	</head>
	<body>
		<div class="container-fluid">
			<nav>
				<?php if (isset($_GET['test'])): ?>
					<h1><?= ucfirst(htmlspecialchars($_GET['test'])); ?></h1>
				<?php else: ?>
					<h1><?= ucfirst(basename($_SERVER['SCRIPT_FILENAME'], '.php')); ?></h1>
				<?php endif; ?>
				<ul>
					<li class="link">
						<a href="<?= $baseHref ; ?>">Index</a>
					</li>
					<li class="link">
						|
					</li>
					<?php foreach ($simple as $file => $name): ?>
						<li class="link">
							<a href="<?= $baseHref . $file; ?>"><?= ucfirst($name); ?></a>
						</li>
					<?php endforeach; ?>
					<li class="link">
						|
					</li>
					<?php foreach ((array) $combined as $file => $name): ?>
						<li class="link">
							<a href="./<?= $file; ?>"><?= str_replace('-', ' - ', ucfirst($name)); ?></a>
						</li>
					<?php endforeach; ?>
					<li class="link">
						|
					</li>
					<li class="link">
						Tests:
					</li>
					<?php foreach ($test as $file => $name): ?>
						<li class="link">
							<a href="./runTest.php?test=<?= $name; ?>"><?= str_replace('-', ' - ', ucfirst($name)); ?></a>
						</li>
					<?php endforeach; ?>
				</ul>
			</nav>
			<hr />

			<div id='ko-balin'>
				<?php
				ob_start()
				?>
