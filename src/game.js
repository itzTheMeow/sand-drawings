"use strict";

import Auth from "./auth";
import Draw2D from "./draw2d";
import initDrags from "./drag";
import Mouse from "./mouse";
import Spawner from "./spawner";

Auth();

/*
 Elements
*/
var NONE = 0;
var WALL = 1;
var SAND = 2;
var WATER = 4;
var LIFE = 8;
var FIRE = 16;
var BURNING = 32;
var LAVA = 64;
var RESTING = 128;
var OIL = 256;
var GASOLINE = 512;
var DARK_MATTER = 1024;
var CONCRETE = 2048;
var STEAM = 4096;
var HARDENED_CONCRETE = 8192;
var SALT = 16384;
var SALT_WATER = 32768;
var WOOD = 65536;
var _____ = 131072;
var ____ = 262144;
var ___ = 524288;
var __ = 1048576;
var _ = 2097152;
var SPRING = WALL | WATER;
var OIL_WELL = WALL | OIL;
var LAVA = SAND | FIRE;
var GAS_PUMP = WALL | GASOLINE;
var VOLCANO = WALL | FIRE;

function Game() {
  this.canvas;
  this.context;
  this.mouse;
  this.draw2d;

  this.grid = [[]];
  this.particles = 0;
  // this.objects = [];
  this.spawners = [];
  this.spawners_on = true;
  this.updateDelay = 8;
  this.exportData = {};

  this.framesSinceLast = 0;
  this.fps = 0;
  this.fpsStart;
  this.term = "Legacy";
  this.ver = "1.4.2";
  this.id = String(Math.random()).split(".")[1];
  this.messagesCollapsed = false;
  this.chatTop = 0;
  this.chatLeft = 0;
  this.solidsTop = 0;
  this.solidsLeft = 0;
  this.spawnersTop = 0;
  this.spawnersLeft = 0;
  this.liquidsTop = 0;
  this.liquidsLeft = 0;

  // Type color
  this.type_color = {};

  this.materials = {
    space: {
      density: 0,
      CSS: { "background-color": "rgb(0, 0, 0)" },
      name: "Space",
      sound: "#",
    },
    wall: {
      color: [118, 118, 118],
      CSS: { "background-color": "rgb(118, 118, 118)" },
      name: "Wall",
      sound: "#",
    },
    wood: {
      color: [60, 36, 5],
      CSS: { "background-color": "rgb(60, 36, 5)" },
      name: "Wood",
      sound: "#",
    },
    sand: {
      color: [210, 180, 140],
      CSS: { "background-color": "rgb(210, 180, 140)" },
      density: 15,
      name: "Sand",
      sound:
        "#" ||
        new Audio(
          "https://cdn.glitch.com/940018fc-c2fe-427c-a43b-34505af82640%2FItem.SAND.FallingSound.wav?v=1577513079723"
        ),
    },
    salt: {
      color: [205, 215, 206],
      CSS: { "background-color": "rgb(205, 215, 206)" },
      density: 15,
      name: "Salt",
      sound: "#",
    },
    concrete: {
      color: [140, 140, 140],
      CSS: { "background-color": "rgb(140, 140, 140)" },
      density: 15,
      name: "Concrete",
      sound: "#",
    },
    water: {
      color: [52, 152, 219],
      CSS: { "background-color": "rgb(52, 152, 219)" },
      liquid: true,
      density: 5,
      name: "Water",
      sound: "#",
    },
    salt_water: {
      color: [52, 91, 219],
      CSS: { "background-color": "rgb(52, 91, 219)" },
      liquid: true,
      density: 7,
      name: "Salt Water",
      sound: "#",
    },
    life: {
      color: [46, 204, 113],
      CSS: { "background-color": "rgb(46, 204, 113)" },
      bColors: [230, 126, 34, 192, 57, 43],
      infect: true,
      name: "Life",
      sound: "#",
    },
    fire: {
      color: [231, 76, 60],
      CSS: { "background-color": "rgb(231, 76, 60)" },
      bColors: [230, 126, 34, 192, 57, 43],
      infect: true,
      name: "Fire",
      sound: "#",
    },
    burning: {
      color: [230, 126, 34],
      CSS: { "background-color": "rgb(230, 126, 34)" },
      bColors: [230, 126, 34, 192, 57, 43],
      infect: true,
      name: "Burning",
      sound: "#",
    },
    oil: {
      color: [139, 97, 42],
      CSS: { "background-color": "rgb(139, 97, 42)" },
      liquid: true,
      density: 4,
      name: "Oil",
      sound: "#",
    },
    gasoline: {
      color: [226, 230, 231],
      CSS: { "background-color": "rgb(226, 230, 231)" },
      liquid: true,
      density: 3,
      name: "Gasoline",
      sound: "#",
    },
    dark_matter: {
      color: [30, 30, 30],
      CSS: { "background-color": "rgb(30, 30, 30)" },
      liquid: true,
      density: 1,
      name: "Dark Matter",
      sound: "#",
    },
    steam: {
      color: [128, 128, 128],
      CSS: { "background-color": "rgb(128, 128, 128)" },
      density: -1,
      name: "Steam",
      sound: "#",
    },
    hardened_concrete: {
      color: [98, 98, 98],
      CSS: { "background-color": "rgb(98, 98, 98)" },
      name: "Hardened Concrete",
      sound: "#",
    },
    spring: {
      CSS: {
        "background-image":
          "linear-gradient(to right, rgb(52, 152, 219), rgb(128, 128, 128), rgb(52, 152, 219))",
      },
      name: "Spring",
      sound: "#",
    },
    oil_well: {
      CSS: {
        "background-image":
          "linear-gradient(to right, rgb(139, 97, 42), rgb(128, 128, 128), rgb(139, 97, 42))",
      },
      name: "Oil Well",
      sound: "#",
    },
    lava: {
      CSS: {},
      name: "Lava",
      sound: "#",
    },
    gas_pump: {
      CSS: {
        "background-image":
          "linear-gradient(to right, rgb(236, 240, 241), rgb(128, 128, 128), rgb(236, 240, 241))",
      },
      name: "Gas Pump",
      sound: "#",
    },
    volcano: {
      CSS: {
        "background-image":
          "linear-gradient(to right, rgb(231, 76, 60), rgb(230, 126, 34), rgb(118, 118, 118), rgb(230, 126, 34), rgb(231, 76, 60))",
      },
      name: "Volcano",
      sound: "#",
    },
  };

  this.init();
}

