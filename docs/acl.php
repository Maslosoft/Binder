<?php require __DIR__ . '/_header.php'; ?>
<title>ACL</title>
<h1>ACL</h1>
<div>
	<p>
		This binding will check if users is allowed action,
		and hide element if not. Before use, action need to be defined
		by static property <code>Maslosoft.Ko.Balin.Acl.allow</code>.
	</p>
	<p>
		This binding requires observable value to allow updates. However
		format of value is not strict, as it's simply passed to
		checking function defined as <code>Maslosoft.Ko.Balin.Acl.allow</code>.
	</p>
	<p>
		If updates are not required, even string value can be passed.
		Values in this demo are purely exemplary, but might be a good idea
		for real application.
	</p>
	<br />
	<div data-bind="acl: {'action.one': balin.model.AclUser}">Should be visible</div>
	<div>Below div should <b>not</b> be visible if not allowed</div>
	<div data-bind="acl: {'action.two': balin.model.AclUser}">Should be hidden</div>
	<button class="btn btn-success" id="allow">Allow</button>
	<button class="btn btn-danger" id="deny">Deny</button>
</div>

<script>
	window.onload = (function () {
		var actionAllowed = '';
		balin.myAcl = function (acl) {
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
		jQuery('#allow').click(function () {
			balin.model.AclUser.isGuest = false;
		});
		jQuery('#deny').click(function () {
			balin.model.AclUser.isGuest = true;
		});
		Maslosoft.Ko.Balin.Acl.allow = balin.myAcl
		balin.model.AclUser = new Maslosoft.Ko.BalinDev.Models.AclUser();
		ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
	});
</script>
<?php require __DIR__ . '/_footer.php'; ?>
