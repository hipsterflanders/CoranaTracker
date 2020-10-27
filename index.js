const express = require('express');
const fs = require('fs');
const app = express();
const Datastore = require('nedb');
const fetch = require('node-fetch');
const corona = require('./corona');
require('dotenv').config();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1Gb' }));

var database = new Datastore('database.db');
database.loadDatabase();

get_sciensanoData();
setInterval(() => {
    get_sciensanoData();
  }, 60000);

app.get('/corona', async (request, response) => {
    //response.json(corona.getData());
    response.json(total_in_ICU);
});

var total_in_ICU = {test:"no data from sciensno gotten"};

async function get_sciensanoData() {
    try{
        const sciensano_response = await fetch("https://epistat.sciensano.be/Data/COVID19BE_HOSP.json");
        const sciensano_json = await sciensano_response.json();
        total_in_ICU = sciensano_json;
    }catch(err){
        console.log("Fetching COVID19BE_HOSP.json failed"+err.message);
    }
}
