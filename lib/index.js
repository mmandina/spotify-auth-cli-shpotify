const open = require('open');
const express = require('express');
const chalk = require('chalk');
const argv = require('minimist')(process.argv.slice(2));
const clipboardy = require('clipboardy');
//add read file to read from .shpotify.config
const PORT = 8888;
const CLIENT_ID = '8497040e2d85405b8c5bee9ffcbcda3f';
const SHOW_DIALOG = argv.showDialog || false;
const SCOPE = 'user-library-modify';

const REDIRECT_URI = 'http://localhost:' + PORT + '/callback';
console.log('new version');
const URL =
  'https://accounts.spotify.com/authorize' +
  '?client_id=' +
  CLIENT_ID +
  '&response_type=token' +
  '&scope=' +
  SCOPE +
  '&show_dialog=' +
  SHOW_DIALOG +
  '&redirect_uri=' +
  REDIRECT_URI;

const app = express();

app.get('/callback', (req, res) => {
  res.sendFile(__dirname + '/callback.html');
  if (req.query.error) {
    console.log(chalk.red('Something went wrong. Error: '), req.query.error);
  }
});

app.get('/token', (req, res) => {
  res.sendStatus(200);
  const token = req.query.access_token;
  console.log(req.query);
  if (token) {
    clipboardy.writeSync(token);
    console.log(chalk.green('Your token is: '), chalk.bold(token));
    console.log('(It has been copied to your clipboard)');
  }

  process.exit();
});

const main = () => {
  app.listen(PORT, () => {
    console.log(
      chalk.blue('Opening the Spotify Login Dialog in your browser...')
    );
    open(URL);
  });
};

module.exports = main;
