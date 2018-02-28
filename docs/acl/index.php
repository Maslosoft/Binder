<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<title>ACL</title>
<h1>ACL<br />
<small>Access Control For User Interface Elements</small>
</h1>
<!-- /trim -->
<div>
<!-- trim -->
	<h4>Configuring</h4>
	<p>
		This binding will check if users is allowed action,
		and hide element if denied. Before use, action need to be defined
		by static property <code>Maslosoft.Binder.Acl.allow</code> 
		of ACL binding handler. This property should contain Access Control
		checking function. This function need to return boolean <code>true</code> or <code>false</code>
	</p>
	<p>
		Access control function will get parameters same as observable value. In fact
		this binding handler will simply pass it's value to access control cheching function
		and display or hide element according to this function's result.
	</p>
	<h4>Using in HTML</h4>
	<p>
		Checking roles is performed by user defined function, which will get all parameters
		passed to observable. This way Your access control logic can be arbitrarily customized.
	</p>
	<p>
		This binding requires observable value to allow updates. However
		format of value is not strict, as it's simply passed to
		checking function defined as <code>Maslosoft.Binder.Acl.allow</code>.
	</p>
	<p>In this example ACL consist of roles as a object keys and user observable object instance as a value:</p>
<pre class="html">
<?= escapeko('<div data-bind="acl: {\'<role-name>\': <observable-user-instance>}"><ui-element></div>');?>
</pre>
	<p>
		If updates are not required, even string value can be passed.
	</p>
	<h4>Live Example</h4>
	<p>
		In this example user has always granted access to <code>action.one</code>, and access to
		<code>action.two</code> is dependent on its <code>isGuest</code> property value.
	</p>
	<p>
		Try to click buttons to see result:
	</p>
<div class="well">
<!-- /trim -->
	<span data-bind="acl: {'action.one': binder.model.AclUser}" class="label label-warning">Should be visible always</span>
	<span data-bind="acl: {'action.two': binder.model.AclUser}" class="label label-success">Should be visible for registered</span>
	<br />
	<br />
	<button class="btn btn-success" id="allow">Allow Access</button>
	<button class="btn btn-danger" id="deny">Deny Access</button>
<!-- trim -->
</div>
<!-- /trim -->
</div>
<script>
	window.onload = (function () {
		var actionAllowed = '';

		// This is example function to check access
		binder.myAcl = function (acl) {
			console.log("Checking acl: ", acl);
			if (acl['action.one']) {
				console.log('Allow action.one');
				return true;
			}
			if (acl['action.two'] && !acl['action.two'].isGuest) {
				console.log('Allow action.two');
				return true;
			}
			return false;
		};
		// trim
		// Click handlers for buttons
		jQuery('#allow').click(function () {
			binder.model.AclUser.isGuest = false;
		});
		jQuery('#deny').click(function () {
			binder.model.AclUser.isGuest = true;
		});
		// /trim
		// Apply bindings
		Maslosoft.Binder.Acl.allow = binder.myAcl
		binder.model.AclUser = new Maslosoft.Koe.AclUser();
		ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
	});
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
