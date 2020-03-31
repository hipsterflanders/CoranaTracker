const firebase = require('firebase');

var firebaseConfig = {
    apiKey: "AIzaSyBQq5XqIic6IBI94xOg0nmKxlfXzqZ_dGI",
    authDomain: "api-project-7429617504.firebaseapp.com",
    databaseURL: "https://api-project-7429617504.firebaseio.com",
    projectId: "api-project-7429617504",
    storageBucket: "api-project-7429617504.appspot.com",
    messagingSenderId: "7429617504",
    appId: "1:7429617504:web:2624dd81de4ffeb5af1005"
};
firebase.initializeApp(firebaseConfig);

var dbRef = firebase.database().ref().child('corona_bel');
dbRef.on('value', gotData);

var geinfecteerd = null;
var overleden = null;
var genezen = null;

var belGeinfecteerd = null;
var belOverleden = null;
var belGenezen = null;
var belHospital = null;
var belIntensive = null;
var belVerlaten = null;
var coranaData = null;

function gotData(data) {
    coranaData = data;
    //console.log(data);
    geinfecteerd = data.child('geinfecteerd').val();
    overleden = data.child('overleden').val();
    genezen = data.child('genezen').val();

    belGeinfecteerd = data.child('belgeinfecteerd').val();
    belOverleden = data.child('beloverleden').val();
    belGenezen = data.child('belgenezen').val();
    belHospital = data.child('belhospital').val();
    belIntensive = data.child('belintensive').val();
    belVerlaten = data.child('belverlaten').val();

    /*
    var overledenPerc = overleden;
    var genezenPerc = genezen;
    var geinfecteerdPerc = geinfecteerd;
    var belgieOverleden = belOverleden;
    var belgieGenezen = belGenezen;
    var belgieGeinfecteerd = belGeinfecteerd;
    var belgieHospital = belHospital;
    var belgieIntensive = belIntensive;
    var belgieVerlaten = belVerlaten;
    var overledenBar = (overledenPerc / geinfecteerdPerc) * 100;
    var genezenBar = (genezenPerc / geinfecteerdPerc) * 100;
    var combo = overledenBar + genezenBar;
    var rest = 100 - combo;
    */

    //console.log("infected: " + geinfecteerd);
    //console.log("overleden: " + belOverleden);
}

module.exports = {
    getData: function () {
        return coranaData;
    }
};