Game.prototype.init = function () {
  // Load canvas og context;
  this.canvas = document.getElementById("game");
  if (this.canvas.getContext) {
    this.gameWidth = this.canvas.width;
    this.gameHeight = this.canvas.height;

    this.context = this.canvas.getContext("2d");
    this.mouse = new Mouse(this.canvas);
    this.draw2d = new Draw2D(this.context, this.gameWidth, this.gameHeight);

    var that = this;
    this.fpsStart = new Date();

    this.setup();

    initDrags(Game);

    let upd8 = function () {
      that.update();
      setTimeout(upd8, that.updateDelay);
    };
    upd8();

    var setupDraw = function () {
      that.draw();
      window.requestAnimationFrame(setupDraw);
    };

    window.requestAnimationFrame(setupDraw);

    document.getElementById("messages-collapse").onclick = function () {
      document.getElementById("messages-collapse-top").style.display = "block";
      document.getElementById("messages").style.display = "none";
      Game.messagesCollapsed = true;
    };
    document.getElementById("messages-collapse-top").onclick = function () {
      document.getElementById("messages-collapse-top").style.display = "none";
      document.getElementById("messages").style.display = "block";
      Game.messagesCollapsed = false;
    };
    if (Game.messagesCollapsed) {
      document.getElementById("messages-collapse-top").style.display = "block";
      document.getElementById("messages").style.display = "none";
      Game.messagesCollapsed = true;
    }
  }
};

Game.prototype.setup = function () {
  this.grid = new Array(this.gameWidth);
  var x = 0;
  var y = 0;
  var that = this;
  while (x < this.gameWidth) {
    that.grid[x] = new Array(that.gameHeight);
    y = 0;
    while (y < this.gameHeight + 1) {
      that.grid[x][y] = NONE;
      y++;
    }
    x++;
  }
  let _this = this;
  document.addEventListener("mousemove", function (e) {
    let s = _this.mouse.size;
    let stl = _this.get_material(_this.mouse.tool).CSS || {
      "background-color": "red",
    };
    Object.keys(stl).forEach((st) => {
      document.getElementById("cursor").style[st] = stl[st];
    });
    document.getElementById("cursor").style.width = s + "px";
    document.getElementById("cursor").style.height = s + "px";
    document.getElementById("cursor").style.left = e.clientX - Math.floor(s / 2) + "px";
    document.getElementById("cursor").style.top = e.clientY - Math.floor(s / 2) + "px";
  });
};

