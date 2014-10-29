/**
 * Created by tchapin on 10/17/2014.
 */
define([
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/_base/Color",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/text!./Draw/templates/Draw.html",
    "esri/graphic",
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/toolbars/draw",
    "xstyle/css!./Draw/css/Draw.css"
], function(_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, Color, declare, lang, on, drawTemplate, Graphic, SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol, Draw, css){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: drawTemplate,
        drawToolbar: null,
        postCreate: function() {
            this.inherited(arguments);
            this.drawToolbar = new Draw(this.map);
            this.drawToolbar.on("draw-end", lang.hitch(this, "onDrawToolbarDrawEnd"));
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
        drawCancel: function() {
            this.drawToolbar.deactivate();
        },
        drawClear: function() {
            this.map.graphics.clear();
            this.drawToolbar.deactivate();
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