require('dotenv').config();
const express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const dns = require('dns');
const app = express();
app.use(bodyParser.urlencoded({extended: false}));
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', async (req, res) => {
  const { url } = req.body;
  const validUrl = await new Promise((resolve, reject) => {
    dns.lookup(url, error => {
      if (error && error.code === 'ENOTFOUND') {
        return resolve(false);
      }
      return resolve(true);
    });
  });

  if (!validUrl){
    return res.json({ error: 'invalid url' })
  }
  
});

app.get('/api/shorturl/:shortUrl', (req, res) => {
  res.redirect(req.params.shortUrl);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
