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

get_sciensano_ICU_Data();
get_sciensano_MORT_Data();
setInterval(() => {
    get_sciensano_ICU_Data();
    get_sciensano_MORT_Data();
}, 360000);

app.get('/corona', async (request, response) => {
    response.json({beloverleden:total_dead, belintensive:total_in_ICU});
});

var total_in_ICU = 0;
var total_dead = 0;

async function get_sciensano_ICU_Data() {
    try {
        const sciensano_ICU_response = await fetch("https://epistat.sciensano.be/Data/COVID19BE_HOSP.json");
        const sciensano_ICU_json = await sciensano_ICU_response.json();

        var d = new Date();
        todays_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1);
        total_in_ICU = 0;
        var i = sciensano_ICU_json.length - 1;

        while (sciensano_ICU_json[i].DATE == todays_date) {
            total_in_ICU += parseInt(sciensano_ICU_json[i].TOTAL_IN_ICU, 10);
            i--;
        }

        console.log("ICU number is: " + total_in_ICU + " updated on " + todays_date);

    } catch (err) {
        console.error(); ("Fetching COVID19BE_HOSP.json failed because: " + err.message);
    }
}

async function get_sciensano_MORT_Data() {
    try {
        const sciensano_MORT_response = await fetch("https://epistat.sciensano.be/Data/COVID19BE_MORT.json");
        const sciensano_MORT_json = await sciensano_MORT_response.json();

        total_dead = 0;

        sciensano_MORT_json.forEach(element => {
            total_dead += parseInt(element.DEATHS, 10);
        });

        console.log("Deathtoll number is: " + total_dead + " updated on " + todays_date);

    } catch (err) {
        console.error(); ("Fetching COVID19BE_MORT.json failed because: " + err.message);
    }
}