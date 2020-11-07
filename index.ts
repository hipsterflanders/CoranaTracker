import express = require('express');
import fs = require('fs');
import Datastore = require('nedb');
import fetch = require('node-fetch');
import corona = require('./corona');
const app = express();
require('dotenv').config();

const port:number = Number.parseInt(process.env.PORT) || 3000;
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
}, 10*1000); // update each hour

interface CovidData {
    beloverleden:number;
    belintensive:number;
}

app.get('/corona', async (request, response) => {
    const covidata:CovidData = {beloverleden:total_dead, belintensive:total_in_ICU}
    response.json(covidata);
});

var total_in_ICU:number = 0;
var total_dead:number = 0;

async function get_sciensano_ICU_Data() {
    try {
        const sciensano_ICU_response = await fetch("https://epistat.sciensano.be/Data/COVID19BE_HOSP.json",{method:'GET'});
        const sciensano_ICU_json = await sciensano_ICU_response.json();

        var d:Date = new Date();
        let todays_date:String = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate()<10?"0":"") + (d.getDate() - 1);
        total_in_ICU = 0;
        let i:number = sciensano_ICU_json.length - 1;

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
        const sciensano_MORT_response = await fetch("https://epistat.sciensano.be/Data/COVID19BE_MORT.json",{method:'GET'});
        const sciensano_MORT_json = await sciensano_MORT_response.json();

        total_dead = 0;

        sciensano_MORT_json.forEach(element => {
            total_dead += parseInt(element.DEATHS, 10);
        });

        let d:Date = new Date();
        let todays_date:string = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1);
        console.log("Deathtoll number is: " + total_dead + " updated on " + todays_date);

    } catch (err) {
        console.error(); ("Fetching COVID19BE_MORT.json failed because: " + err.message);
    }
}