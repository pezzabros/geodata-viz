const express = require('express');
const path = require('path');
var sqlite3 = require('sqlite3').verbose();

//Load DB
var db = new sqlite3.Database('./data/datumize-db.db');




const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));


//API that serves interaction info aggregated by countries
app.get('/api/getCountryData', (req, res) => {
    var countryCode = req.param('code');

    var sql = "select IP_comm_state.country_dst as 'country_code' , count(*) as 'value' "+
        "from IP_comm_state "+
        "where IP_comm_state.country_src = '" + countryCode +"' "+
        "GROUP BY IP_comm_state.country_dst";

    console.log(sql)
    var data = []
    db.all(sql, function(err, rows) {
        console.log(rows);
        res.json(rows);
    });
});

//API that serves all interactions for a specific source country
app.get('/api/getInteractionsByCountry', (req, res) => {
    var countryCode = req.param('code');

    var sql = "SELECT IP_comm_state.ip_src, IP_comm_state.ip_dst, IP_comm_state.country_dst, count(*) as 'times', MAX(IP_comm_state.timestamp) as 'last'"+
            "FROM IP_comm_state "+
            "WHERE IP_comm_state.country_src = '" + countryCode +"' "+
            "GROUP BY IP_comm_state.ip_src, IP_comm_state.ip_dst "+
            "ORDER BY times desc"
    console.log(sql)
    var data = []
    db.all(sql, function(err, rows) {
        console.log(rows);
        res.json(rows);
    });
});

// for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname+'/client/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log(`Server geodata-app listening on ${port}`);
});

