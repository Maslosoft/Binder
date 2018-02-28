<?php require __DIR__ . '/../_header.php'; ?>
<!-- trim -->
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
    When using multiline binding definition the <code>data</code> property must
    be quited with <code>'</code>
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
<p>
    This design approach gives great freedom of arranging Tree Grid. It looks
    like it require a lot of HTML markup, but it is old plain table with
    extra <code>data-bind</code> attributes.
</p>
<div>
    <a href="#" data-bind="click: addNode">Add new node programatically</a>
</div>
<div>
    <a href="#" data-bind="click: addSubNode">Add new sub-node programatically</a>
</div>
<div>
    <a href="#" data-bind="click: addSubSubNode">Add new sub-sub-node programatically</a>
</div>
<div>
    <a href="#" data-bind="click: addSubSubNodeLast">Add new sub-sub-node to last sub-node programatically</a>
</div>
<div>
    <a href="#" data-bind="click: remSubSubNode">Remove all sub-sub-nodes programatically</a>
</div>

<hr/>
<!-- /trim -->
<div>
    <table id="gridView" style="font-size: 18px;" class="table table-condensed">
        <thead>
        <tr>
            <th style="width:.1%;"><input type="checkbox" id="selectAll"/></th>
            <th>Nodes</th>
            <th>Description</th>
            <th>Misc</th>
            <th>Remove</th>
            <th>Debug</th>
        </tr>
        </thead>
        <tbody
                data-bind="
                    treegrid: {
                        'data': balin.model.Tree,
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
            <td data-bind="html: description"></td>
            <td>Static value</td>
            <td><a href="#" class="remove">Remove</a></td>
            <td class="debug"></td>
        </tr>
        </tbody>
    </table>
</div>
<script type="text/javascript">
    window.onload = (function () {
// trim
        var nodeId = 0;
        window.addNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'New node #' + nodeId;
            model.description = 'Description #' + nodeId;
            balin.model.Tree.children.push(model);
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        window.addSubNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'New sub-node #' + nodeId;
            model.description = 'Description sub-node #' + nodeId;
            balin.model.Tree.children[0].children.push(model);
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        window.addSubSubNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'New sub-sub-node #' + nodeId;
            model.description = 'Description sub-sub-node #' + nodeId;
            balin.model.Tree.children[0].children[0].children.push(model);
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        window.addSubSubNodeLast = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'New sub-sub-node #' + nodeId;
            model.description = 'Description sub-sub-node #' + nodeId;
            var idx = 0;
            if (balin.model.Tree.children[0].children.length) {
                idx = balin.model.Tree.children[0].children.length - 1;
            }
            balin.model.Tree.children[0].children[idx].children.push(model);
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };
        window.remSubSubNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'New sub-sub-node #' + nodeId;
            model.description = 'Description sub-sub-node #' + nodeId;
            balin.model.Tree.children[0].children[0].children = [];
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        var deferAdd = function () {
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

        setTimeout(deferAdd, 100);
        var grid = jQuery('#gridView');
        var gm = new Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView(grid.find('tbody'));
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
        balin.model.Tree = new Maslosoft.Koe.TreeItem(data);
        balin.model.Tree2 = new Maslosoft.Koe.TreeItem(data);
        ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
    });
</script>
<?php require __DIR__ . '/../_footer.php'; ?>
