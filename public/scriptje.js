var svg = null;

const width = 450
const height = 450
const margin = 40;

// The radius of the pieplot is half the width or half the height (smallest one). I subtract a bit of margin.
var radius = Math.min(width, height) / 2 - margin

var path = null;
var vlam = null;
var explosie = null;
window.addEventListener('load', (event) => {
    path = tekenLont(1);
    vlam = tekenVlam(100, 100);
    path.setAttribute("d", updateLont(ratio));
    document.getElementById("bom").appendChild(path);
    document.getElementById("bom").appendChild(vlam);
    explosie = tekenOntploffing();
    document.getElementById("explosie").appendChild(explosie);

    updateNumbers();
});

const maxIntensive = 2293;
var ratio = 1;

async function getNumbers() {

    const response = await fetch('/corona');
    const jsonData = await response.json();

    document.getElementById("aantalintensieve").textContent = jsonData.belintensive;
    document.getElementById("maximumcapaciteit").textContent = maxIntensive.toString();
    document.getElementById("overleden").textContent = jsonData.beloverleden;

    // Create data
    ratio = 1 - jsonData.belintensive / maxIntensive;
    //console.log(ratio);
}


var t = 0;

function updateNumbers() {
    t++;
    if (t > 10) {
        getNumbers();
        t = 0;
    }

    if (false) {
        path.setAttribute("d", updateLont(ratio));
        vlam.setAttribute("d", updateVonk(gx, gy));
    } else {
        explosieSVG = document.getElementById("explosie");
        explosieSVG.setAttribute("display", "block");
        explosie.setAttribute("d", updateExplosie(gx, gy));
        document.getElementById("bom").setAttribute("display", "none");
    }


    setTimeout(updateNumbers, 100);
}

function tekenLont(ratio) {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "white");
    path.setAttribute("stroke-width", "50");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("d", updateLont(ratio));
    return path;
}


function tekenVlam(cx, cy) {
    const vpath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    vpath.setAttribute("fill", "orange");
    vpath.setAttribute("stroke", "none");

    return vpath;
}

function tekenOntploffing() {
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("fill", "orange");
    path.setAttribute("stroke", "none");
    return path;
}

function updateExplosie(cx, cy) {
    const np = 16;
    const hoek = 2 * Math.PI / np;
    var x = cx + Math.cos(hoek * i) * 50;
    var y = cy + Math.sin(hoek * i) * 50;
    const r = 50;
    const dr = 20;

    var d = `M${cx} ${cy}`;
    for (var i = 0; i < np + 1; i++) {

        x = cx + Math.cos(hoek * i) * (r + i % 2 * (dr + Math.random() * 50));
        y = cy + Math.sin(hoek * i) * (r + i % 2 * (dr + Math.random() * 50));
        d += " L" + x + " " + y;
    }
    return d;
}

function updateVonk(cx, cy) {
    const np = 16;
    const hoek = 2 * Math.PI / np;
    var x = cx + Math.cos(hoek * i) * 50;
    var y = cy + Math.sin(hoek * i) * 50;
    const r = 50;
    const dr = 20;

    var d = `M${cx} ${cy}`;
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
    const lengte = Math.round(ratio * 100);
    var dx = 20;
    var dy = -20;
    gx = 620;
    gy = 80;

    var dh = 0;

    var d = "M620 80";
    for (let i = 0; i < lengte; i++) {
        dh += -0.05 + Math.random() * 0.1;
        dy = Math.sin(dh) * 5;
        dx = Math.cos(dh) * 5;
        gx += dx;
        gy += dy;
        d += " L" + gx + " " + gy;
    }

    return d;
}