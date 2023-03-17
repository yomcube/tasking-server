#!/usr/bin/env node
/* Change the port if needed */
const port = 8000;
const accountdir = 'accounts/'
const redirectpage = "https://yomcube.github.io/tasking";
const wrongparammsg = 'must have both username and password parameters';

const fs = require('fs');
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use('/', (req, res, next) => {
	console.log(`${req.method} ${req.originalUrl}`);
	next();
});

app.use('/', (req, res) => {
	res.redirect(redirectpage);
});
app.use('/signup', (req, res) => {
	if (req.method != 'POST') {res.set('Allow', 'POST'); res.status(405).end(); return;}
	if (!req.body.username || !req.body.password) {
		res.status(400).end(wrongparammsg);
		return;
	}
	fs.writeFile(accountdir + req.username + '/pass', req.password, (err) => {
		if (err) {throw err; res.status(500).end('Something went wrong.');}
		else res.redirect(redirectpage);
	});
});
app.use('/login', (req, res) => {
	if (req.method != 'POST') {res.set('Allow', 'POST'); res.status(405).end(); return;}
	if (!req.body.username || !req.body.password) {
		res.status(400).end(wrongparammsg);
		return;
	}
	fs.readFile(accountdir + req.username + '/pass', (err, data) => {
		if (err) {throw err; res.status(500).end('Something went wrong.'); return;}
		if (req.password.toString() == data) {
			req.session.user = req.body.username;
			res.redirect(redirectpage);
			return;
		}
		else {
			res.status(400).end('Wrong password!');
			return;
		}
	});
});
app.use('/logout', (req, res) => {
	req.session = null;
});
app.listen(port);