let un = 0;
Game.prototype.update = function () {
  var game = this;

  let playing = true;
  function play() {
    let sound = game.get_material(s).sound;
    if (sound && sound !== "#") sound.play();
  }
  function stop() {
    if (!playing) {
      let sound = game.get_material(s).sound;
      if (sound && sound !== "#") sound.pause();
    }
  }

  var diff = new Date() - this.fpsStart;
  this.fps = Math.round(this.framesSinceLast / (diff / 1000));

  this.handle_mouse();

  if (this.spawners_on) {
    for (var i = 0; i < this.spawners.length; i++) {
      this.spawners[i].update(game);
    }
  }

  var y = 0;
  var x = 0;
  this.particles = 0;
  while (x < this.gameWidth - 1) {
    y = this.gameHeight;
    while (y >= 0) {
      this.draw2d.pixel(x, y, 0, 0, 0);
      var s = this.grid[x][y];

      if (s !== NONE) {
        this.particles++;
      }

      if (s === NONE || s & RESTING) {
        y--;
        stop();
        continue;
      }

      if (y == 0 || y == this.gameHeight) {
        if (y == 0) this.remove_obj(x, y);
        y--;
        stop();
        continue;
      }

      var dbc = this.dot(x, y + 1),
        m = this.get_material(s);
      var color = m.color;

      if (s & BURNING) {
        if (Math.random() > 0.1) {
          color =
            Math.random() > 0.1
              ? [m.bColors[0], m.bColors[1], m.bColors[2]]
              : [m.bColors[3], m.bColors[4], m.bColors[5]];
        }
      }
      this.draw2d.pixel(x, y, color[0], color[1], color[2]);

      if (s & SAND || s & CONCRETE || s & SALT) {
        if (!dbc) {
          if (Math.random() < 0.8) {
            this.move_obj(x, y + 1, x, y, s);
            play();
          }
        } else if (dbc && !this.dot(x - 1, y + 1)) {
          if (Math.random() < 0.5) {
            this.move_obj(x - 1, y + 1, x, y, s);
            play();
          }
        } else if (dbc && !this.dot(x + 1, y + 1)) {
          if (Math.random() < 0.5) {
            this.move_obj(x + 1, y + 1, x, y, s);
            play();
          }
        } else {
          stop();
        }
      }
      // Spring
      if (s & WALL && s & WATER) {
        this.infect(x, y, NONE, WATER, 1);
      }
      if (s & WALL && s & OIL) {
        this.infect(x, y, NONE, OIL, 0.2);
      }
      if (s & OIL) {
        this.infect(x, y, WALL, NONE, 1);
      }
      if (s & SAND && s & FIRE) {
        this.infect(x, y, NONE, BURNING, 0.2);
      }
      if (s & WALL && s & GASOLINE) {
        this.infect(x, y, NONE, GASOLINE, 0.3);
      }
      if (s & WALL && s & FIRE) {
        this.infect(x, y, NONE, LAVA, 1);
      }
      if (s & WALL && s & CONCRETE) {
        this.infect(x, y, NONE, CONCRETE, 0.5);
      }
      if (s & DARK_MATTER) {
        this.infect(x, y, WALL, DARK_MATTER, 0.5);
        this.infect(x, y, SAND, DARK_MATTER, 0.5);
        this.infect(x, y, WATER, DARK_MATTER, 0.5);
        this.infect(x, y, LIFE, DARK_MATTER, 0.5);
        this.infect(x, y, OIL, DARK_MATTER, 0.5);
        this.infect(x, y, GASOLINE, DARK_MATTER, 0.5);
        this.infect(x, y, SPRING, DARK_MATTER, 0.5);
        this.infect(x, y, OIL_WELL, DARK_MATTER, 0.5);
        this.infect(x, y, GAS_PUMP, DARK_MATTER, 0.5);
        this.infect(x, y, CONCRETE, DARK_MATTER, 0.5);
        this.infect(x, y, HARDENED_CONCRETE, DARK_MATTER, 0.5);
        this.infect(x, y, VOLCANO, DARK_MATTER, 0.5);
        this.infect(x, y, SALT, DARK_MATTER, 0.5);
        this.infect(x, y, SALT_WATER, DARK_MATTER, 0.5);

        if (Math.random() > 0.2) this.get_infected(x, y, NONE, NONE);
      }

      if (s & WATER) {
        if (Math.random() > 0.1) this.get_infected(x, y, LIFE, LIFE);
        this.infect(x, y, CONCRETE, HARDENED_CONCRETE, 1);
        this.infect(x, y, LAVA, STEAM, 0.6);
        this.infect(x, y, SALT, SALT_WATER, 0.9);
      }
      if (s & SALT_WATER) {
        if (Math.random() > 0.7) this.get_infected(x, y, LIFE, LIFE);
        this.infect(x, y, LAVA, STEAM, 0.4);
        this.infect(x, y, SALT, SALT_WATER, 0);
      }

      if (s & FIRE || s & BURNING) {
        this.infect(x, y, LIFE, BURNING);
        this.infect(x, y, OIL, BURNING, 0.4);
        this.infect(x, y, GASOLINE, BURNING, 0.6);
        this.infect(x, y, CONCRETE, BURNING, 1);
        this.infect(x, y, DARK_MATTER, BURNING, 0.8);
        this.infect(x, y, WOOD, BURNING, 0.5);
      }

      // Turn fire into burning
      if (s == FIRE) {
        if (Math.random() > 0.75) this.grid[x][y] |= BURNING;
      }

      if (s & BURNING) {
        var newY = y;
        if (!this.dot(x, y - 1)) {
          if (Math.random() < 0.4) {
            newY--;
            this.move_obj(x, newY, x, y, s);
          }
        }

        if (Math.random() > 0.75) {
          this.remove_obj(x, newY);
        }
      }

      if (s & STEAM) {
        if (Math.random() > 0.4 && !this.dot(x, y - 1)) {
          this.move_obj(x, y - 1, x, y, s);
        }
        if (Math.random() > 0.4) this.get_infected(x, y, NONE, NONE);
        if (Math.random() > 0.98) this.get_infected(x, y, WATER, WATER);
      }

      if (m.liquid) {
        if (!dbc) {
          if (Math.random() < 0.8) {
            this.move_obj(x, y + 1, x, y, s);
          }
        } else if (dbc && Math.random() > 0.2 && !this.dot(x - 1, y)) {
          this.move_obj(x - 1, y, x, y, s);
        } else if (dbc && Math.random() > 0.1 && !this.dot(x + 1, y)) {
          this.move_obj(x + 1, y, x, y, s);
        }
      }

      var um = this.get_material(this.grid[x][y - 1]);
      if (um !== undefined) {
        if (typeof um.density !== "undefined" && typeof m.density !== "undefined") {
          if (m.density < um.density) {
            if (Math.random() < 0.7) {
              this.swap(x, y - 1, x, y);
            }
          }
        }
      }

      y--;
    }

    x++;
  }

  if (this.framesSinceLast > 100) {
    this.framesSinceLast = 0;
    this.fpsStart = new Date();
  }
};

