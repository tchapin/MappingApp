/**
 * Created by tchapin on 10/10/2014.
 */
define([
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/dom-construct",
    "dojo/dom-style",
    "dijit/Dialog",
    "dijit/_WidgetBase"
], function(declare, aspect, domConstruct, domStyle, Dialog, _WidgetBase){
    return declare([Dialog, _WidgetBase], {
        title: null,
        class: null,
        width: null,
        height: null,
        left: null,
        top: null,
        titlebarHeight: 42,
        constructor: function(options) {
            //set up the dialog based on the options provided or use defaults
            this.title = options.title || "default title";
            this.class = options.class || "modalDialog";
            this.width = options.width || 300;
            this.height = options.height || 300;
            this.left = options.left || 50;
            this.top = options.top || 50;
        },
        postCreate: function() {
            this.inherited(arguments);
            //size the dialog
            domStyle.set(this.domNode, {
                width: this.width + "px",
                height: this.height + "px"
            });
            //size the containerNode (take into account the toolbar height so the scrollbar just covers the contents)
            domStyle.set(this.containerNode, {
                margin: 0,
                padding: 0,
                height: this.height - this.titlebarHeight + "px",
                width: "auto",
                overflow: "auto"
            });
            //after the onShow event, set the position
            aspect.after(this, "show", function(){
                domStyle.set(this.domNode, {
                    left: this.left + "px",
                    top: this.top + "px"
                });
            });
            //before the onHide event, save the position
            aspect.before(this, "hide", function(){
                this.left = domStyle.get(this.domNode, "left");
                this.top = domStyle.get(this.domNode, "top");
            });
        }
    });
});