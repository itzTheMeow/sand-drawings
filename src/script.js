import Game from "./game";

let mobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
    navigator.userAgent
  );
if (mobile) alert("This game has semi-support for mobile. Proceed with caution.");

window.test = new Game();
//$//
var socket = io();
var accept;
var msgAuthor = "Unknown";
var connected;
var connectedData = { name: "Unknown" };
//$//

var tool = (t) => {
  test.mouse.tool = t;
};

var emitMessage = (content, name) => {
  document.getElementById("msgs").innerHTML += "<b>" + name + ":</b> " + content + "<br>";
  document.getElementById("msgs").scrollTop = 9999;
};
//$//
var emitGlobalMessage = (content, name) => {
  document.getElementById("global-msgs").innerHTML += "<b>" + name + ":</b> " + content + "<br>";
  document.getElementById("global-msgs").scrollTop = 9999;
};
var connect = (id) => {
  id = id || prompt("Enter the ID of the user to connect to.");
  socket.emit("connecc", { to: id, name: msgAuthor, from: test.id });
  console.log("Request sent to " + id);
  emitMessage("Sent an invite to " + id + "!", "System");
};

var exp = () => {
  let URLID = String(Math.random().toFixed(7).split(".")[1]);
  let URL = "https://sand-drawings.glitch.me/board/" + URLID;
  socket.emit("export", { toExport: test.grid, id: URLID });
  emitMessage('Your export data can be found at <a href="' + URL + '">this link<a>.', "System");
};
var imp = () => {
  let URL = prompt("Enter the export URL or code you were given.");
  if (!URL.includes("https://")) URL = "https://sand-drawings.glitch.me/board/" + URL;
  fetch(URL)
    .then((res) => res.text())
    .then((d) => {
      if (!d.startsWith("[")) {
        test.grid = JSON.parse(
          LZUTF8.decompress(d, {
            inputEncoding: "StorageBinaryString",
          })
        );
      } else {
        test.grid = JSON.parse(d);
      }
    });
};

var showGlobal = () => {
  let disp = document.getElementById("global-chat").style.display;
  if (disp == "none") {
    document.getElementById("global-chat").style.display = "block";
    if (msgAuthor == "Unknown") msgAuthor = prompt("Chat Username?") || "Unknown";
    document.getElementById("global-send").select();
  } else {
    document.getElementById("global-chat").style.display = "none";
  }
};

socket.on("incomingMessage", (message) => {
  if (message.global) {
    document.getElementById("global-preview").innerHTML = message.content;
    emitGlobalMessage(message.content, message.author.name);
  } else if (message.author.id == test.id || message.author.id == connected) {
    emitMessage(message.content, message.author.name);
  }
});
socket.on("incomingCanvas", (c) => {
  if (c.to == test.id) {
    document.getElementById("otherCanvas").src = c.img;
  }
});
setInterval(function () {
  socket.emit("canvas", {
    img: test.canvas.toDataURL("image/png"),
    id: test.id,
    to: connected || "0",
  });
}, 100);
socket.on("accepted", (d) => {
  if (d.to == test.id) {
    if (d.deny) return emitMessage(d.name + " denied your invite.", "System");
    emitMessage("User " + d.name + " has accepted your game invite!", "System");
    connected = d.id;
    document.getElementById("send").placeholder = "Send a Message to " + d.name;
  } else if (d.id == test.id && !d.deny) {
    emitMessage("Accepted!", "System");
    connected = d.to;
    document.getElementById("send").placeholder = "Send a Message to " + d.fromName;
  }
});
socket.on("request", (d) => {
  console.log("Request");
  if (d.to !== test.id) return;
  emitMessage(
    '<a href="javascript:accept(true)">Accept user ' +
      d.name +
      '\'s invite?</a> <a href="javascript:accept(false)">Decline?</a>',
    "System"
  );
  accept = (decl) => {
    if (decl) {
      socket.emit("accept", {
        id: test.id,
        to: d.from,
        name: msgAuthor,
        fromName: d.name,
      });
    } else {
      socket.emit("accept", {
        id: test.id,
        to: d.from,
        name: msgAuthor,
        fromName: d.name,
        deny: true,
      });
    }
  };
});
//$//
document.getElementById("id").innerHTML = test.id;
//$//
document.getElementById("join").href += test.id;

document.getElementById("send").addEventListener("click", function (e) {
  if (msgAuthor == "Unknown") msgAuthor = prompt("Chat Username?") || "Unknown";
});
document.getElementById("global-send").addEventListener("click", function (e) {
  if (msgAuthor == "Unknown") msgAuthor = prompt("Chat Username?") || "Unknown";
});

document.getElementById("send").addEventListener("keyup", function (e) {
  if (e.key !== "Enter") return;
  let v = document.getElementById("send").value.replace(/\n/g, "");
  if (!v) return;
  document.getElementById("send").value = "";
  socket.emit("message", {
    author: { id: test.id, name: msgAuthor },
    content: v,
    to: connected || "0",
  });
});
document.getElementById("global-send").addEventListener("keyup", function (e) {
  if (e.key !== "Enter") return;
  let v = document.getElementById("global-send").value.replace(/\n/g, "");
  if (!v) return;
  document.getElementById("global-send").value = "";
  socket.emit("message", {
    author: { id: test.id, name: msgAuthor },
    content: v,
    global: true,
  });
});

if (window.location.href.split("#")[1]) connect(window.location.href.split("#")[1]);

let kong = window.location.href.includes("kongregate_username=");

//$//

document.addEventListener("keyup", function (e) {
  if (e.key == "Tab") {
    let g = document.getElementById("game");
    if (g.style.cursor == "none") {
      g.style.cursor = "crosshair";
    } else {
      g.style.cursor = "none";
    }
  }
});
