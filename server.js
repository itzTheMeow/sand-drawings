const express = require("express");

const config = require("./config.json");
const app = express();

app.use(express.static(__dirname + "/site"));

app.listen(config.port, () => {
  console.log("Sand Drawings is online and listening on port " + config.port);
});
