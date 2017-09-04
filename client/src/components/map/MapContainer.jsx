import React, {Component} from 'react';
import { render } from 'react-dom';
import { Map, Marker, Popup, TileLayer, GeoJSON } from 'react-leaflet';
import Choropleth from 'react-leaflet-choropleth'
import Control from 'react-leaflet-control';

const geoJsonData = require('../../data/geo/custom.geo.json')

const mapConfig = {
    center: [52.499219, 25.425416],
    zoom: 2
};

const defaultStyle = {
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.9
}
const hoverStyle = {
    weight: 1,
    color: '#A5C9E0',
    dashArray: '',
}
const selectedStyle = {
    weight: 1,
    color: '#0B2B6C',
    dashArray: '',
}

export default class MapContainer extends Component {

    constructor(props) {
        super(props);

        for (var i=0; i < geoJsonData.features.length; i++){
            geoJsonData.features[i].properties.interactionValue = 0
        }

        this.state = {
            geoData : geoJsonData,
            selectedCountryCode:"",
            selectedCountryName:"",
            selectedLayer : null,
            hoverCountryCode:"",
            hoverCountryName:"",
            hoverCountryValue:""
        }

        this.onEachFeature = this.onEachFeature.bind(this)
        this.highlightFeature = this.highlightFeature.bind(this)
        this.resetHighlight = this.resetHighlight.bind(this)
        this.clickOnCountry = this.clickOnCountry.bind(this)

    }

    componentWillReceiveProps(newProps){
        var geoData = this.state.geoData

        // Set values into the GeoJSON according to the number of interactions between countries
        if(newProps.countryData){
            for (var i=0; i < geoData.features.length; i++){
                var countyItem = newProps.countryData.find(el => el.country_code == geoData.features[i].properties.iso_a2)
                geoData.features[i].properties.interactionValue = countyItem != null ? countyItem.value : 0
            }
            this.setState({
                geoData : geoData
            })
        }


    }

    componentDidUpdate(){
        if(this.state.selectedLayer){
            this.state.selectedLayer.setStyle(selectedStyle);
        }
    }

    onEachFeature(feature, layer){

        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
            click: this.clickOnCountry
        });
    }

    highlightFeature(e){
        var layer = e.target;

        layer.setStyle(hoverStyle);
        layer.bringToFront();

        this.setState({
            hoverCountryCode : layer.feature.properties.iso_a2,
            hoverCountryName : layer.feature.properties.name,
            hoverCountryValue: layer.feature.properties.interactionValue
        })

    }

    resetHighlight(e){
        var layer = e.target;
        if(layer != this.state.selectedLayer)
            layer.setStyle(defaultStyle);
    }

    clickOnCountry(e){
        var layer = e.target;

        if(this.state.selectedLayer) this.state.selectedLayer.setStyle(defaultStyle)

        this.setState({
            selectedLayer : layer,
            selectedCountryName : layer.feature.properties.name,
            selectedCountryCode : layer.feature.properties.iso_a2,
        })

        this.props.onCountrySelect(layer.feature.properties.iso_a2)
    }

    render() {
        return (
            <div className="map">
                <Map center={mapConfig.center} zoom={mapConfig.zoom} className="map__reactleaflet">
                    <TileLayer
                        url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attribution">CARTO</a>'
                    />
                    <Choropleth
                        data={this.state.geoData}
                        valueProperty={(feature) => feature.properties.interactionValue}
                        scale={['#EFEFEF','#295A99']}
                        steps={10}
                        mode='e'
                        style={defaultStyle}
                        onEachFeature={this.onEachFeature}
                    />

                    {this.state.selectedCountryCode && (
                        <Control position="topright" >
                            <div className="leaflet-control-info">
                                <h3>
                                    Source country: {this.state.selectedCountryName}
                                </h3>
                                <p>Interactions with {this.state.hoverCountryName}: {this.state.hoverCountryValue}</p>
                            </div>
                        </Control>
                    )}

                </Map>

            </div>
        )
    }
}
