const fs = require("fs");
const express = require("express");
const sass = require("sass");

const config = require("./config.json");
const app = express();

let priorityStyle = "";
let allStyle = "";
fs.readdirSync(__dirname + "/site/css").forEach((css) => {
  let compiled = sass.renderSync({ file: `${__dirname}/site/css/${css}` });
  if (css.startsWith("_")) priorityStyle += String(`${compiled.css}\n`);
  else allStyle += String(`${compiled.css}\n`);
});
priorityStyle = priorityStyle.replace(/;\n/g, " !important;\n");
if (allStyle) fs.writeFileSync("site/style.css", `${allStyle}\n${priorityStyle}`);
else console.error("No css.");

app.use(express.static(__dirname + "/site"));

console.log("Building...");
require("esbuild")
  .build({
    entryPoints: ["src/script.ts"],
    bundle: true,
    outfile: "site/script.js",
    watch: true,
  })
  .then(() => {
    console.log("Built!");
    app.listen(config.port, () => {
      console.log("Sand Drawings is online and listening on port " + config.port);
    });
  });
