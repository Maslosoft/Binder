<?php require './_header.php'; ?>
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
		Values in this demo are purely examples, but might be a good idea
		for real application. 
	</p>
	<br />
	<div data-bind="acl: {'action.one': app.model.AclUser}">Should be visible</div>
	<div>Below div should <b>not</b> be visible if not allowed</div>
	<div data-bind="acl: {'action.two': app.model.AclUser}">Should be hidden</div>
	<button class="btn btn-success" id="allow">Allow</button>
	<button class="btn btn-danger" id="deny">Deny</button>
</div>

<script>
	jQuery(document).ready(function(){
		var actionAllowed = '';
		app.myAcl = function(acl){
			console.log("Checking acl: ", acl);
			if(acl['action.one']){
				console.log('Allow action.one');
				return true;
			}
			if(acl['action.two'] && !acl['action.two'].isGuest){
				console.log('Allow action.two');
				return true;
			}
			return false;
		};
		jQuery('#allow').click(function(){
			app.model.AclUser.isGuest = false;
		});
		jQuery('#deny').click(function(){
			app.model.AclUser.isGuest = true;
		});
		Maslosoft.Ko.Balin.Acl.allow = app.myAcl
		app.model.AclUser = new Maslosoft.Ko.BalinDev.Models.AclUser();
		ko.applyBindings({model: app.model});
	});
</script>
<?php require './_footer.php'; ?>
