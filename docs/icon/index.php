<?php

use Maslosoft\Widgets\Form\ActiveForm;
use Maslosoft\Components\Controller;
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
    This binding does not have configuration parameters, is will behave depending on context. However
    setting extra binding value of <code>cachebusting</code> with value <code>true</code>
    will add timestamp to logo to ensure that always fresh copy is loaded. This is useful
    for dynamic images. If layout reflow during downloading of images is issue, the <code>preloader</code>
    binding can be set to some already loaded image.
</p>
<div>
    <div class="well">
        <p>Image with timestamp example and scaling parameters with cachebusting enabled:</p>
        <ul>
            <li><code>isImages</code> is set to <code>true</code></li>
            <li><code>iconSize</code> is set to <code>64</code></li>
            <li><code>updateDate</code> is set to <code>123</code>.
                This parameter is used to keep images fresh, ie. to get new one on model update.</li>
        </ul>
    <!-- /trim -->
	<img data-bind="icon: binder.model.Image, cachebusting: true" />
    <!-- trim -->

        <p>
            Binding parameters:
        </p>
        <div class="form-group">
            <label>
                Icon value
            </label>
            <select data-bind="options: ['images/maslosoft.png', 'images/binder-128.png', 'images/ilmatar-widgets-128.png'], value: binder.model.Image.icon" class="form-control">
            </select>
        </div>
        <div class="form-group">
            <label>
                Is image

        <input data-bind="checked: binder.model.Image.isImage" type="checkbox" class="form-control"/>
            </label>
        </div>
        <div class="form-group">
            <label>
                Icon size
            </label>
            <select data-bind="options: [64, 128], value: binder.model.Image.iconSize" class="form-control">
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
	Size: <input data-bind="textInput: binder.model.Icon.iconSize" /><br />
    </p>
    <!-- /trim -->
	<img data-bind="icon: binder.model.Icon" />
    <!-- trim -->
    </div>

    <div class="well">
	<p>
    <abbr title="Scalable Vecror Graphics">SVG</abbr> example. Should not add scaling params because it is SVG:<br/>
    </p>
    <!-- /trim -->
	<img data-bind="icon: binder.model.svg" />
    <!-- trim -->
    </div>

    <div class="well">
        <p>Example with <code>filename</code> value and scaling params:</p>
    <!-- /trim -->
    <img data-bind="icon: binder.model.withFilename" />
    <!-- trim -->
    </div>
</div>
<!-- /trim -->
<script>
	window.onload = (function(){
		binder.model.Image = new Maslosoft.Koe.Icon({
			icon: 'images/maslosoft.png',
			isImage: true,
			iconSize: 64,
			updateDate: 123
		});
		binder.model.Icon = new Maslosoft.Koe.Icon({
			icon: 'images/maslosoft.png',
			isImage: false,
			iconSize: 64
		});
		binder.model.svg = new Maslosoft.Koe.Icon({
			icon: 'images/binder.svg',
			isImage: true,
			iconSize: 64
		});
        binder.model.withFilename = new Maslosoft.Koe.Icon({
            icon: 'images/subdir/',
            filename: 'msft.png',
            isImage: true,
            iconSize: 64
        });
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
