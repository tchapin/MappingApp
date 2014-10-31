/**
 * Created by tchapin on 10/31/2014.
 */
define([
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dojo/_base/declare",
    "dojo/_base/event",
    "dojo/_base/lang",
    "dojo/cookie",
    "dojo/on",
    "dojo/text!./Bookmarks/templates/Bookmarks.html",
    "esri/dijit/Bookmarks",
    "xstyle/css!./Bookmarks/css/Bookmarks.css"
], function(_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, declare, event, lang, cookie, on, bookmarksTemplate, Bookmarks, css){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: bookmarksTemplate,
        postCreate: function() {
            this.inherited(arguments);
            this.bookmarks = new Bookmarks({
                map: this.map,
                editable: this.config.editable,
                bookmarks: this.config.bookmarks
            }, this.bookmarksNode);
            //listen to the parent dialog's onHide
            on(this.parentDialog, "hide", lang.hitch(this, function() {
                console.log("Bookmarks dialog hiding");
            }));
        }
    });
});