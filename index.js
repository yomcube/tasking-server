#!/usr/bin/env node
const port = 8000;
const accountdir = 'accounts/'
const fs = require('fs');
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/', (req, res, next) => {
	console.log(req.method + " '" + req.originalUrl + "'");
	next();
});

app.use('/', (req, res) => {
	res.set('Content-Type', 'text/plain');
	res.end('test');
});
app.use('/signup', (req, res) => {
	if (req.method != 'POST') {res.status(501).end(); return;}
	if (!req.body.username || !req.body.password) {
		res.set('Content-Type', 'text/plain');
		res.status(400).end('must have both username and password parameters');
		return;
	}
	fs.writeFile(accountdir + req.username + '/pass', req.password, (err) => {
		if (err) {throw err; res.status(500).end('Something went wrong.'); return;}
		else res.status(201).end('200 Created');
	});
});
app.use('/login', (req, res) => {
	if (req.method != 'POST') {res.status(501).end(); return;}
	if (!req.body.username || !req.body.password) {res.set('Content-Type', 'text/plain');
		res.status(400).end('must have both username and password parameters');
		return;
	}
	fs.readFile(accountdir + req.username + '/pass', (err, data) => {
		if (err) {throw err; res.status(500).end('Something went wrong.'); return;}
		if (req.password.toString() == data) {
			req.session.user = req.body.username;
			res.status(200).end('200 OK');
			return;
		}
		res.status(400).end();
	});
});
app.listen(8000);