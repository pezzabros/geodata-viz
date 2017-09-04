import React, { Component } from 'react';

import 'react-table/react-table.css'
import './style/font/stylesheet.css';
import './style/App.css';

import MapContainer from './components/map/MapContainer'
import TableContainer from './components/table/TableContainer'

import Api from './api/Api'

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            activeCountry: "",
            countryData: [],
            interactionData: [],
            loadingGeoData : false,
            loadingInteractionData : false
        }

        this.handleCountySelect = this.handleCountySelect.bind(this)
    }

    handleCountySelect(countryCode){
        this.setState({
            loadingGeoData : true,
            loadingInteractionData : true
        })
        Api.getCountryDataByCode(countryCode).then(data => {
            console.log(data)

            this.setState({
                countryData : data,
                loadingGeoData : false,
            })
        })

        Api.getInteractionDataByCode(countryCode).then(data => {
            console.log(data)
            this.setState({
                activeCountry : countryCode,
                interactionData : data,
                loadingInteractionData : false
            })
        })
    }

    render() {
        return (
            <div className="app-container">
                <h1>Countries interactions</h1>
                <MapContainer loading={this.state.loadingGeoData} onCountrySelect={this.handleCountySelect} countryData={this.state.countryData} />
                <TableContainer loading={this.state.loadingInteractionData} data={this.state.interactionData} />
            </div>
      );
  }
}

export default App;
