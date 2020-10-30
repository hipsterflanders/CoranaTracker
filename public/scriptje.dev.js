"use strict";

var svg = null;
var width = 450;
var height = 450;
var margin = 40; // The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.

var radius = Math.min(width, height) / 2 - margin;
var path = null;
var vlam = null;
window.addEventListener('load', function (event) {
  path = tekenLont(1);
  vlam = tekenVlam(100, 100);
  updateNumbers();
  path.setAttribute("d", updateLont(ratio));
  document.getElementById("bom").appendChild(path);
  document.getElementById("bom").appendChild(vlam);
});
var maxIntensive = 2293;
var ratio = 1;

function getNumbers() {
  var response, jsonData;
  return regeneratorRuntime.async(function getNumbers$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(fetch('/corona'));

        case 2:
          response = _context.sent;
          _context.next = 5;
          return regeneratorRuntime.awrap(response.json());

        case 5:
          jsonData = _context.sent;
          document.getElementById("aantalintensieve").textContent = jsonData.belintensive;
          document.getElementById("maximumcapaciteit").textContent = maxIntensive.toString();
          document.getElementById("overleden").textContent = jsonData.beloverleden; // Create data

          ratio = 1 - jsonData.belintensive / maxIntensive; //console.log(ratio);

        case 10:
        case "end":
          return _context.stop();
      }
    }
  });
}

var t = 0;

function updateNumbers() {
  t++;

  if (t > 10) {
    getNumbers();
    t = 0;
  }

  path.setAttribute("d", updateLont(ratio));
  vlam.setAttribute("d", updateVonk(gx, gy));
  setTimeout(updateNumbers, 100);
}

function tekenLont(ratio) {
  var path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "white");
  path.setAttribute("stroke-width", "50");
  path.setAttribute("stroke-linecap", "round");
  path.setAttribute("d", updateLont(ratio));
  return path;
}

function tekenVlam(cx, cy) {
  var vpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  vpath.setAttribute("fill", "orange");
  vpath.setAttribute("stroke", "none");
  return vpath;
}

function updateVonk(cx, cy) {
  var np = 16;
  var hoek = 2 * Math.PI / np;
  var x = cx + Math.cos(hoek * i) * 50;
  var y = cy + Math.sin(hoek * i) * 50;
  var r = 50;
  var dr = 20;
  var d = "M".concat(cx, " ").concat(cy);

  for (var i = 0; i < np + 1; i++) {
    x = cx + Math.cos(hoek * i) * (r + i % 2 * (dr + Math.random() * 50));
    y = cy + Math.sin(hoek * i) * (r + i % 2 * (dr + Math.random() * 50));
    d += " L" + x + " " + y;
  }

  return d;
}

var gx = 620;
var gy = 80;

function updateLont(ratio) {
  var lengte = Math.round(ratio * 100);
  var dx = 20;
  var dy = -20;
  gx = 620;
  gy = 80;
  var dh = 0;
  var d = "M620 80";

  for (var i = 0; i < lengte; i++) {
    dh += -0.05 + Math.random() * 0.1;
    dy = Math.sin(dh) * 5;
    dx = Math.cos(dh) * 5;
    gx += dx;
    gy += dy;
    d += " L" + gx + " " + gy;
  }

  return d;
}