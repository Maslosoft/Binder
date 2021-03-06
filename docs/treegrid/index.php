<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
<style>
    .hide-description .description{
        display: none !important;
    }
</style>
<title>Tree Grid</title>
<h1>Tree Grid</h1>
<p>
    Tree Grid is a complex component, featuring HTMl table as it's base.
    But it uses one of table columns to display nested structure along with
    folding controls. The result is a tree like display, but with
    optional properties. Tree Grid also supports Drag and Drop of nodes
    to arrange them as You like.
</p>
<p class="alert alert-warning">
    When using multi-line binding definition the <code>data</code> property must
    be quoted with single quote (<code>'</code>)
</p>
<p>
    Setting up Tree Grid is no different than configuring table to be
    fed with <code>foreach</code> binding. Each column can have it's
    own rendering logic. The difference is that <code>treegrid</code>
    binding must be used instead of said <code>foreach</code>.
</p>
<p class="alert alert-success">
    Property <code>data</code> of binding can be either model containing
    nested structure or array of node models
</p>
<p>
    This example uses model with <code>children</code> property initialization,
    for array initialization <a href="array-data/">check feeding with array example</a>.
</p>
<p>
    It is recommended to place <code>treegrid</code> binding on <code>tbody</code>
    tag, so that table headers can be added too. To display nested structure
    with folding controls, add span with <code>treegridnode</code> binding to
    chosen column. It does not have to be first one, any will do.
</p>
<h3>Extra options</h3>
<p>
    The <code>treegrid</code> binding has also extra configurable parameters:
</p>
<ul>
    <li>
        <code>childrenField</code> - field containing child elements in each node
    </li>
    <li>
        <code>nodeIcon</code> - path to file which will be used as node icon
    </li>
    <li>
        <code>autoExpand</code> - boolean value, will automatically open all nodes
    </li>
    <li>
        <code>dnd</code> - boolean value, enable Drag'n'Drop support
    </li>
    <li>
        <code>activeClass</code> - string value, CSS classes that will be added to activated node
    </li>
    <li>
        <code>expanderIcon</code> - string value, HTML element template for expander. By default
        it is using glyphicon <i class='glyphicon glyphicon-triangle-bottom'></i>. There is only
        one type of icon for expander, as it is simply rotated. The icon should be some kind of
        triangle pointing down.
    </li>
</ul>
<p>
    This design approach gives great freedom of arranging Tree Grid. It looks
    like it require a lot of HTML markup, but it is old plain table with
    extra <code>data-bind</code> attributes.
</p>
<div>
    <a href="#" data-bind="click: addNode">Add new node programmatically</a>
</div>
<div>
    <a href="#" data-bind="click: addSubNode">Add new sub-node programmatically</a>
</div>
<div>
    <a href="#" data-bind="click: addSubSubNode">Add new sub-sub-node programmatically</a>
</div>
<div>
    <a href="#" data-bind="click: addSubSubNodeLast">Add new sub-sub-node to last sub-node programmatically</a>
</div>
<div>
    <a href="#" data-bind="click: addManyNodes">Add many nodes</a>
</div>
<div>
    <a href="#" data-bind="click: addLoadOfNodes">Add load of nodes</a>
</div>
<div>
    <a href="#" data-bind="click: toggleHtmlTree">Toggle second, synchronised tree</a>
</div>
<h2>Live example</h2>
<p class="alert alert-success">
    Items can be dragged and dropped between trees too. Trees are protected against recursive loop.
</p>
<div id="gridWrapper" class="col-xs-12 col-sm-12">
<!-- /trim -->
<table id="gridView" style="font-size: 18px;" class="table table-condensed">
    <thead>
    <tr>
        <th style="width:.1%;"><input type="checkbox" id="selectAll"/></th>
        <th>Nodes</th>
        <th class="description">Description</th>
        <th class="hidden-xs">Misc</th>
        <th>Remove</th>
    </tr>
    </thead>
    <tbody
            data-bind="
                treegrid: {
                    'data': binder.model.Tree,
                    childrenField: 'children',
                    nodeIcon: '../images/pdf.png',
                    folderIcon: '../images/zip.png',
                    autoExpand: true,
                    dnd: true,
                    activeClass: 'active success'
                    }
            "
    >
    <tr>
        <td><input type="checkbox" class="tree-grid-checkbox"/></td>
        <td>
            <span data-bind="treegridnode: $data"></span>
            <span data-bind="html: title"></span>
        </td>
        <td data-bind="html: description" class="description"></td>
        <td class="hidden-xs">Text</td>
        <td><a href="#" class="remove">Remove</a></td>
    </tr>
    </tbody>
</table>
<!-- trim -->
</div>
<div id="treeWrapper" class="col-xs-12 col-sm-6 hide">
    <table id="gridView" style="font-size: 18px;" class="table table-condensed">
        <thead>
        <tr>
            <th>Nodes</th>
        </tr>
        </thead>
        <tbody
                data-bind="
                treegrid: {
                    'data': binder.model.Tree,
                    childrenField: 'children',
                    nodeIcon: '../images/pdf.png',
                    folderIcon: '../images/zip.png',
                    autoExpand: true,
                    dnd: true,
                    activeClass: 'active success'
                    }
            "
        >
        <tr>
            <td>
                <span data-bind="treegridnode: $data"></span>
                <span data-bind="html: title"></span>
            </td>
        </tr>
        </tbody>
    </table>
</div>
<div class="clearfix"></div>
<!-- /trim -->
<script type="text/javascript">
    window.onload = (function () {
// trim

        toggleHtmlTree = function () {
            var grid = jQuery('#gridWrapper');
            var tree = jQuery('#treeWrapper');
            grid.toggleClass('col-sm-12');
            grid.toggleClass('col-sm-6');
            tree.toggleClass('hide');
            grid.toggleClass('hide-description');
            return false;
        };
        toggleHtmlTree();
        var nodeId = 0;
        window.addNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'New node ' + nodeId;
            model.description = 'Description ' + nodeId;
            binder.model.Tree.children.push(model);
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        window.addSubNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'Sub-node ' + nodeId;
            model.description = 'Description ' + nodeId;
            binder.model.Tree.children[0].children.push(model);
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        window.addSubSubNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'Sub-sub-node ' + nodeId;
            model.description = 'Description ' + nodeId;
            binder.model.Tree.children[0].children[0].children.push(model);
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        window.addSubSubNodeLast = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'Sub-sub-node ' + nodeId;
            model.description = 'Description ' + nodeId;
            var idx = 0;
            if (binder.model.Tree.children[0].children.length) {
                idx = binder.model.Tree.children[0].children.length - 1;
            }
            binder.model.Tree.children[0].children[idx].children.push(model);
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        window.remSubSubNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'Sub-sub-node ' + nodeId;
            model.description = 'Description ' + nodeId;
            binder.model.Tree.children[0].children[0].children = [];
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        window.addManyNodes = function () {
            window.addNode();
            window.addSubNode();
            window.addSubNode();
            window.addSubSubNodeLast();
            window.addSubSubNodeLast();
            window.addSubSubNodeLast();
            window.addSubNode();
            window.addSubSubNodeLast();
            window.addSubSubNodeLast();
            window.addSubNode();
            window.addSubSubNodeLast();
            window.addSubSubNodeLast();
            window.addSubSubNodeLast();
            window.addSubSubNodeLast();
        };

        window.addLoadOfNodes = function() {
            window.addManyNodes();
            window.addManyNodes();
            window.addManyNodes();
            window.addManyNodes();
            window.addManyNodes();
            window.addManyNodes();
            window.addManyNodes();
        }

        var grid = jQuery('#gridView');
        var gm = new Maslosoft.Binder.Widgets.TreeGrid.TreeGridView(grid.find('tbody'));
        grid.on('click', '.remove', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var model = ko.dataFor(this);
            console.log(model.title);
            gm.remove(model);
        });

        var checkAll = $('#selectAll');
        checkAll.on('click', function(e){
            var allCheckboxes = $('.tree-grid-checkbox');
            if(checkAll.is(':checked')) {
                allCheckboxes.prop('checked', true);
            }else{
                allCheckboxes.prop('checked', false);
            }
        });
// /trim
        data = {
            _class: 'Maslosoft.Koe.TreeItem',
            title: "Some container",
            children: [
                {
                    _class: 'Maslosoft.Koe.TreeItem',
                    title: "Zero",
                    description: "This can be also rendered via custom renderer"
                },
                {
                    _class: 'Maslosoft.Koe.TreeItem',
                    title: "One",
                    description: "Another one with description",
                    children: [
                        {
                            _class: 'Maslosoft.Koe.TreeItem',
                            title: "Two",
                            description: "Hover for node tooltip - also added by node renderer"
                        },
                        {
                            _class: 'Maslosoft.Koe.TreeItem',
                            title: "Three",
                            children: [
                                {
                                    _class: 'Maslosoft.Koe.TreeItem',
                                    title: "Three-Two"
                                },
                                {
                                    _class: 'Maslosoft.Koe.TreeItem',
                                    title: "Three-Three"
                                }
                            ]

                        },
                        {
                            _class: 'Maslosoft.Koe.TreeItem',
                            title: "Four"
                        }
                    ]
                }
            ]
        };
        binder.model.Tree = new Maslosoft.Koe.TreeItem(data);
        binder.model.Tree2 = new Maslosoft.Koe.TreeItem(data);
        ko.applyBindings({model: binder.model}, document.getElementById('ko-binder'));
    });
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
