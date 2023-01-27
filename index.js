#!/usr/bin/env node
const port = 8000;
const accountdir = 'accounts/'
const pagetoredirect = "https://yomcube.github.io/tasking";
const fs = require('fs');
const cookieSession = require('cookie-session');
const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use('/', (req, res, next) => {
	console.log(req.method + " '" + req.originalUrl + "'");
	next();
});

app.use('/', (req, res) => {
	res.set('Content-Type', 'text/plain');
	res.redirect(pagetoredirect);
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
		else res.redirect(pagetoredirect);
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
			res.redirect(pagetoredirect);
			return;
		}
		res.status(400).end();
	});
});
app.use('/logout', (req, res) => {
	req.session = null;
});
app.listen(8000);