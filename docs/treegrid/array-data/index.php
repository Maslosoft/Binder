<?php require __DIR__ . '/../../_header.php'; ?>
<!-- trim -->
<title>Feeding with array</title>
<h1>Feeding Tree Grid with array data</h1>
<p>
    <a href="../">Tree Grid</a> can be fed with array data too.
    This might be convenient in some cases.
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
            <th style="width:.1%;"><input type="checkbox"/></th>
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
				'data': balin.model.nodes,
				childrenField: 'children',
				nodeIcon: '../../images/pdf.png',
				folderIcon: '../../images/zip.png',
				autoExpand: true,
				dnd: true,
				activeClass: 'active success'
				}">
        <tr>
            <td><input type="checkbox"/></td>
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
        var nodeId = 0;
        window.addNode = function (data, e) {
            nodeId++;
            var model = new Maslosoft.Koe.TreeItem;
            model.title = 'New node #' + nodeId;
            model.description = 'Description #' + nodeId;
            balin.model.nodes.push(model);
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
            balin.model.nodes[0].children.push(model);
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
            balin.model.nodes[0].children[0].children.push(model);
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
            if (balin.model.nodes[0].children.length) {
                idx = balin.model.nodes[0].children.length - 1;
            }
            balin.model.nodes[0].children[idx].children.push(model);
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
            balin.model.nodes[0].children[0].children = [];
            if (e) {
                e.stopPropagation();
                e.preventDefault();
            }
        };

        // var deferAdd = function () {
        //     window.addNode();
        //     window.addSubNode();
        //     window.addSubNode();
        //     window.addSubSubNodeLast();
        //     window.addSubSubNodeLast();
        //     window.addSubSubNodeLast();
        //     window.addSubNode();
        //     window.addSubSubNodeLast();
        //     window.addSubSubNodeLast();
        //     window.addSubNode();
        //     window.addSubSubNodeLast();
        //     window.addSubSubNodeLast();
        //     window.addSubSubNodeLast();
        //     window.addSubSubNodeLast();
        // };

        // setTimeout(deferAdd, 100);


        var grid = jQuery('#gridView');
        var gm = new Maslosoft.Ko.Balin.Widgets.TreeGrid.TreeGridView(grid.find('tbody'));
        grid.on('click', '.remove', function (e) {
            e.stopPropagation();
            e.preventDefault();
            var model = ko.dataFor(this);
            console.log(model.title);
            gm.remove(model);
        });

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
        var tree = new Maslosoft.Koe.TreeItem(data);
        balin.model.nodes = tree.children;
        ko.applyBindings({model: balin.model}, document.getElementById('ko-balin'));
    });
</script>
<?php require __DIR__ . '/../../_footer.php'; ?>
