<?php

use Maslosoft\Ilmatar\Components\Helpers\CssFile;
use Maslosoft\Ilmatar\Components\Helpers\JsFile;
use Maslosoft\Ilmatar\Components\Helpers\JsInline;
?>
<?php $mocha = true; ?>
<?php require __DIR__ . '/../_header.php'; ?>
<style>
	#mocha{
		margin: 0 0 10px;;
		font-size: 1em;
	}
	#mocha pre{
		background: transparent;
	}
	#mocha h1{
		font-size: 1.2em;
		margin-bottom: .6em;
	}
	#mocha .test h2{
		font-size: 1em;
	}
	#mocha .test.pass::before{
		content: "\f00c";		
    	font: normal normal normal 14px/1 FontAwesome;
		font-size: 1em;
		color: #3e8f3e;
	}
	#mocha-stats{
		left:0;
		top:0;
		font-size: 1em;
		position: static;
	}
	#mocha-stats .progress {
		float:left;
		height:40px;
	}
</style>
<title>10. Tests</title>
<h1>Tests</h1>
<p>
	This tests will allow You to check if Your browser supports all features. Click
	any button to run in-browser tests. Each test will start after slight delay after page load.
</p>
<?php
$test = [];
foreach (new DirectoryIterator(__DIR__ . '/../../test') as $file)
{
	if (preg_match('~Test\.coffee~', $file->getFilename()))
	{
		$name = basename($file->getFilename(), '.coffee');
		$test[$name] = $name;
	}
}
?>
<?php $script = basename($_SERVER['PHP_SELF'], '.php');
$initMocha = <<<JS
	chai.should()
	window.expect = chai.expect;
	window.assert = chai.assert;
	mocha.setup('bdd')
JS;
?>
<?php if(KO_BALIN_EMBEDDED):?>
	<?php new JsInline($initMocha);?>
<?php else:?>
<script>
	<?= $initMocha?>
</script>
<?php endif;?>


<!-- Tests menu -->
<p>
<?php foreach ($test as $script => $name): ?>
	<a href="?test=<?= $script?>" class="btn btn-success">
		<i class="fa fa-arrow-circle-o-right"></i>
		<?= ucfirst(preg_replace('~([A-Z])~', ' \1', str_replace('Test', '', $name)));?>
	</a>
<?php endforeach; ?>
</p>

<!-- Run one test -->
<?php if (isset($_GET['test'])): ?>
	<?php $testId = htmlspecialchars(basename($_GET['test']));?>
	<p id="mocha"></p>
	<h6>Tests Output:</h6>
	<div class="well">
	<?php require sprintf(__DIR__ . '/../../test/%s.php', $testId); ?>
	</div>
	<?php if(KO_BALIN_EMBEDDED):?>
		<?php new JsFile(__DIR__ . '/../../test/' . $testId . '.js')?>
	<?php else:?>
		<script src="../../test/<?= $testId ?>.js"></script>
	<?php endif;?>
	<script>
		window.onload = (function () {
			setTimeout(function(){
				mocha.checkLeaks();
				mocha.globals(['jQuery']);
				mocha.run();
			}, 1500);
		});
	</script>
<?php endif; ?>
<?php require __DIR__ . '/../_footer.php'; ?>