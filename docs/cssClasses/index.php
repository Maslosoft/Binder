<?php require __DIR__ . '/../_header.php'; ?>
<?php
$classes = [
	'btn-default',
	'btn-success',
	'big-border',
	'shadowed',
	'outlined'
];
?>
<!-- trim -->
<style type="text/css">
    .big-border {
        border: 4px dashed red;
    }

    .shadowed {
        box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.7);
    }

    .outlined {
        outline: blue;
        outline-width: 4px;
        outline-offset: 0px;
        outline-style: solid;
    }
</style>
<title>CSS Classes</title>
<h1>CSS Classes</h1>
<p>
    The CSS classes binding allows You to apply array of classes to element.
    When class is removed from observable array, it will be removed
    from item too. Except array, class list can be provided as
    space separated class names list, just like on <code>class</code>
    attribute.
</p>
<p class="alert alert-success">
    This binding will not change existing classes or
    those added by other bindings. Will change existing classes only
    if provided on classes list observable value.
</p>
<p class="alert alert-warning">
    To keep track which class to remove, this binding will store added
    classes list in <code>data-css-classes</code> working element attribute.
</p>
<h2>Live Example</h2>
<table class="table">
    <thead>
    <tr>
        <th>Example</th>
        <th>Class Name</th>
        <th>Enabled</th>
        <th>Actions</th>
    </tr>
    </thead>
    <tbody>
	<?php foreach ($classes as $class): ?>
        <tr>
            <td>
                <div class="btn <?= $class; ?>">Element</div>
            </td>
            <td>
                <code><?= $class; ?></code>
            </td>
            <td>
                <!-- ko if: binder.model.decorate.classes.indexOf('<?= $class ?>') > -1 -->
                <div class="btn btn-success">
                    <i class="fa fa-fw fa-check"></i>
                </div>
                <!-- /ko -->
                <!-- ko if: binder.model.decorate.classes.indexOf('<?= $class ?>') == -1 -->
                <div class="btn btn-danger">
                    <i class="fa fa-fw fa-ban"></i>
                </div>
                <!-- /ko -->
            </td>
            <td>
                <div class="btn-group">
                    <a href="#" onclick="return addClass('<?= $class ?>')" class="btn btn-success">
                        <i class="fa fa-fw fa-plus"></i>Add
                    </a>
                    <a href="#" onclick="return removeClass('<?= $class ?>')" class="btn btn-danger">
                        <i class="fa fa-fw fa-minus"></i>Remove
                    </a>
                    <a href="#" onclick="return toggleClass('<?= $class ?>')" class="btn btn-info">
                        <i class="fa fa-fw fa-toggle-off"></i>Toggle
                    </a>
                </div>
            </td>
        </tr>
	<?php endforeach; ?>
    </tbody>
</table>

<p>
    Element below contains <code>btn</code> and <code>btn-success</code> CSS classes.
    The <code>btn</code> class will be always present, however <code>btn-success</code>
    might be disabled, because it is <a href="#" onclick="return toggleClass('btn-success')">toggleable</a>
    as it is present in <code>binder.model.decorate.classes</code> array and <code>binder.model.decorate.classList</code> list.
</p>
<!-- /trim -->
<div data-bind="cssClasses: binder.model.decorate.classes" class="btn btn-success">
    Styled with array
</div>
<div data-bind="cssClasses: binder.model.decorate.classList" class="btn btn-success">
    Styled classes list
</div>

<?php
array_pop($classes);
?>
<script>
    window.onload = (function () {
        <!-- trim -->
        addClass = function (name) {
            var index = binder.model.decorate.classes.indexOf(name);
            if (index === -1) {
                console.log("Add " + name + " IDX: " + index);
                binder.model.decorate.classes.push(name);
                binder.model.decorate.classList = binder.model.decorate.classList + ' ' + name
            }
            return false;
        };
        removeClass = function (name) {
            var index = binder.model.decorate.classes.indexOf(name);
            if (index !== -1) {
                console.log("Remove " + name + " IDX: " + index);
                binder.model.decorate.classes.splice(index, 1);
                binder.model.decorate.classList = binder.model.decorate.classList.replace(name, '');
            }
            return false;
        };
        toggleClass = function (name) {
            var index = binder.model.decorate.classes.indexOf(name);
            if (index === -1) {
                addClass(name);
            } else {
                removeClass(name);
            }
            return false;
        };
        <!-- /trim -->

        var classes = <?= json_encode($classes);?>;
        var classList = <?= json_encode(implode(' ', $classes));?>;
        binder.model.decorate = new Maslosoft.Koe.CssClasses({
            classes: classes,
            classList: classList
        });

        ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
    });
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
