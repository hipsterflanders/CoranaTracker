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



app.get('/corona', async (request, response) => {
    response.json(corona.getData());   
});