<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>Placeholder</title>
<h1>Placeholder</h1>
<p>
    The <code>placeholder</code> binding will simply add
    <code>placeholder</code> attribute to element, and set it's
    value to observable. However it will also strip any HTML
    from value, so that the attribute will contain allowed value.
</p>
<p>
    Try to change text in first input or in HTML editable input,
    this will update <code>placeholder</code> too on empty HTML
    input element as well as on HTML editable input.
</p>
<p class="alert alert-warning">
    Please note, that to have placeholders on custom elements,
    extra CSS style need to be added:
</p>
<pre class="css">
[contenteditable=true]:empty:before {
    content: attr(placeholder);
    display: block; /* For Firefox */
    color: #999;
}
</pre>
<!-- /trim -->
<style>
    [contenteditable=true]:empty:before {
        content: attr(placeholder);
        display: block; /* For Firefox */
        color: #999;
    }
</style>
<div class="form-group" data-bind="with: binder.model.Text">
    <label>Standard input</label>
    <input data-bind="textInput: text" class="form-control">

    <label>HTML Editable input</label>
    <div data-bind="htmlValue: text" class="form-control"></div>

    <label>Empty input with placeholder</label>
    <input data-bind="placeholder: text" class="form-control">

    <label>Empty HTML Editable input with placeholder</label>
    <div data-bind="htmlValue: '', placeholder: text" class="form-control"></div>

</div>

<script>
    window.onload = (function () {
        binder.model.Text = new Maslosoft.Koe.HtmlValue({text: 'This is <code>placeholder</code> <b>text</b>'});
        ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
        jQuery('body').tooltip({
            selector: '[rel~="tooltip"]'
        });
    });
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
