require('dotenv').config();
const express = require('express');
const path = require('path');
const ws = require('ws');

const PORT = process.env.PORT || 3001;

const app = express();
require('express-ws')(app);

const symbols = {};
let client = null;

const socketClient = new ws(`wss://ws.finnhub.io?token=${process.env.FIN_API_KEY}`);
socketClient.addEventListener('open', () => {
  console.log('Connected to remote WebSocket');
});

const subscribe = (symbol) => {

};

const unsubscribe = (symbol) => {

};

const unsubscribeAll = () => {

};

socketClient.addEventListener('message', event => {

});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
}

app.get('/api/subscribe/:symbol', (req, res) => {

});

app.get('/api/unsubscribe/all', (req, res) => {

});

app.get('/api/unsubscribe/:symbol', (req, res) => {

});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
});

app.listen(PORT, () => {
  console.log(`SERVER running on port ${PORT}`);
})
