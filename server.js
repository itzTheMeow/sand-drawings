const express = require("express");
const sass = require("sass");

const config = require("./config.json");
const app = express();

let priorityStyle = "";
let allStyle = "";
fs.readdirSync(__dirname + "/../client/css").forEach((css) => {
  let compiled = sass.renderSync({ file: `${__dirname}/../client/css/${css}` });
  if (css.startsWith("_")) priorityStyle += String(`${compiled.css}\n`);
  else allStyle += String(`${compiled.css}\n`);
});
priorityStyle = priorityStyle.replace(/;\n/g, " !important;\n");
if (allStyle) fs.writeFileSync("client/compiled.css", `${allStyle}\n${priorityStyle}`);
else console.error("No css.");

app.use(express.static(__dirname + "/site"));

app.listen(config.port, () => {
  console.log("Sand Drawings is online and listening on port " + config.port);
});
