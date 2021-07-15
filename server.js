const express = require("express");

const config = require("./config.json");
const app = express();

app.get("/", (req, res) => {
  res.send("ok");
});

app.listen(config.port, () => {
  console.log("Sand Drawings is online and listening on port " + config.port);
});
