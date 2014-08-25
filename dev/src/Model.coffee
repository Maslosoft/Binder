if not @Maslosoft
	@Maslosoft = {}
if not @Maslosoft.Components
	@Maslosoft.Components = {}
if not @Maslosoft.Menulis
	@Maslosoft.Menulis = {}
if not @Maslosoft.Menulis.Content
	@Maslosoft.Menulis.Content = {}
if not @Maslosoft.Menulis.Content.Models
	@Maslosoft.Menulis.Content.Models = {}
if not @Maslosoft.Mangan
	@Maslosoft.Mangan = {}
if not @Maslosoft.Mangan.Model
	@Maslosoft.Mangan.Model = {}
if not @Maslosoft.Ko.BalinDev
	@Maslosoft.Ko.BalinDev = {}
if not @Maslosoft.Ko.BalinDev.Models
	@Maslosoft.Ko.BalinDev.Models = {}

# Auto generated model for php class Maslosoft\Mangan\Model\Image do not modify
class @Maslosoft.Mangan.Model.Image_Base extends @Maslosoft.Ko.Balin.Model
	width: 0
	height: 0
	id: null
	filename: ''
	size: 0
	rootClass: ''
	rootId: ''
	contentType: ''
	_key: ''
	_class: 'Maslosoft\\Mangan\\Model\\Image'
	rawI18N: null

class @Maslosoft.Mangan.Model.Image extends @Maslosoft.Mangan.Model.Image_Base

class @Maslosoft.Menulis.Content.Models.AssetCollection_Base extends @Maslosoft.Ko.Balin.Model
	items: []
	title: ''
	description: ''
	groupCount: 0
	assetsCount: 0
	createUser: null
	createDate: null
	updateUser: null
	updateDate: null
	_id: null
	id: null
	_key: '53f374fdc79fda38578b4568'
	_class: 'Maslosoft\\Menulis\\Content\\Models\\AssetCollection'
	rawI18N: null

class @Maslosoft.Menulis.Content.Models.AssetCollection extends @Maslosoft.Menulis.Content.Models.AssetCollection_Base

# Auto generated model for php class Maslosoft\Menulis\Content\Models\AssetGroup do not modify
class @Maslosoft.Menulis.Content.Models.AssetGroup_Base extends @Maslosoft.Ko.Balin.Model
	title: ''
	description: ''
	order: 1000000
	items: []
	assetsCount: 0
	createUser: null
	createDate: null
	updateUser: null
	updateDate: null
	_id: null
	id: null
	_key: '53f374fec79fda38578b456b'
	_class: 'Maslosoft\\Menulis\\Content\\Models\\AssetGroup'
	rawI18N: null
	parentId: null

class @Maslosoft.Menulis.Content.Models.AssetGroup extends @Maslosoft.Menulis.Content.Models.AssetGroup_Base

# Auto generated model for php class Maslosoft\Menulis\Content\Models\PageAsset do not modify
class @Maslosoft.Menulis.Content.Models.PageAsset_Base extends @Maslosoft.Ko.Balin.Model
	filename: ''
	file: ''
	basename: ''
	relativeName: ''
	icon: ''
	isImage: false
	iconSize: 512
	path: ''
	url: ''
	type: ''
	deleted: false
	title: ''
	description: ''
	createUser: null
	createDate: null
	updateUser: null
	updateDate: null
	_id: null
	id: null
	_key: '53f374fec79fda38578b456c'
	_class: 'Maslosoft\\Menulis\\Content\\Models\\PageAsset'
	rawI18N: null
	parentId: null

class @Maslosoft.Menulis.Content.Models.PageAsset extends @Maslosoft.Menulis.Content.Models.PageAsset_Base

class @Maslosoft.Ko.BalinDev.Models.TreeItem extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.TreeItem"
	title: ''
	children: []

class @Maslosoft.Ko.BalinDev.Models.Intro extends @Maslosoft.Ko.Balin.Model
	_class: "Maslosoft.Ko.BalinDev.Models.Intro"
	text: ''