#!/usr/bin/env node
const port = 8000;

const express = require('express');
const app = express();

app.get('/', (req, res) => {
	res.set('Content-Type', 'text/plain');
    res.end('test');
});
app.listen(8000);