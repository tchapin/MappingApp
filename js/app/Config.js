/**
 * Created by tchapin on 5/27/2014.
 */
define([
        "esri/config",
        "esri/layers/FeatureLayer",
        "esri/tasks/GeometryService"
    ],
    function(esriConfig, FeatureLayer, GeometryService) {
        //geometry service
        esriConfig.defaults.geometryService = new GeometryService("https://webgis.sgcengineering.com/arcgis/rest/services/Utilities/Geometry/GeometryServer");

        return {
            title: 'Mapping Application',
            subTitle: 'a custom mapping application',

            //MAP OPTIONS
            mapOptions: {
                //initial basemap choices: streets , satellite , hybrid, topo, gray, oceans, national-geographic, osm
                basemap: 'gray',
                //levels of detail can be provided to allow users to zoom in farther or prevent zooming out too far.
                //                lods: [
                //                    {level: 0, resolution: 156543.03392800014, scale: 5.91657527591555E8},
                //                    {level: 1, resolution: 78271.51696399994, scale: 2.95828763795777E8},
                //                    {level: 2, resolution: 39135.75848200009, scale: 1.47914381897889E8},
                //                    {level: 3, resolution: 19567.87924099992, scale: 7.3957190948944E7},
                //                    {level: 4, resolution: 9783.93962049996, scale: 3.6978595474472E7},
                //                    {level: 5, resolution: 4891.96981024998, scale: 1.8489297737236E7},
                //                    {level: 6, resolution: 2445.98490512499, scale: 9244648.868618},
                //                    {level: 7, resolution: 1222.992452562495, scale: 4622324.434309},
                //                    {level: 8, resolution: 611.4962262813797, scale: 2311162.217155},
                //                    {level: 9, resolution: 305.74811314055756, scale: 1155581.108577},
                //                    {level: 10, resolution: 152.87405657041106, scale: 577790.554289},
                //                    {level: 11, resolution: 76.43702828507324, scale: 288895.277144},
                //                    {level: 12, resolution: 38.21851414253662, scale: 144447.638572},
                //                    {level: 13, resolution: 19.10925707126831, scale: 72223.819286},
                //                    {level: 14, resolution: 9.554628535634155, scale: 36111.909643},
                //                    {level: 15, resolution: 4.77731426794937, scale: 18055.954822},
                //                    {level: 16, resolution: 2.388657133974685, scale: 9027.977411},
                //                    {level: 17, resolution: 1.1943285668550503, scale: 4513.988705},
                //                    {level: 18, resolution: 0.5971642835598172, scale: 2256.994353},
                //                    {level: 19, resolution: 0.29858214164761665, scale: 1128.497176}
                //                ],
                //max scale. You cannot zoom in beyond this scale
                //maxScale: 10000,
                //max zoom. You cannot zoom in beyond this level
                //maxZoom: 16
                //min scale.  You cannot zoom out past this scale
                //minScale: 500000,
                //min zoom.  You cannot zoom out past this level
                //minZoom: 10,
                slider: true,
                sliderPosition: 'top-left',
                sliderStyle: 'small'
            },

            //initial extent can be a fixed extent ('extent'), centered on a coordinate ('center'), or the initial extent of a layer ('layer')
            //extent example (extent json) (helper app: http://psstl.esri.com/apps/extenthelper/)
            //extentType: 'extent',
            //extentParams: {xmin: -7842199.639179235, ymin: 5412834.082451465, xmax: -7840219.44241539, ymax: 5413900.617861666, spatialReference: {wkid: 102100}},
            //center example (point json and a zoom level)
            //extentType: 'center',
            //extentParams: {point: {x: -7846286.930117544, y: 5427867.096123681, spatialReference: {wkid: 102100 } }, zoom: 16},
            //layer example
            extentType: 'layer',
            extentParams: {layerID: 'demoLocations'},

            // operationalLayers: list of layers to load on top of the basemap: valid 'type' options: "dynamic", "tiled", "feature".
            //      title: used when the layer is displayed, e.g. toc
            //      type: dynamic | tiled | feature
            //      url: start with //
            //      options: layer options that get passed to the constructor
            // draw order is top to bottom
            operationalLayers: [
                {
                    title: 'demoLocations',
                    type: 'feature',
                    url: '//webgis.sgcengineering.com/arcgis/rest/services/TChapin/demoLocations/MapServer/0',
                    options: {
                        id: 'demoLocations',
                        mode: FeatureLayer.MODE_ONDEMAND,
                        opacity: 1.0,
                        visible: true
                    }
                }
                //{
                //    title: 'demoLocations',
                //    type: 'dynamic',
                //    url: '//webgis.sgcengineering.com/arcgis/rest/services/TChapin/demoLocations/MapServer',
                //    options: {
                //        id: 'demoLocations',
                //        visible: true
                //    }
                //}
            ],

            scaleBar: {
                include: true,
                attachTo: "bottom-left",
                scalebarStyle: "line",
                scalebarUnit: "dual"
            },
            homeButton: {include: true},
            locateButton: {include: true},
            bookmarkConfig: {
                editable: true,
                bookmarkItems: [
                    {
                        "name" : "Aziscohos Lake",
                        "extent" : {"xmin":-7918436.617429456,"ymin":5610658.48613199,"xmax":-7889161.235596273,"ymax":5627474.6323547065,"spatialReference":{"wkid":102100}}
                    },
                    {
                        "name" : "Parmachenee Lake",
                        "extent" : {"xmin":-7909311.947177925,"ymin":5641300.17984577,"xmax":-7894674.256261333,"ymax":5649708.252957127,"spatialReference":{"wkid":102100}}
                    },
                    {
                        "name" : "Kennebago Lake",
                        "extent" : {"xmin":-7879711.707974532,"ymin":5631879.316109634,"xmax":-7865074.017057939,"ymax":5640287.389220991,"spatialReference":{"wkid":102100}}
                    }
                ]
            }
        }
    }
);