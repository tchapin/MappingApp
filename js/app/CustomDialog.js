/**
 * Created by tchapin on 10/10/2014.
 */
define([
    "dojo/_base/declare",
    "dojo/aspect",
    "dojo/dom-style",
    "dijit/Dialog"
], function(declare, aspect, domStyle, Dialog){
    return declare(Dialog, {
        title: null,
        content: null,
        class: null,
        width: null,
        height: null,
        left: null,
        top: null,
        constructor: function(options) {
            //set up the dialog based on the options provided or use defaults
            this.title = options.title || "default title";
            this.content = options.content || "no content provided";
            this.class = options.class || "modalDialog"; //in the css .modalDialog_underlay {display: block;}
            this.width = options.width || 300;
            this.height = options.height || 300;
            this.left = options.left || 50;
            this.top = options.top || 50;
        },
        startup: function(){
            //size the dialog
            domStyle.set(this.domNode, {
                width: this.width + "px",
                height: this.height + "px"
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