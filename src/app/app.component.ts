import {Component} from '@angular/core';

import {GeoJSON} from 'ol/format';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Tile, Vector as VectorLayer} from 'ol/layer';

import {
  HsConfig,
  HsEventBusService,
  HsToastService
} from 'hslayers-ng';

@Component({
  selector: 'application-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class HslayersAppComponent {
  /* You can name your app as you like or not at all */
  title = 'hslayers-application';
  constructor(
    /* Inject here all modules from HSLayers-NG which you intend to use */
    public hsConfig: HsConfig,
    private hsEventBusService: HsEventBusService,
    private hsToastService: HsToastService,
  ) {
    /* Define a geometry of one square polygon */
    const geojsonObject = {
      'type': 'FeatureCollection',
      'crs': {
        'type': 'name',
        'properties': {
          'name': 'EPSG:3857',
        },
      },
      'features': [
        {
          'type': 'Feature',
          'geometry': {
            'type': 'Polygon',
            'coordinates': [
              [
                [1e6, 6e6],
                [1e6, 8e6],
                [3e6, 8e6],
                [3e6, 6e6],
                [1e6, 6e6],
              ],
            ],
          },
          'properties': {
            'name': 'Poly 1',
            'population': Math.floor(Math.random() * 100000),
          },
        },
      ],
    };
    /* Define the polygon's style using SLD */
    const polygonSld = `<?xml version="1.0" encoding="ISO-8859-1"?>
      <StyledLayerDescriptor version="1.0.0" 
          xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd" 
          xmlns="http://www.opengis.net/sld" 
          xmlns:ogc="http://www.opengis.net/ogc" 
          xmlns:xlink="http://www.w3.org/1999/xlink" 
          xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
        <NamedLayer>
          <Name>Simple point with stroke</Name>
          <UserStyle>
            <Title>Default</Title>
            <FeatureTypeStyle>
              <Rule>
              <PolygonSymbolizer>
              <Fill>
                <CssParameter name="fill">#000080</CssParameter>
              </Fill>
            </PolygonSymbolizer>
              </Rule>
            </FeatureTypeStyle>
          </UserStyle>
        </NamedLayer>
      </StyledLayerDescriptor>
    `;
    /* Define and update the HsConfig configuration object */
    this.hsConfig.update({
      datasources: [
        /* You need to set up Layman in order to use it. See https://github.com/LayerManager/layman */
        /*{
          title: 'Layman',
          url: 'http://localhost:8087',
          user: 'anonymous',
          type: 'layman',
          liferayProtocol: 'https',
        },*/
        {
          title: 'Micka',
          url: 'https://hub.sieusoil.eu/cat/csw',
          language: 'eng',
          type: 'micka',
        },
      ],
      /* Use hslayers-server if you need to proxify your requests to other services. See https://www.npmjs.com/package/hslayers-server */
      /* proxyPrefix: window.location.hostname.includes('localhost')
        ? `${window.location.protocol}//${window.location.hostname}:8085/`
        : '/proxy/',
      */
      useProxy: false,
      panelsEnabled: {
        tripPlanner: true,
      },
      componentsEnabled: {
        basemapGallery: true,
      },
      assetsPath: 'assets',
      symbolizerIcons: [
        {name: 'beach', url: '/assets/icons/beach17.svg'},
        {name: 'bicycles', url: '/assets/icons/bicycles.svg'},
        {name: 'coffee-shop', url: '/assets/icons/coffee-shop1.svg'},
        {name: 'mountain', url: '/assets/icons/mountain42.svg'},
        {name: 'warning', url: '/assets/icons/warning.svg'},
      ],
      popUpDisplay: 'hover',
      default_layers: [
        /* One baselayer */
        new Tile({
          source: new OSM(),
          visible: true,
          properties: {
            title: 'OpenStreetMap',
            base: true,
            removable: false,
          },
        }),
        /* One thematic layer */
        new VectorLayer({
          properties: {
            title: 'Polygon vector layer',
            synchronize: false,
            cluster: false,
            inlineLegend: true,
            popUp: {
              attributes: ['population'],
            },
            editor: {
              editable: true,
              defaultAttributes: {
                name: 'New polygon',
                description: 'none',
              },
            },
            sld: polygonSld,
            path: 'User generated',
          },
          source: new VectorSource({
            features: new GeoJSON().readFeatures(geojsonObject),
          }),
        }),
      ],
    });
    /* Now wait for the OpenLayers Map object to load */
    this.hsEventBusService.olMapLoads.subscribe(() => {
      /* ...and display a simple toast message in the bottom-left corner */
      this.hsToastService.createToastPopupMessage(
        'READY!',
        'Your map is now ready to use.',
        {
          toastStyleClasses: 'bg-success text-white' /* Use any Bootstrap class here, see https://getbootstrap.com/docs/4.0/utilities/colors/ */
        }
      );
    })
  }
}
