/**
 * Created by tchapin on 10/31/2014.
 */
define([
    "dijit/_WidgetBase",
    "dijit/_TemplatedMixin",
    "dijit/_WidgetsInTemplateMixin",
    "dijit/ConfirmDialog",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/event",
    "dojo/_base/lang",
    "dojo/cookie",
    "dojo/json",
    "dojo/on",
    "dojo/text!./Bookmarks/templates/Bookmarks.html",
    "esri/dijit/BookmarkItem",
    "esri/dijit/Bookmarks",
    "esri/lang",
    "xstyle/css!./Bookmarks/css/Bookmarks.css"
], function(_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin, ConfirmDialog, array, declare, event, lang, cookie, json, on, bookmarksTemplate, BookmarkItem, Bookmarks, esriLang, css){
    return declare([_WidgetBase, _TemplatedMixin, _WidgetsInTemplateMixin], {
        widgetsInTemplate: true,
        templateString: bookmarksTemplate,
        postCreate: function() {
            this.inherited(arguments);
            this.bookmarks = new Bookmarks({
                map: this.map,
                editable: this.config.editable,
                config: this.config.bookmarks
            }, this.bookmarksNode);
            //restore bookmarks from cookie, otherwise use default ones from config
            var bookmarkItems;
            //if (cookie("bookmarkItems") !== undefined) {
            if (esriLang.isDefined(cookie("bookmarkItems"))) {
                bookmarkItems = json.parse(cookie("bookmarkItems"));
            } else {
                bookmarkItems = this.config.bookmarkItems;
            }
            //loop through the bookmarks and add them to the bookmarks
            array.forEach(bookmarkItems, lang.hitch(this, function(bookmarkItem) {
                this.bookmarks.addBookmark(new BookmarkItem(bookmarkItem));
            }));
            //set the bookmarks cookie whenever a bookmark is added or removed
            on(this.bookmarks, "edit", lang.hitch(this, function() {
                this.setCookie();
            }));
            on(this.bookmarks, "remove", lang.hitch(this, function() {
                this.setCookie();
            }));
            //listen to the parent dialog's onHide
            on(this.parentDialog, "hide", lang.hitch(this, function() {
                this.setCookie();
            }));
        },
        setCookie: function() {
            //set the bookmarkItems cookie
            cookie("bookmarkItems", json.stringify(this.bookmarks.bookmarks) , {expires: 365});
        },
        resetBookmarks: function() {
            //prompt users, since they will lose their bookmarks
            var confirmDialog = new ConfirmDialog({
                title: "Are you sure?",
                content: "All current bookmarks will be permanently removed and replaced with the default bookmarks.",
                style: "margin: 5px; padding: 5px; width: 350px;",
                class: "alert-danger danger"
            });
            on(confirmDialog, "execute", lang.hitch(this, function() {
                this._resetBookmarks();
            }));
            confirmDialog.show();
        },
        _resetBookmarks: function() {
            //remove all bookmarks (only after confirmation)
            while (this.bookmarks.bookmarks.length > 0) {
                this.bookmarks.removeBookmark(this.bookmarks.bookmarks[0].name);
            }
            //reload from the default config
            array.forEach(this.config.bookmarkItems, lang.hitch(this, function(bookmarkItem) {
                this.bookmarks.addBookmark(new BookmarkItem(bookmarkItem));
            }));
            //save the new bookmarks
            this.setCookie();
        }
    });
});