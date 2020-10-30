"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var express = require("express");
var Datastore = require("nedb");
var fetch = require("node-fetch");
var app = express();
require('dotenv').config();
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log("Starting server at " + port); });
app.use(express.static('public'));
app.use(express.json({ limit: '1Gb' }));
var database = new Datastore('database.db');
database.loadDatabase();
get_sciensano_ICU_Data();
get_sciensano_MORT_Data();
setInterval(function () {
    get_sciensano_ICU_Data();
    get_sciensano_MORT_Data();
}, 360000);
app.get('/corona', function (request, response) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        response.json({ beloverleden: total_dead, belintensive: total_in_ICU });
        return [2 /*return*/];
    });
}); });
var total_in_ICU = 0;
var total_dead = 0;
function get_sciensano_ICU_Data() {
    return __awaiter(this, void 0, void 0, function () {
        var sciensano_ICU_response, sciensano_ICU_json, d, todays_date, i, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://epistat.sciensano.be/Data/COVID19BE_HOSP.json")];
                case 1:
                    sciensano_ICU_response = _a.sent();
                    return [4 /*yield*/, sciensano_ICU_response.json()];
                case 2:
                    sciensano_ICU_json = _a.sent();
                    d = new Date();
                    todays_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1);
                    total_in_ICU = 0;
                    i = sciensano_ICU_json.length - 1;
                    while (sciensano_ICU_json[i].DATE == todays_date) {
                        total_in_ICU += parseInt(sciensano_ICU_json[i].TOTAL_IN_ICU, 10);
                        i--;
                    }
                    console.log("ICU number is: " + total_in_ICU + " updated on " + todays_date);
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    console.error();
                    ("Fetching COVID19BE_HOSP.json failed because: " + err_1.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function get_sciensano_MORT_Data() {
    return __awaiter(this, void 0, void 0, function () {
        var sciensano_MORT_response, sciensano_MORT_json, d, todays_date, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, fetch("https://epistat.sciensano.be/Data/COVID19BE_MORT.json")];
                case 1:
                    sciensano_MORT_response = _a.sent();
                    return [4 /*yield*/, sciensano_MORT_response.json()];
                case 2:
                    sciensano_MORT_json = _a.sent();
                    total_dead = 0;
                    sciensano_MORT_json.forEach(function (element) {
                        total_dead += parseInt(element.DEATHS, 10);
                    });
                    d = new Date();
                    todays_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1);
                    console.log("Deathtoll number is: " + total_dead + " updated on " + todays_date);
                    return [3 /*break*/, 4];
                case 3:
                    err_2 = _a.sent();
                    console.error();
                    ("Fetching COVID19BE_MORT.json failed because: " + err_2.message);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
