/*! JointJS+ v3.5.0 - HTML5 Diagramming Framework - TRIAL VERSION

Copyright (c) 2022 client IO

 2022-07-22 


This Source Code Form is subject to the terms of the JointJS+ Trial License
, v. 2.0. If a copy of the JointJS+ License was not distributed with this
file, You can obtain one at http://jointjs.com/license/rappid_v2.txt
 or from the JointJS+ archive as was distributed by client IO. See the LICENSE file.*/


import * as joint from '@clientio/rappid';
import * as dagre from 'dagre';
import * as _ from 'lodash';
import * as appShapes from '../shapes/app-shapes';

class KitchenSinkService {

    constructor(el, stencilService, toolbarService, inspectorService, haloService, keyboardService) {

        // backwards compatibility for older shapes
        this.exportStylesheet = '.scalable * { vector-effect: non-scaling-stroke }';
        this.el = el;

        // apply current joint js theme
        const view = new joint.mvc.View({ el });
        view.delegateEvents({
            'mouseup input[type="range"]': (evt) => evt.target.blur()
        });

        this.stencilService = stencilService;
        this.toolbarService = toolbarService;
        this.inspectorService = inspectorService;
        this.haloService = haloService;
        this.keyboardService = keyboardService;
    }

    startRappid() {

        joint.setTheme('modern');

        this.initializePaper();
        this.initializeStencil();
        this.initializeSelection();
        this.initializeToolsAndInspector();
        this.initializeNavigator();
        this.initializeToolbar();
        this.initializeKeyboardShortcuts();
        this.initializeTooltips();
    }

    stopRappid() {

        this.paper.remove();
        this.paperScroller.remove();
        this.stencilService.stencil.remove();
        this.selection.remove();
        this.toolbarService.toolbar.remove();
        this.keyboardService.keyboard.stopListening();
        this.tooltip.remove();
    }

    initializePaper() {

        const graph = this.graph = new joint.dia.Graph({}, {
            cellNamespace: appShapes
        });

        this.commandManager = new joint.dia.CommandManager({ graph: graph });

        const paper = this.paper = new joint.dia.Paper({
            width: 1000,
            height: 1000,
            gridSize: 10,
            drawGrid: true,
            model: graph,
            cellViewNamespace: appShapes,
            defaultLink: new appShapes.app.Link(),
            defaultConnectionPoint: appShapes.app.Link.connectionPoint,
            interactive: { linkMove: false },
            async: true,
            sorting: joint.dia.Paper.sorting.APPROX
        });

        paper.on('blank:mousewheel', _.partial(this.onMousewheel, null), this);
        paper.on('cell:mousewheel', this.onMousewheel.bind(this));

        this.snaplines = new joint.ui.Snaplines({ paper: paper });

        const paperScroller = this.paperScroller = new joint.ui.PaperScroller({
            paper,
            autoResizePaper: true,
            scrollWhileDragging: true,
            cursor: 'grab'
        });

        this.renderPlugin('.paper-container', paperScroller);
        paperScroller.render().center();
    }

    initializeStencil() {

        const { stencilService, paperScroller, snaplines } = this;
        stencilService.create(paperScroller, snaplines);

        this.renderPlugin('.stencil-container', stencilService.stencil);
        stencilService.setShapes();

        stencilService.stencil.on('element:drop', (elementView) => {
            this.selection.collection.reset([elementView.model]);
        });
    }

