import ApiUtils from './ApiUtils'

var Api = {
    //Get data of country by code
    getCountryDataByCode : function (code) {
        return fetch('/api/getCountryData?code=' + code)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .catch(e => console.log(e))
    },
    getInteractionDataByCode : function (code) {
        return fetch('/api/getInteractionsByCountry?code=' + code)
            .then(ApiUtils.checkStatus)
            .then(response => response.json())
            .catch(e => console.log(e))
    }
}

export { Api as default };
