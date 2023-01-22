#!/usr/bin/env node
const port = 8000;
const fs = require('fs');
const express = require('express');
const app = express();

app.use('/', (req, res, next) => {
    console.log(req.method + " '" + req.originalUrl + "'");
    next();
});

app.get('/', (req, res) => {
	res.set('Content-Type', 'text/plain');
    res.end('test');
});
app.post('/signup', (req, res) => {
    // TODO: Add code here
    res.end();
});
app.listen(8000);