    initializeSelection() {

        this.clipboard = new joint.ui.Clipboard();
        this.selection = new joint.ui.Selection({ paper: this.paper, useModelGeometry: true });
        this.selection.collection.on('reset add remove', this.onSelectionChange.bind(this));

        const keyboard = this.keyboardService.keyboard;

        // Initiate selecting when the user grabs the blank area of the paper while the Shift key is pressed.
        // Otherwise, initiate paper pan.
        this.paper.on('blank:pointerdown', (evt, x, y) => {

            if (keyboard.isActive('shift', evt)) {
                this.selection.startSelecting(evt);
            }
            else {
                this.selection.collection.reset([]);
                this.paperScroller.startPanning(evt);
                this.paper.removeTools();
            }
        });

        this.paper.on('element:pointerdown', (elementView, evt) => {

            // Select an element if CTRL/Meta key is pressed while the element is clicked.
            if (keyboard.isActive('ctrl meta', evt)) {
                this.selection.collection.add(elementView.model);
            }

        });

        this.graph.on('remove', (cell) => {

            // If element is removed from the graph, remove from the selection too.
            if (this.selection.collection.has(cell)) {
                this.selection.collection.reset(this.selection.collection.models.filter(c => c !== cell));
            }

        });

        this.selection.on('selection-box:pointerdown', (elementView, evt) => {

            // Unselect an element if the CTRL/Meta key is pressed while a selected element is clicked.
            if (keyboard.isActive('ctrl meta', evt)) {
                this.selection.collection.remove(elementView.model);
            }

        }, this);
    }

    onSelectionChange() {
        const { paper, selection } = this;
        const { collection } = selection;
        paper.removeTools();
        joint.ui.Halo.clear(paper);
        joint.ui.FreeTransform.clear(paper);
        joint.ui.Inspector.close();
        if (collection.length === 1) {
            const primaryCell = collection.first();
            const primaryCellView = paper.requireView(primaryCell);
            selection.destroySelectionBox(primaryCell);
            this.selectPrimaryCell(primaryCellView);
        }
        else if (collection.length === 2) {
            collection.each(function(cell) {
                selection.createSelectionBox(cell);
            });
        }
    }

    selectPrimaryCell(cellView) {
        const cell = cellView.model;
        if (cell.isElement()) {
            this.selectPrimaryElement(cellView);
        }
        else {
            this.selectPrimaryLink(cellView);
        }
        this.inspectorService.create(cell);
    }

    selectPrimaryElement(elementView) {

        const element = elementView.model;

        new joint.ui.FreeTransform({
            cellView: elementView,
            allowRotation: false,
            preserveAspectRatio: !!element.get('preserveAspectRatio'),
            allowOrthogonalResize: element.get('allowOrthogonalResize') !== false
        }).render();

        this.haloService.create(elementView);
    }

    selectPrimaryLink(linkView) {

        const ns = joint.linkTools;
        const toolsView = new joint.dia.ToolsView({
            name: 'link-pointerdown',
            tools: [
                new ns.Vertices(),
                new ns.SourceAnchor(),
                new ns.TargetAnchor(),
                new ns.SourceArrowhead(),
                new ns.TargetArrowhead(),
                new ns.Segments(),
                new ns.Boundary({ padding: 15 }),
                new ns.Remove({ offset: -20, distance: 40 })
            ]
        });

        linkView.addTools(toolsView);
    }

    initializeToolsAndInspector() {

        this.paper.on('cell:pointerup', (cellView) => {
            const cell = cellView.model;
            const { collection } = this.selection;
            if (collection.includes(cell)) {
                return;
            }
            collection.reset([cell]);
        });

        this.paper.on('link:mouseenter', (linkView) => {

            // Open tool only if there is none yet
            if (linkView.hasTools()) {
                return;
            }

            const ns = joint.linkTools;
            const toolsView = new joint.dia.ToolsView({
                name: 'link-hover',
                tools: [
                    new ns.Vertices({ vertexAdding: false }),
                    new ns.SourceArrowhead(),
                    new ns.TargetArrowhead()
                ]
            });

            linkView.addTools(toolsView);
        });

        this.paper.on('link:mouseleave', (linkView) => {

            // Remove only the hover tool, not the pointerdown tool
            if (linkView.hasTools('link-hover')) {
                linkView.removeTools();
            }
        });

        this.graph.on('change', (cell, opt) => {

            if (!cell.isLink() || !opt.inspector) {
                return;
            }

            const ns = joint.linkTools;
            const toolsView = new joint.dia.ToolsView({
                name: 'link-inspected',
                tools: [
                    new ns.Boundary({ padding: 15 }),
                ]
            });

            cell.findView(this.paper).addTools(toolsView);
        });
    }

