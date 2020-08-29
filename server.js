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
  if(Object.keys(symbols).length < 50 ) {
    socketClient.send(JSON.stringify({
      type: 'subscribe',
      symbol: symbol
    }));
    symbols[symbol] = 0;
  } else {
    throw 'Max symbols allow';
  }
};

const unsubscribe = (symbol) => {
  socketClient.send(JSON.stringify({
    type: 'unsubscribe',
    symbol: symbol
  }));
  delete symbols[symbol];
};

const unsubscribeAll = () => {
  Object.keys(symbols).map(symbol => unsubscribe(symbol));
};

socketClient.addEventListener('message', event => {

});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
}

app.get('/api/subscribe/:symbol', (req, res) => {
  const { symbol } = req.params;
  try {
    subscribe(symbol);
    res.json({
      subscribed: true,
      symbol: symbol
    });
  } catch {
    res.status(429).json({
      subscribed: false,
      error: 'Rate Limit Reached'
    });
  }
});

app.get('/api/unsubscribe/all', (req, res) => {
  unsubscribeAll();
  res.json({ unsubscribeAll: true });
});

app.get('/api/unsubscribe/:symbol', (req, res) => {
  const { symbol } = req.params;
  unsubscribe(symbol);
  res.json({
    unsubscribed: true,
    symbol: symbol
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
});

app.listen(PORT, () => {
  console.log(`SERVER running on port ${PORT}`);
})
