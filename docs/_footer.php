<?php
$text = ob_get_flush();

// Remove trims
$text = preg_replace("/<!--\s*trim\s*-->.+?<!--\s*\/trim\s*-->\n{0,1}/s", '', $text);
$text = trim($text);

// Remove JS trims
$text = preg_replace("/\/\/\s*trim\s*.+?\/\/\s*\/trim/s", '', $text);
$text = trim($text);

// Escape HTML so it will be displayed
$text = htmlspecialchars($text);

// Avoid parsing punches
$text = str_replace('{', '{<!---->', $text);
$text = str_replace('}', '<!---->}', $text);

?>
<?php if(empty($mocha)):?>
<h4><a href="#" onclick="jQuery('#relevant-code-block').slideToggle();return false;">Relevant code used in examples:</a></h4>
<pre class="html" id="relevant-code-block"><?= $text ?></pre>
<?php endif;?>
<?php if (KO_BALIN_EMBEDDED): ?>
	</div>
	</div>
<?php endif; ?>
<?php if (KO_BALIN_STANDALONE): ?>
	</div>
	<script type="text/javascript" >
		jQuery(document).ready(function () {
		    if(jQuery('pre').length) {
                hljs.configure({languages: ['html']});
                hljs.highlightBlock(document.getElementsByTagName('pre')[0]);
            }
			jQuery('body').tooltip({
				selector: '[rel~="tooltip"]'
			});
		});

	</script>
	</body>
	</html>
<?php endif; ?>
