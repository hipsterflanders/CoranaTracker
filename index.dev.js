"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var tslib_1 = require("tslib");

var express = require("express");

var Datastore = require("nedb");

var fetch = require("node-fetch");

var app = express();

require('dotenv').config();

var port = Number.parseInt(process.env.PORT) || 3000;
app.listen(port, function () {
  return console.log("Starting server at ".concat(port));
});
app.use(express["static"]('public'));
app.use(express.json({
  limit: '1Gb'
}));
var database = new Datastore('database.db');
database.loadDatabase();
get_sciensano_ICU_Data();
get_sciensano_MORT_Data();
setInterval(function () {
  get_sciensano_ICU_Data();
  get_sciensano_MORT_Data();
}, 60 * 60 * 1000);
app.get('/corona', function (request, response) {
  return tslib_1.__awaiter(void 0, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee() {
    var covidata;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            covidata = {
              beloverleden: total_dead,
              belintensive: total_in_ICU
            };
            response.json(covidata);

          case 2:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
});
var total_in_ICU = 0;
var total_dead = 0;

function get_sciensano_ICU_Data() {
  return tslib_1.__awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2() {
    var sciensano_ICU_response, sciensano_ICU_json, d, todays_date, i;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            _context2.next = 3;
            return fetch("https://epistat.sciensano.be/Data/COVID19BE_HOSP.json", {
              method: 'GET'
            });

          case 3:
            sciensano_ICU_response = _context2.sent;
            _context2.next = 6;
            return sciensano_ICU_response.json();

          case 6:
            sciensano_ICU_json = _context2.sent;
            d = new Date();
            todays_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() < 10 ? "0" : "") + (d.getDate() - 1);
            total_in_ICU = 0;
            i = sciensano_ICU_json.length - 1;

            while (sciensano_ICU_json[i].DATE == todays_date) {
              total_in_ICU += parseInt(sciensano_ICU_json[i].TOTAL_IN_ICU, 10);
              i--;
            }

            console.log("ICU number is: " + total_in_ICU + " updated on " + todays_date);
            _context2.next = 19;
            break;

          case 15:
            _context2.prev = 15;
            _context2.t0 = _context2["catch"](0);
            console.error();
            "Fetching COVID19BE_HOSP.json failed because: " + _context2.t0.message;

          case 19:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[0, 15]]);
  }));
}

function get_sciensano_MORT_Data() {
  return tslib_1.__awaiter(this, void 0, void 0,
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3() {
    var sciensano_MORT_response, sciensano_MORT_json, d, todays_date;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return fetch("https://epistat.sciensano.be/Data/COVID19BE_MORT.json", {
              method: 'GET'
            });

          case 3:
            sciensano_MORT_response = _context3.sent;
            _context3.next = 6;
            return sciensano_MORT_response.json();

          case 6:
            sciensano_MORT_json = _context3.sent;
            total_dead = 0;
            sciensano_MORT_json.forEach(function (element) {
              total_dead += parseInt(element.DEATHS, 10);
            });
            d = new Date();
            todays_date = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + (d.getDate() - 1);
            console.log("Deathtoll number is: " + total_dead + " updated on " + todays_date);
            _context3.next = 18;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](0);
            console.error();
            "Fetching COVID19BE_MORT.json failed because: " + _context3.t0.message;

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[0, 14]]);
  }));
}