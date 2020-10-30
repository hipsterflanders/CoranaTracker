"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const express = require("express");
const http = require("http");
const Datastore = require("nedb");
const fetch = require("node-fetch");
const app = express();
require('dotenv').config();
const server = http.createServer(app);
const port = Number.parseInt(process.env.PORT) || 3000;
server.listen(port, () => console.log(`Starting server at ${port}`));
app.use(express.static('public'));
app.use(express.json({ limit: '1Gb' }));
var database = new Datastore('database.db');
database.loadDatabase();
get_sciensano_ICU_Data();
get_sciensano_MORT_Data();
setInterval(() => {
    get_sciensano_ICU_Data();
    get_sciensano_MORT_Data();
}, 360000000);
app.get('/corona', (request, response) => tslib_1.__awaiter(void 0, void 0, void 0, function* () {
    const covidata = { beloverleden: total_dead, belintensive: total_in_ICU };
    response.json(covidata);
}));
var total_in_ICU = 0;
var total_dead = 0;
function get_sciensano_ICU_Data() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const sciensano_ICU_response = yield fetch("https://epistat.sciensano.be/Data/COVID19BE_HOSP.json", { method: 'GET' });
            const sciensano_ICU_json = yield sciensano_ICU_response.json();
            var d = new Date();
            let todays_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1);
            total_in_ICU = 0;
            var i = sciensano_ICU_json.length - 1;
            while (sciensano_ICU_json[i].DATE == todays_date) {
                total_in_ICU += parseInt(sciensano_ICU_json[i].TOTAL_IN_ICU, 10);
                i--;
            }
            console.log("ICU number is: " + total_in_ICU + " updated on " + todays_date);
        }
        catch (err) {
            console.error();
            ("Fetching COVID19BE_HOSP.json failed because: " + err.message);
        }
    });
}
function get_sciensano_MORT_Data() {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            const sciensano_MORT_response = yield fetch("https://epistat.sciensano.be/Data/COVID19BE_MORT.json", { method: 'GET' });
            const sciensano_MORT_json = yield sciensano_MORT_response.json();
            total_dead = 0;
            sciensano_MORT_json.forEach(element => {
                total_dead += parseInt(element.DEATHS, 10);
            });
            let d = new Date();
            let todays_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1);
            console.log("Deathtoll number is: " + total_dead + " updated on " + todays_date);
        }
        catch (err) {
            console.error();
            ("Fetching COVID19BE_MORT.json failed because: " + err.message);
        }
    });
}
