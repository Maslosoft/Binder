<?php
$text = htmlspecialchars(ob_get_flush());
// Avoid parsing punches
$text = str_replace('{', '{<!---->', $text);
$text = str_replace('}', '<!---->}', $text);
?>
<h4><a href="#" onclick="javascript:jQuery('pre').slideToggle();">Relevant code used to create above result:</a></h4>
<pre><?= $text ?></pre>
<?php if (KO_BALIN_EMBEDDED): ?>
	</div>
	</div>
<?php endif; ?>
<?php if (KO_BALIN_STANDALONE): ?>
	</div>
	<script type="text/javascript" >
		jQuery(document).ready(function () {
			hljs.configure({languages: ['html']});
			hljs.highlightBlock(document.getElementsByTagName('pre')[0]);

			jQuery('body').tooltip({
				selector: '[rel~="tooltip"]'
			});
		});

	</script>
	</body>
	</html>
<?php endif; ?>
