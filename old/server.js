const express = require("express");
const app = express();
const server = require("http").createServer(app);
const fse = require("fs-extra");
const LZUTF8 = require("lzutf8");
const fs = require("fs");

app.use(express.static("public"));

let index = String(fse.readFileSync("public/index.html"));

let indexS = "";
let indexa = index.split("<!--$-->");
indexa.forEach((i) => {
  if (indexa.indexOf(i) % 2 == 0) indexS += i;
});

let indexF = "";
let indexA = indexS.split("//$//");
indexA.forEach((i) => {
  if (indexA.indexOf(i) % 2 == 0) indexF += i;
});

fse.writeFileSync("public/offline.html", indexF);

app.get("/save", function (request, response) {
  response.sendFile(__dirname + "/public/offline.html");
});
app.get("/board/*", function (request, response) {
  if (request.headers.origin)
    response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  response.sendFile(__dirname + "/boards/" + request.path.split("/board/")[1] + ".json");
});

const listener = server.listen(process.env.PORT, function () {
  console.log("Your app is listening on port " + listener.address().port);
});

const io = require("socket.io")(server);

io.on("connection", (socket) => {
  console.log("Socket connected!");
  socket.on("message", (m) => {
    io.sockets.emit("incomingMessage", m);
  });
  socket.on("canvas", (c) => {
    io.sockets.emit("incomingCanvas", c);
  });
  socket.on("connecc", (r) => {
    io.sockets.emit("request", r);
    console.log("Connect");
  });
  socket.on("accept", (r) => {
    io.sockets.emit("accepted", r);
    console.log("Accept");
  });
  socket.on("export", (d) => {
    let ID = d.id;
    let data = d.toExport;
    let compressed = LZUTF8.compress(JSON.stringify(data), {
      outputEncoding: "StorageBinaryString",
    });
    fse.outputFile("boards/" + ID + ".json", compressed);
    console.log("Created file boards/" + ID + ".json!");
  });
  socket.on("import", (d) => {
    let toGet = d.fetch;
    let callback = d.callback;
    console.log(callback);
    let returned;
    try {
      returned = JSON.parse(
        LZUTF8.decompress(String(fs.readFileSync("./boards/" + toGet + ".json")))
      );
    } catch (e) {
      console.error(e);
    }
    console.log(returned + "e");
    callback(returned);
  });
});
