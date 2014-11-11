/**
 * Created by tchapin on 5/27/2014.
 */
define([
    "app/config",
    "esri/map",
    "esri/geometry/Extent",
    "esri/geometry/Point",
    "esri/IdentityManager",
    "esri/layers/ArcGISDynamicMapServiceLayer",
    "esri/layers/ArcGISTiledMapServiceLayer",
    "esri/layers/FeatureLayer",
    "esri/tasks/GeometryService",
    "esri/tasks/ProjectParameters",
    "esri/units",
    "dijit/layout/BorderContainer",
    "dijit/layout/ContentPane",
    "dijit/form/Button",
    "dojo/_base/array",
    "dojo/_base/window",
    "dojo/_base/lang",
    "dojo/dom-construct",
    "dojo/on",
    "widgets/CustomDialog"
], function(config, Map, Extent, Point, IdentityManager, ArcGISDynamicMapServiceLayer, ArcGISTiledMapServiceLayer, FeatureLayer, GeometryService, ProjectParameters, units, BorderContainer, ContentPane, Button, array, win, lang, domConstruct, on, CustomDialog) {
    var controller = {
        startup: function(config) {
            this.config = config;
            this.initLayout();
            this.initMap();
            this.initDialogs();
        },

        initLayout: function() {
            console.log('initLayout');
            this.appContainer = new BorderContainer({
                id: 'appContainer',
                design: 'headline',
                gutters: false
            }).placeAt(win.body());

            this.headerPane = new ContentPane({
                id: 'headerPane',
                region: 'top',
                splitter: false
            }).placeAt(this.appContainer);

            this.headerContainer = new BorderContainer({
                id: 'headerContainer',
                design: 'sidebar',
                gutters: false
            }).placeAt(this.headerPane);

            this.headerPaneLeft = new ContentPane({
                id: 'headerPaneLeft',
                region: 'left',
                splitter: false,
                content: '<img id=headerLogo src=images/sgclogofull.png />'
            }).placeAt(this.headerContainer);

            this.headerPaneCenter = new ContentPane({
                id: 'headerPaneCenter',
                region: 'center',
                content: '<div id="headerTitle">' + config.title + '<div id="headerSubTitle">' + config.subTitle + '</div></div>'
            }).placeAt(this.headerContainer);

            this.headerPaneRight = new ContentPane({
                id: 'headerPaneRight',
                region: 'right',
                splitter: false,
                content: '<div id="headerLinks">some links</div>'
            }).placeAt(this.headerContainer);

            this.mainPane = new ContentPane({
                id: 'mainPane',
                region: 'center'
            }).placeAt(this.appContainer);

            this.mainContainer = new BorderContainer({
                id: 'mainContainer',
                design: 'headline',
                gutters: false
            }).placeAt(this.mainPane);

            this.toolbarPane = new ContentPane({
                id: 'toolbarPane',
                region: 'top',
                splitter: false
            }).placeAt(this.mainContainer);

            this.toolbarContainer = new BorderContainer({
                id: 'toolbarContainer',
                design: 'sidebar',
                gutters: false
            }).placeAt(this.toolbarPane);

            this.toolbarPaneLeft = new ContentPane({
                id: 'toolbarPaneLeft',
                region: 'left',
                splitter: false
            }).placeAt(this.toolbarContainer);

            this.toolbarPaneCenter = new ContentPane({
                id: 'toolbarPaneCenter',
                region: 'center',
                content: 'search'
            }).placeAt(this.toolbarContainer);

            this.toolbarPaneRight = new ContentPane({
                id: 'toolbarPaneRight',
                region: 'right',
                splitter: false
            }).placeAt(this.toolbarContainer);

            this.mapPane = new ContentPane({
                id: 'mapPane',
                region: 'center'
            }).placeAt(this.mainContainer);

            this.statusbarPane = new ContentPane({
                id: 'statusbarPane',
                region: 'bottom',
                splitter: false
            }).placeAt(this.mainContainer);

            this.statusbarContainer = new BorderContainer({
                id: 'statusbarContainer',
                design: 'sidebar',
                gutters: false
            }).placeAt(this.statusbarPane);

            this.statusbarPaneLeft = new ContentPane({
                id: 'statusbarPaneLeft',
                region: 'left',
                splitter: false,
                content: 'status left'
            }).placeAt(this.statusbarContainer);

            this.statusbarPaneCenter = new ContentPane({
                id: 'statusbarPaneCenter',
                region: 'center',
                content: 'status center'
            }).placeAt(this.statusbarContainer);

            this.statusbarPaneRight = new ContentPane({
                id: 'statusbarPaneRight',
                region: 'right',
                splitter: false,
            }).placeAt(this.statusbarContainer);

            this.initButtons();

            this.appContainer.startup();

        },

        initButtons: function(){
            //create the layers button
            this.btnLayers = new Button({
                label: 'Layers'
            }, "btnLayersNode").placeAt(this.toolbarPaneLeft);
            this.btnLayers.startup();

            //create the basemaps button
            this.btnBasemaps = new Button({
                label: 'Basemaps'
            }, "btnBasemapsNode").placeAt(this.toolbarPaneLeft);
            this.btnBasemaps.startup();

            this.btnMeasure = new Button({
                label: 'Measure'
            }, "btn").placeAt(this.toolbarPaneLeft);
            this.btnMeasure.startup();

            this.btnDraw = new Button({
                label: 'Draw'
            }, "btn").placeAt(this.toolbarPaneLeft);
            this.btnDraw.startup();

            this.btnBookmarks = new Button({
                label: 'Bookmarks'
            }, "btn").placeAt(this.toolbarPaneLeft);
            this.btnBookmarks.startup();

            this.btnPrint = new Button({
                label: 'Print'
            }, "btn").placeAt(this.toolbarPaneLeft);
            this.btnPrint.startup();

            this.btnImport = new Button({
                label: 'Import'
            }, "btn").placeAt(this.toolbarPaneRight);
            this.btnImport.startup();

            this.btnQuery = new Button({
                label: 'Query'
            }, "btn").placeAt(this.toolbarPaneRight);
            this.btnQuery.startup();

            this.btnSubmittal = new Button({
                label: 'Submittal'
            }, "btn").placeAt(this.toolbarPaneRight);
            this.btnSubmittal.startup();
        },

        initMap: function() {
            console.log('initMap');
            //initialize the map
            this.map = new esri.Map('mapPane', config.mapOptions);
            console.log('hooking up map load event handler');
            //add an event handler for map load to set the extent based on config options
            this.map.on('load', lang.hitch(this, 'mapOnLoad'));
        },

        mapOnLoad: function(evt) {
            console.log('mapOnLoad');
            //set up the map

            //home button
            if (this.config.homeButton.include) {
                require(["esri/dijit/HomeButton"], lang.hitch(this, function(HomeButton) {
                    this.homeButton = new HomeButton({map: this.map}, domConstruct.create("div", {id: "homeButton"}, "mapPane"));
                    this.homeButton.startup();
                    //home extent gets set when the  map initial extent is processed (differently for center, extent, and layer)
                }));
            }
            //locate button
            if (this.config.locateButton.include) {
                require(["esri/dijit/LocateButton"], lang.hitch(this, function(LocateButton){
                    var locateButton = new LocateButton({map: this.map}, domConstruct.create("div", {id: "locateButton"}, "mapPane"));
                    locateButton.startup();
                }));
            }
            //scalebar
            if (config.scaleBar.include) {
                require(['esri/dijit/Scalebar'], lang.hitch(this, function(Scalebar) {
                    this.scaleBar = new Scalebar({
                        map: this.map,
                        attachTo: this.config.scaleBar.attachTo,
                        scalebarStyle: this.config.scaleBar.scalebarStyle,
                        scalebarUnit: this.config.scaleBar.scalebarUnit
                    });
                }));
            }
            //set the extent (layer extent happens after layer is loaded)
            if (config.extentType === 'extent') {
                this.map.setExtent(new Extent(config.extentParams)).then(lang.hitch(this, function(){
                    this.homeButton.extent = this.map.extent;
                }));
            }
            if (config.extentType === 'center') {
                this.map.centerAndZoom(new Point(config.extentParams.point), config.extentParams.zoom).then(lang.hitch(this, function(){
                    this.homeButton.extent = this.map.extent;
                }));
            }

            //add layers, if layer extent have to do it after layer is loaded
            this.addLayers();
        },

        addLayers: function() {
            console.log('addLayers');
            this.layers = [];
            array.forEach(this.config.operationalLayers, function(lyr) {
                //create a new layer for the map based on the layer type
                var layer;
                if (lyr.type === 'dynamic') {
                    layer = new ArcGISDynamicMapServiceLayer(lyr.url, lyr.options);
                }
                else if (lyr.type === 'tiled') {
                    layer = new ArcGISTiledMapServiceLayer(lyr.url, lyr.options);
                }
                else if (lyr.type === 'feature') {
                    layer = new FeatureLayer(lyr.url, lyr.options);
                }
                else {
                    console.log('Layer type not supported: ', lyr.type);
                }
                this.layers.push(layer);
                console.log("hooking up layer load event handlers");
                //add an event handler for loading errors
                layer.on('error', lang.hitch(this, 'layerLoadError'));
                //add an event handler for onLoad
                layer.on('load', lang.hitch(this, 'layerLoad'));
            }, this);
            //add the layers to the map
            this.map.addLayers(this.layers);
        },

        layerLoad: function(evt) {
            console.log('layerLoad: ' + evt.layer.id);
            //if this layer is the extent layer, set the map extent to the initial extent of the layer
            if (config.extentType === 'layer') {
                if (config.extentParams.layerID === evt.layer.id) {
                    //not ready to set the extent yet because the layer may not be in web mercator
                    if (evt.layer.initialExtent.spatialReference.wkid !== this.map.spatialReference.wkid) {
                        //have to project the layer's initial extent to the map's spatial reference
                        var params = new ProjectParameters();
                        params.geometries = [evt.layer.initialExtent];
                        params.outSR = this.map.spatialReference;
                        var geomService = new GeometryService("https://webgis.sgcengineering.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");
                        geomService.project(
                            params,
                            lang.hitch(this, function(geoms){
                                this.map.setExtent(geoms[0]);
                                this.homeButton.extent = geoms[0];
                            }), //callBack
                            lang.hitch(this, function(err){console.log(err.message)})  //errBack
                        );
                    }
                }
            }
            //get the logged in user
            if (esri.id.credentials.length === 0) {
                this.statusbarPaneRight.set("content", "anonymous");
            } else {
                this.statusbarPaneRight.set("content", esri.id.credentials[0].userId);
            }
        },

        layerLoadError: function(evt) {
            console.log('layerLoadError');
            console.log(evt.error.message);
        },

        initDialogs: function() {
            //Basemaps
            require(["esri/dijit/BasemapGallery"], lang.hitch(this, function(BasemapGallery) {
                //create the basemaps dialog
                this.dlgBasemaps = new CustomDialog({
                    title: "Basemaps",
                    class: "nonModalDialog",
                    width: 400,
                    height: 420,
                    left: 65,
                    top: 130
                });
                this.dlgBasemaps.startup();
                //hook it to the button click
                on(this.btnBasemaps, "click", lang.hitch(this, function(){this.dlgBasemaps.show();}));
                //create the basemap gallery
                var widgetBMGallery = new BasemapGallery({
                    map: this.map,
                    showArcGISBasemaps: true,
                    style: "margin: 5px; padding: 5px;"
                }, "bmGalleryDiv");
                widgetBMGallery.startup();
                //put it in the dialog
                widgetBMGallery.placeAt(this.dlgBasemaps.containerNode);
            }));
            //Draw
            require(["widgets/Draw"], lang.hitch(this, function(Draw) {
                //create the draw dialog
                this.dlgDraw = new CustomDialog({
                    title: "Draw",
                    class: "nonModalDialog",
                    width: 300,
                    height: 160,
                    left: 65,
                    top: 130,
                    style: "margin: 5px; padding: 5px;"
                });
                this.dlgDraw.startup();
                //hook it to the button click
                on(this.btnDraw, "click", lang.hitch(this, function(){this.dlgDraw.show();}));
                //create the custom draw widget
                var widgetDraw = new Draw({
                    map: this.map,
                    parentDialog: this.dlgDraw
                }, "drawDiv");
                widgetDraw.startup();
                //put it in the dialog
                widgetDraw.placeAt(this.dlgDraw.containerNode);
            }));
            //Measure
            require(["widgets/Measure"], lang.hitch(this, function(Measure) {
                //create a new measure dialog
                this.dlgMeasure = new CustomDialog({
                    title: "Measure",
                    class: "nonModalDialog",
                    width: 300,
                    height: 300,
                    left: 65,
                    top: 130,
                    style: "margin: 5px; padding: 5px;"
                });
                this.dlgMeasure.startup();
                //hook it to the button click
                on(this.btnMeasure, "click", lang.hitch(this, function(){this.dlgMeasure.show();}));
                //create the measure widget
                var widgetMeasure = new Measure({
                    map: this.map,
                    parentDialog: this.dlgMeasure,
                    defaultAreaUnit: units.ACRES,
                    defaultLengthUnit: units.FEET
                }, "measureDiv");
                widgetMeasure.startup();
                //put it in the dialog
                widgetMeasure.placeAt(this.dlgMeasure.containerNode);
            }));
            //Bookmarks
            require(["widgets/Bookmarks"], lang.hitch(this, function(Bookmarks) {
                //create a new bookmarks dialog
                this.dlgBookmarks = new CustomDialog({
                    title: "Bookmarks",
                    class: "nonModalDialog",
                    width: 350,
                    height: 300,
                    left: 65,
                    top: 130,
                    style: "margin: 5px; padding: 5px;"
                });
                this.dlgBookmarks.startup();
                //hook it to the button click
                on(this.btnBookmarks, "click", lang.hitch(this, function(){this.dlgBookmarks.show();}));
                //create the bookmarks widget
                var widgetBookmarks = new Bookmarks({
                    map: this.map,
                    parentDialog: this.dlgBookmarks,
                    config: this.config.bookmarkConfig
                }, "bookmarksDiv");
                widgetBookmarks.startup();
                //put it in the dialog
                widgetBookmarks.placeAt(this.dlgBookmarks.containerNode);
            }));
            //Print
            require(["widgets/Print"], lang.hitch(this, function(Print) {
                //create a new bookmarks dialog
                this.dlgPrint = new CustomDialog({
                    title: "Print",
                    class: "nonModalDialog",
                    width: 500,
                    height: 400,
                    left: 65,
                    top: 130,
                    style: "margin: 5px; padding: 5px;"
                });
                this.dlgPrint.startup();
                //hook it to the button click
                on(this.btnPrint, "click", lang.hitch(this, function(){this.dlgPrint.show();}));
                //create the print widget
                var widgetPrint = new Print({
                    map: this.map,
                    parentDialog: this.dlgPrint,
                    printTaskURL: this.config.printConfig.printTaskUrl,
                    defaultTitle: this.config.printConfig.defaultTitle
                }, "printDiv");
                widgetPrint.startup();
                //put it in the dialog
                widgetPrint.placeAt(this.dlgPrint.containerNode);
            }));
        }
    };

    return controller;
});