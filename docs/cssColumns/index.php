<?php require __DIR__ . '/../_header.php'; ?>
<?php
function makeButtonsForSizesFor($size, $binding, $columns = [1,2,3,4,5,6,7,8,9,10,11,12])
{
    $html = [];
    $html[] = "<div class='btn-group'>";
    foreach($columns as $i)
	{
		$html[] = <<<HTML
            <div 
            class="btn btn-default"
            data-bind="css: {'btn-success': balin.model.layout.$binding.$size == $i}" 
            onclick="balin.model.layout.$binding.$size = $i">
                $i
            </div>
HTML;
	}
	$html[] = "</div>";
	return implode("\n", $html);
}
?>
<!-- trim -->
<title>CSS Columns</title>
<h1>CSS Columns</h1>
<p>
	This binding handler will apply bootstrap CSS columns based on value. There are
    two variants of this binding:
</p>
<ul>
    <li><code>cssColumnSizes</code> - will apply column sizes as passed to observable model</li>
    <li><code>cssColumns</code> - will apply classes to create grid with number of columns as passed to observable model</li>
</ul>
<p>
    Value passed to bindings must be object with properties named same as sizes
    and size width as values.
</p>
<h2>Configuring</h2>
<p>
    Both binding can be configured by specifying sizes to CSS classes template. The configuration
    properties are:
</p>
<ul>
    <li><code>Maslosoft.Ko.Balin.CssColumnSizes.columns</code> for <code>cssColumnSizes</code> binding</li>
    <li><code>Maslosoft.Ko.Balin.CssColumns.columns</code> for <code>cssColumns</code> binding</li>
</ul>
<p>
    Class names contain placeholder <code>{num}</code> which will be replaces by observable value.
    Property <code>columns</code> must be object with property names corresponding to size names
    same as in passed observable. Values must be class names containing <code>{num}</code>
    placeholder.
</p>
<h3>Example configuration</h3>
<pre class="javascript">
Maslosoft.Ko.Balin.CssColumnSizes.columns = {
    'xs': 'col-xs-{num}',
    'sm': 'col-sm-{num}',
    'md': 'col-md-{num}',
    'lg': 'col-lg-{num}'
}
</pre>
<h2>Live Example</h2>
<p>
    Current device size:
    <span style="display: inline-block">
    <b class="visible-lg">Large</b>
    <b class="visible-md">Medium</b>
    <b class="visible-sm">Small</b>
    <b class="visible-xs">Very small</b>
    </span>
</p>
<h3><code>cssColumnSizes</code> binding</h3>
<p>
    In example of <code>cssColumnSizes</code> binding column sizes are dynamically adjusted depending on observable value.
</p>
<div class="container-fluid">
    <div class="row">
        <div class="form-group col-md-3">
            <label>Sizes on large devices</label><br/>
            <?= makeButtonsForSizesFor('lg', 'sizes'); ?>
        </div>
        <div class="form-group col-md-3">
            <label>Sizes on medium devices</label><br/>
			<?= makeButtonsForSizesFor('md', 'sizes'); ?>
        </div>
        <div class="form-group col-md-3">
            <label>Sizes on small devices</label><br/>
			<?= makeButtonsForSizesFor('sm', 'sizes'); ?>
        </div>
        <div class="form-group col-md-3">
            <label>Sizes on very small devices</label><br/>
			<?= makeButtonsForSizesFor('xs', 'sizes'); ?>
        </div>

    </div>
</div>
<div class="container-fluid">
<!-- /trim -->
<div class="row" data-bind="with: balin.model.layout">
    <div data-bind="cssColumnSizes: sizes" class="btn-success">
        First column
    </div>
    <div data-bind="cssColumnSizes: sizes" class="btn-success">
        Second column
    </div>
    <div data-bind="cssColumnSizes: sizes" class="btn-success">
        Third column
    </div>
</div>
<!-- trim -->
</div>


<h3><code>cssColumns</code> binding</h3>

<p>
    In example of <code>cssColumns</code> number of columns depends on observable value.
</p>

<div class="container-fluid">
    <div class="row">
        <div class="form-group col-md-3">
            <label>Columns on large devices</label><br/>
			<?= makeButtonsForSizesFor('lg', 'columns', [1,2,3,4,6,12]); ?>
        </div>
        <div class="form-group col-md-3">
            <label>Columns on medium devices</label><br/>
			<?= makeButtonsForSizesFor('md', 'columns', [1,2,3,4,6,12]); ?>
        </div>
        <div class="form-group col-md-3">
            <label>Columns on small devices</label><br/>
			<?= makeButtonsForSizesFor('sm', 'columns', [1,2,3,4,6,12]); ?>
        </div>
        <div class="form-group col-md-3">
            <label>Columns on very small devices</label><br/>
			<?= makeButtonsForSizesFor('xs', 'columns', [1,2,3,4,6,12]); ?>
        </div>

    </div>
</div>
<!-- /trim -->
<!-- trim -->
<div class="container-fluid">
<!-- /trim -->
<div class="row" data-bind="with: balin.model.layout">
    <div data-bind="cssColumns: columns" class="btn-success">
        First column
    </div>
    <div data-bind="cssColumns: columns" class="btn-success">
        Second column
    </div>
    <div data-bind="cssColumns: columns" class="btn-success">
        Third column
    </div>
</div>
<!-- trim -->
</div>
<!-- /trim -->
<script>
	window.onload = (function(){
		balin.model.layout = new Maslosoft.Koe.Columns({
            sizes: new Maslosoft.Koe.UiColumns,
            columns: new Maslosoft.Koe.UiColumns({
                lg: 3,
                md: 3,
                sm: 3,
                xs: 3
            })
		});
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