Game.prototype.infect = function (x, y, react, infect, speed) {
  speed = speed || 0.1;

  var coords = [
    [x, y - 1],
    [x, y + 1],
    [x + 1, y],
    [x - 1, y],
    [x - 1, y - 1],
    [x - 1, y + 1],
    [x + 1, y - 1],
    [x + 1, y + 1],
  ];
  var i = 0;
  while (i < coords.length) {
    var x = coords[i][0];
    var y = coords[i][1];

    if (this.dot(x, y) == react) {
      if (Math.random() < speed) {
        (this.grid[x] || {})[y] = infect;
      }
    }

    i++;
  }
};

Game.prototype.get_infected = function (x, y, search, replace, speed) {
  speed = speed || 0.1;

  var coords = [
    [x, y - 1],
    [x, y + 1],
    [x + 1, y],
    [x - 1, y],
  ];
  var i = 0;

  var oldX = x,
    oldY = y;
  while (i < coords.length) {
    if (this.dot(coords[i][0], coords[i][1]) == search) {
      if (Math.random() < speed) {
        this.grid[oldX][oldY] = replace;
      }
      return;
    }

    i++;
  }
};

Game.prototype.draw = function () {
  var game = this;

  game.draw2d.doneDraw();

  // UI
  this.context.fillStyle = "rgb(255,255,255)";
  game.draw2d.text(
    "Objects: " + this.particles + "/" + this.canvas.width * this.canvas.height,
    2,
    24,
    "12px nevis Bold"
  );
  game.draw2d.text("FPS: " + this.fps, 2, 12, "12px nevis Bold");
  game.draw2d.text(
    this.term + " Build " + this.ver,
    this.canvas.width - 68, // + == left
    this.canvas.height - 3,
    "12px nevis Bold"
  );
  game.draw2d.text(
    "Tool: " + this.get_material(this.mouse.tool, true).name || "Unknown",
    3,
    this.canvas.height - 18,
    "12px nevis Bold"
  );
  game.draw2d.text(
    this.mouse.x + 2 + "px, " + (this.mouse.y + 2) + "px",
    3,
    this.canvas.height - 3,
    "12px nevis Bold"
  );

  this.framesSinceLast++;
};

