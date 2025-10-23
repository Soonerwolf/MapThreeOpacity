import maplibregl from "maplibre-gl";
import { BasicLayer } from "./BasicLayer.js"

export const map = new maplibregl.Map(
{
    container: 'mapContainer', // container id
    style: {
        version: 8,
        sources: {
            osm: {
                type: 'raster',
                tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap Contributors',
                maxzoom: 19
            }
        },
        layers: [{
            id: 'osm',
            type: 'raster',
            source: 'osm'
        }],
    },
    projection: 'mercator',
    center: [-95.5, 34.5], // starting position [lng, lat]
    zoom: 6 // starting zoom
});


function CreateBasicLayer()
{
    let outLayer = 
    {
        id: "basicSquare",
        type: "custom",
        
        onAdd (inMap, inGL)
        {
            this.basicLayer = new BasicLayer (inMap, inGL);
        },

        render (inGL, inArgs)
        {
            if (this.basicLayer) 
                this.basicLayer.drawLayer(inGL, inArgs);
        }
    }
    return outLayer;
}


// add the custom style layer to the map
map.on('load', async () => {
    const layer = CreateBasicLayer();
    map.addLayer(layer);
});