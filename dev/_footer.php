<?php
$text = htmlspecialchars(ob_get_flush());
// Avoid parsing punches
$text = str_replace('{', '{<!---->', $text);
$text = str_replace('}', '<!---->}', $text);
?>
<h4><a href="#" onclick="javascript:jQuery('pre').slideToggle();">Relevant code used to create above result:</a></h4>
<pre><?= $text?></pre>
</div>
<script type="text/javascript" >
	jQuery(document).ready(function() {
		var entityMap = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': '&quot;',
			"'": '&#39;',
			"/": '&#x2F;'
		};

		function escapeHtml(string) {
			return String(string).replace(/[&<>"'\/]/g, function(s) {
				return entityMap[s];
			});
		}
		hljs.configure({languages:['html']});
		hljs.highlightBlock(document.getElementsByTagName('pre')[0]);
	});

</script>
</body>
</html>
