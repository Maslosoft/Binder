<?php
$text = ob_get_flush();
?>
<h4>Relevant code used to create above result:</h4>
<pre><?= htmlspecialchars($text)?></pre>
</div>
<script>
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
//		var body = jQuery(jQuery('body').html());
//		var text = body.find('script:last').remove().find('div:first').remove();
//		body.append('<pre><code>' + escapeHtml(text).replace(/\t/g, '  ') + '</code></pre>');
		hljs.configure({languages:['html']});
		hljs.highlightBlock(document.getElementsByTagName('pre')[0]);
	});

</script>
</body>
</html>
