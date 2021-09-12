require("dotenv").config();
const express = require("express");
const cors = require("cors");
var bodyParser = require("body-parser");
const mongoose = require("mongoose");
const urlSchema = require("./UrlSchema");
const dns = require("dns");
const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const Url = mongoose.model("Url", urlSchema);
app.use(cors());

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.get("/api/hello", function (req, res) {
  res.json({ greeting: "hello API" });
});

app.post("/api/shorturl", async (req, res) => {
  const { url } = req.body;
  const urlObject = new URL(url);
  const validUrl =
    urlObject.protocol === "https:"
      ? await new Promise((resolve, reject) => {
          dns.lookup(urlObject.hostname, (error) => {
            if (error && error.code === "ENOTFOUND") {
              return resolve(false);
            }
            return resolve(true);
          });
        })
      : false;

  if (!validUrl) {
    return res.json({ error: "invalid url" });
  }

  const newUrl = await new Promise((resolve, reject) => {
    new Url({
      originalUrl: url,
    }).save((err, mongoUrl) => {
      if (err) return reject(err);
      resolve(mongoUrl);
    });
  });

  return res.json({ original_url: url, short_url: newUrl.id });
});

app.get("/api/shorturl/:shortUrl", async (req, res) => {
  const url = await Url.findById(req.params.shortUrl).exec();
  res.redirect(url.originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
