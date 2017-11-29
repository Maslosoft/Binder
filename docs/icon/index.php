<?php

use Maslosoft\Ilmatar\Widgets\Form\ActiveForm;
use Maslosoft\Ilmatar\Components\Controller;
?>
<?php

/* @var $this Controller */
/* @var $form ActiveForm */
?>

<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Icon</title>
<h1>Icon</h1>
<p>
	Icon binding handler is meant to display icon, depending on it's size.
	This is specifically usefull with <a href="/ilmatar-widgets/">Ilmatar Widgets</a> project
	to display optimally sized and up-to-date icons and image thumbnails.
</p>
<p class="alert alert-warning">
    Scaling parameters are simulated here by created directory structures.
</p>
<p>
    This binding does not have configuration parameters, is will behave depending on context.
</p>
<div>
    <div class="well">
    <p>Image with timestamp example and scaling parameters:</p>
    <p>
        <ul>
        <li><code>isImages</code> is set to <code>true</code></li>
        <li><code>iconSize</code> is set to <code>64</code></li>
        <li><code>updateDate</code> is set to <code>123</code>.
            This parameter is used to keep images fresh, ie. to get new one on model update.</li>
    </ul>
    </p>
    <!-- /trim -->
	<img data-bind="icon: balin.model.Image" />
    <!-- trim -->

        <p>
            Binding parameters:
        </p>
        <div class="form-group">
            <label>
                Icon value
            </label>
            <select data-bind="options: ['images/maslosoft.png', 'images/balin-128.png', 'images/ilmatar-widgets-128.png'], value: balin.model.Image.icon" class="form-control">
            </select>
        </div>
        <div class="form-group">
            <label>
                Is image

        <input data-bind="checked: balin.model.Image.isImage" type="checkbox" class="form-control"/>
            </label>
        </div>
        <div class="form-group">
            <label>
                Icon size
            </label>
            <select data-bind="options: [64, 128], value: balin.model.Image.iconSize" class="form-control">
                <option>64</option>
                <option>128</option>
            </select>
        </div>

    </div>

    <div class="well">
    <p>
    Static icon example with scaling. The <code>isImage</code> is set to <code>false</code>:
    </p>
    <p>
	Size: <input data-bind="textInput: balin.model.Icon.iconSize" /><br />
    </p>
    <!-- /trim -->
	<img data-bind="icon: balin.model.Icon" />
    <!-- trim -->
    </div>

    <div class="well">
	<p>
    <abbr title="Scalable Vecror Graphics">SVG</abbr> example. Should not add scaling params because it is SVG:<br/>
    </p>
    <!-- /trim -->
	<img data-bind="icon: balin.model.svg" />
    <!-- trim -->
    </div>

    <div class="well">
        <p>Example with <code>filename</code> value and scaling params:</p>
    <!-- /trim -->
    <img data-bind="icon: balin.model.withFilename" />
    <!-- trim -->
    </div>
</div>
<!-- /trim -->
<script>
	window.onload = (function(){
		balin.model.Image = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/maslosoft.png',
			isImage: true,
			iconSize: 64,
			updateDate: 123
		});
		balin.model.Icon = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/maslosoft.png',
			isImage: false,
			iconSize: 64
		});
		balin.model.svg = new Maslosoft.Ko.BalinDev.Models.Icon({
			icon: 'images/balin.svg',
			isImage: true,
			iconSize: 64
		});
        balin.model.withFilename = new Maslosoft.Ko.BalinDev.Models.Icon({
            icon: 'images/subdir/',
            filename: 'msft.png',
            isImage: true,
            iconSize: 64
        });
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