Game.prototype.fill_square = function (x, y, w, h, s) {
  for (var xx = x; xx < x + w; xx++) {
    for (var yy = y; yy < y + h; yy++) {
      this.add_obj(xx, yy, s);
    }
  }
};

Game.prototype.handle_mouse = function () {
  if (this.mouse.is_down) {
    if (this.mouse.tool !== NONE) {
      this.fill_square(
        this.mouse.x,
        this.mouse.y,
        this.mouse.size,
        this.mouse.size,
        this.mouse.tool
      );
    } else {
      this.remove_obj(this.mouse.x, this.mouse.y);
    }
  }
};

Game.prototype.get_material = function (s, getName) {
  if (s & WALL && s & WATER && getName) {
    return this.materials.spring;
  }
  if (s & WALL && s & OIL && getName) {
    return this.materials.oil_well;
  }
  if (s & SAND && s & FIRE && getName) {
    return this.materials.lava;
  }
  if (s & WALL && s & GASOLINE && getName) {
    return this.materials.gas_pump;
  }
  if (s & WALL && s & FIRE && getName) {
    return this.materials.volcano;
  }

  if (s & NONE) {
    return this.materials.space;
  }
  if (s & WALL && s & FIRE) {
    return this.materials.fire;
  }
  if (s & WALL) {
    return this.materials.wall;
  }
  if (s & FIRE) {
    return this.materials.fire;
  }
  if (s & SAND) {
    return this.materials.sand;
  }
  if (s & WATER) {
    return this.materials.water;
  }
  if (s & LIFE) {
    return this.materials.life;
  }
  if (s & BURNING) {
    return this.materials.burning;
  }
  if (s & OIL) {
    return this.materials.oil;
  }
  if (s & GASOLINE) {
    return this.materials.gasoline;
  }
  if (s & DARK_MATTER) {
    return this.materials.dark_matter;
  }
  if (s & CONCRETE) {
    return this.materials.concrete;
  }
  if (s & STEAM) {
    return this.materials.steam;
  }
  if (s & HARDENED_CONCRETE) {
    return this.materials.hardened_concrete;
  }
  if (s & SALT) {
    return this.materials.salt;
  }
  if (s & SALT_WATER) {
    return this.materials.salt_water;
  }
  if (s & WOOD) {
    return this.materials.wood;
  }
};

// Helpers

Game.prototype.clear = function () {
  this.setup();
  //this.particles = 0;
};
Game.prototype.fill = function () {
  this.draw2d.fill(this.mouse.tool);
  //this.particles = this.canvas.width * this.canvas.height;
};

Game.prototype.add_obj = function (x, y, type) {
  /*if (this.grid[x] && this.grid[y] && this.grid[x][y] === NONE) {
    this.particles++;
  }*/
  (this.grid[x] || {})[y] = type;
};

Game.prototype.remove_obj = function (x, y) {
  /*if (this.grid[x][y] !== NONE) {
    this.particles--;
  }*/
  this.grid[x][y] = NONE;
};

Game.prototype.swap = function (x, y, oldx, oldy) {
  var temp = this.grid[x][y];
  var temp1 = this.grid[oldx][oldy];
  this.grid[x][y] = temp1;
  this.grid[oldx][oldy] = temp;
};

Game.prototype.move_obj = function (x, y, oldx, oldy, type) {
  this.remove_obj(oldx, oldy);
  this.add_obj(x, y, type);
};

Game.prototype.dot = function (x, y) {
  if (x < 0 || x > this.gameWidth || y < 0 || y > this.gameHeight) {
    return WALL;
  }
  return this.grid[x][y];
};

export default Game;
