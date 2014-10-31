/**
 * Created by tchapin on 10/30/2014.
 */
define([
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/_base/declare",
    "dojo/_base/event",
    "dojo/_base/lang",
    "dojo/on",
    "dojo/text!./Measure/templates/Measure.html",
    "esri/dijit/Measurement",
    "xstyle/css!./Measure/css/Measure.css"
], function(_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, declare, event, lang, on, measureTemplate, Measurement, css){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: measureTemplate,
        toolName: null,
        postCreate: function() {
            this.inherited(arguments);
            this.measure = new Measurement({
                map: this.map,
                defaultAreaUnit: this.defaultAreaUnit,
                defaultLengthUnit: this.defaultLengthUnit
            }, this.measureNode);
            this.measure.startup();
            //listen to the tool-change event to remember the current tool name
            on(this.measure, "tool-change", lang.hitch(this, function(evt) {
                this.toolName = evt.toolName;
            }));
            //listen to the parent dialog's onHide to stop measuring and clear graphics
            on(this.parentDialog, "hide", lang.hitch(this, function() {
                this.measure.setTool(this.toolName, false);
                this.measure.clearResult();
            }));
        }
    });
});