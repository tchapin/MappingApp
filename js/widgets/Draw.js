/**
 * Created by tchapin on 10/17/2014.
 */
define([
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/_base/Color",
    "dojo/_base/declare",
    "dojo/_base/event",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/text!./Draw/templates/Draw.html",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/toolbars/draw",
    "esri/toolbars/edit",
    "xstyle/css!./Draw/css/Draw.css"
], function(_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Color, declare, event, lang, on, drawTemplate, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Draw, Edit, css){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: drawTemplate,
        postCreate: function() {
            this.inherited(arguments);
            this.drawToolbar = new Draw(this.map);
            this.drawToolbar.on("draw-end", lang.hitch(this, "onDrawToolbarDrawEnd"));
            this.editToolbar = new Edit(this.map);
            this.markerSymbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                10,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([255,0,0,1.0]), 1),
                new Color([255,0,0,0.25])
            );
            this.lineSymbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255,0,0,1.0]), 2);
            this.fillSymbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_SOLID,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([255,0,0,1.0]), 2),
                new Color([255,0,0,0.25])
            );
            //listen to the parent dialog's onHide and cancel drawing
            on(this.parentDialog, "hide", lang.hitch(this, function() {
                this.drawCancel();
            }));
        },
        drawPoint: function() {
            this.drawToolbar.activate(Draw.POINT);
        },
        drawPolyline: function() {
            this.drawToolbar.activate(Draw.POLYLINE);
        },
        drawPolygon: function() {
            this.drawToolbar.activate(Draw.POLYGON);
        },
        drawEdit: function() {
            //add one-time click event to the graphics layer
            on.once(this.map.graphics, "click", lang.hitch(this, function(evt) {
                //stop the click event to avoid propagation (IE)
                event.stop(evt);
                this.editToolbar.activate(Edit.MOVE | Edit.EDIT_VERTICES, evt.graphic);
            }));
            //add one-time click event to map to deactivate the edit toolbar if they click off a graphic
            on.once(this.map, "click", lang.hitch(this, function(evt) {
                //deactivate the edit toolbar
                this.editToolbar.deactivate();
            }));
        },
        drawCancel: function() {
            this.drawToolbar.deactivate();
            this.editToolbar.deactivate();
        },
        drawClear: function() {
            this.drawToolbar.deactivate();
            this.editToolbar.deactivate();
            this.map.graphics.clear();
        },
        onDrawToolbarDrawEnd: function(evt) {
            this.drawToolbar.deactivate();
            switch (evt.geometry.type) {
                case "point":
                    this.map.graphics.add(new Graphic(evt.geometry, this.markerSymbol));
                    break;
                case "polyline":
                    this.map.graphics.add(new Graphic(evt.geometry, this.lineSymbol));
                    break;
                case "polygon":
                    this.map.graphics.add(new Graphic(evt.geometry, this.fillSymbol));
                    break;
            }
        }


    });
});