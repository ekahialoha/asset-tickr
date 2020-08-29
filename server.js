require('dotenv').config();
const express = require('express');
const path = require('path');
const ws = require('ws');

const PORT = process.env.PORT || 3001;

const app = express();
require('express-ws')(app);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));
}

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build/index.html'))
});

app.listen(PORT, () => {
  console.log(`SERVER running on port ${PORT}`);
})