    initializeNavigator() {

        const navigator = this.navigator = new joint.ui.Navigator({
            width: 240,
            height: 115,
            paperScroller: this.paperScroller,
            zoom: false,
            paperOptions: {
                async: true,
                sorting: joint.dia.Paper.sorting.NONE,
                elementView: appShapes.NavigatorElementView,
                linkView: appShapes.NavigatorLinkView,
                cellViewNamespace: { /* no other views are accessible in the navigator */}
            }
        });

        this.renderPlugin('.navigator-container', navigator);
    }

    initializeToolbar() {

        this.toolbarService.create(this.commandManager, this.paperScroller);

        this.toolbarService.toolbar.on({
            'svg:pointerclick': this.openAsSVG.bind(this),
            'png:pointerclick': this.openAsPNG.bind(this),
            'to-front:pointerclick': this.applyOnSelection.bind(this, 'toFront'),
            'to-back:pointerclick': this.applyOnSelection.bind(this, 'toBack'),
            'layout:pointerclick': this.layoutDirectedGraph.bind(this),
            'snapline:change': this.changeSnapLines.bind(this),
            'clear:pointerclick': this.graph.clear.bind(this.graph),
            'print:pointerclick': this.paper.print.bind(this.paper),
            'grid-size:change': this.paper.setGridSize.bind(this.paper)
        });

        this.renderPlugin('.toolbar-container', this.toolbarService.toolbar);
    }

    applyOnSelection(method) {
        this.graph.startBatch('selection');
        this.selection.collection.models.forEach(function(model) { model[method](); });
        this.graph.stopBatch('selection');
    }

    changeSnapLines(checked) {

        if (checked) {
            this.snaplines.startListening();
            this.stencilService.stencil.options.snaplines = this.snaplines;
        }
        else {
            this.snaplines.stopListening();
            this.stencilService.stencil.options.snaplines = null;
        }
    }

    initializeKeyboardShortcuts() {

        this.keyboardService.create(this.graph, this.clipboard, this.selection, this.paperScroller, this.commandManager);
    }

    initializeTooltips() {

        this.tooltip  = new joint.ui.Tooltip({
            rootTarget: document.body,
            target: '[data-tooltip]',
            direction: joint.ui.Tooltip.TooltipArrowPosition.Auto,
            padding: 10
        });
    }

    openAsSVG() {

        this.paper.hideTools().toSVG((svg) => {
            new joint.ui.Lightbox({
                image: 'data:image/svg+xml,' + encodeURIComponent(svg),
                downloadable: true,
                fileName: 'Rappid'
            }).open();
            this.paper.showTools();
        }, {
            preserveDimensions: true,
            convertImagesToDataUris: true,
            useComputedStyles: false,
            stylesheet: this.exportStylesheet
        });
    }

    openAsPNG() {

        this.paper.hideTools().toPNG((dataURL) => {
            new joint.ui.Lightbox({
                image: dataURL,
                downloadable: true,
                fileName: 'Rappid'
            }).open();
            this.paper.showTools();
        }, {
            padding: 10,
            useComputedStyles: false,
            stylesheet: this.exportStylesheet
        });
    }

    onMousewheel(cellView, evt, ox, oy, delta) {

        if (this.keyboardService.keyboard.isActive('alt', evt)) {
            evt.preventDefault();
            this.paperScroller.zoom(delta * 0.2, { min: 0.2, max: 5, grid: 0.2, ox, oy });
        }
    }

    layoutDirectedGraph() {

        joint.layout.DirectedGraph.layout(this.graph, {
            graphlib: dagre.graphlib,
            dagre: dagre,
            setVertices: true,
            rankDir: 'TB',
            marginX: 100,
            marginY: 100
        });

        this.paperScroller.centerContent({ useModelGeometry: true });
    }

    renderPlugin(selector, plugin) {

        this.el.querySelector(selector).appendChild(plugin.el);
        plugin.render();
    }
}

export default KitchenSinkService;
