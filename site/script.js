(() => {
  // src/util/_.ts
  var _ = (i) => document.getElementById(i);
  var __default = _;

  // node_modules/body-scroll-lock/lib/bodyScrollLock.esm.js
  function _toConsumableArray(arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }
      return arr2;
    } else {
      return Array.from(arr);
    }
  }
  var hasPassiveEvents = false;
  if (typeof window !== "undefined") {
    passiveTestOptions = {
      get passive() {
        hasPassiveEvents = true;
        return void 0;
      }
    };
    window.addEventListener("testPassive", null, passiveTestOptions);
    window.removeEventListener("testPassive", null, passiveTestOptions);
  }
  var passiveTestOptions;
  var isIosDevice = typeof window !== "undefined" && window.navigator && window.navigator.platform && (/iP(ad|hone|od)/.test(window.navigator.platform) || window.navigator.platform === "MacIntel" && window.navigator.maxTouchPoints > 1);
  var locks = [];
  var documentListenerAdded = false;
  var initialClientY = -1;
  var previousBodyOverflowSetting = void 0;
  var previousBodyPaddingRight = void 0;
  var allowTouchMove = function allowTouchMove2(el) {
    return locks.some(function(lock) {
      if (lock.options.allowTouchMove && lock.options.allowTouchMove(el)) {
        return true;
      }
      return false;
    });
  };
  var preventDefault = function preventDefault2(rawEvent) {
    var e = rawEvent || window.event;
    if (allowTouchMove(e.target)) {
      return true;
    }
    if (e.touches.length > 1)
      return true;
    if (e.preventDefault)
      e.preventDefault();
    return false;
  };
  var setOverflowHidden = function setOverflowHidden2(options) {
    if (previousBodyPaddingRight === void 0) {
      var _reserveScrollBarGap = !!options && options.reserveScrollBarGap === true;
      var scrollBarGap = window.innerWidth - document.documentElement.clientWidth;
      if (_reserveScrollBarGap && scrollBarGap > 0) {
        previousBodyPaddingRight = document.body.style.paddingRight;
        document.body.style.paddingRight = scrollBarGap + "px";
      }
    }
    if (previousBodyOverflowSetting === void 0) {
      previousBodyOverflowSetting = document.body.style.overflow;
      document.body.style.overflow = "hidden";
    }
  };
  var isTargetElementTotallyScrolled = function isTargetElementTotallyScrolled2(targetElement) {
    return targetElement ? targetElement.scrollHeight - targetElement.scrollTop <= targetElement.clientHeight : false;
  };
  var handleScroll = function handleScroll2(event, targetElement) {
    var clientY = event.targetTouches[0].clientY - initialClientY;
    if (allowTouchMove(event.target)) {
      return false;
    }
    if (targetElement && targetElement.scrollTop === 0 && clientY > 0) {
      return preventDefault(event);
    }
    if (isTargetElementTotallyScrolled(targetElement) && clientY < 0) {
      return preventDefault(event);
    }
    event.stopPropagation();
    return true;
  };
  var disableBodyScroll = function disableBodyScroll2(targetElement, options) {
    if (!targetElement) {
      console.error("disableBodyScroll unsuccessful - targetElement must be provided when calling disableBodyScroll on IOS devices.");
      return;
    }
    if (locks.some(function(lock2) {
      return lock2.targetElement === targetElement;
    })) {
      return;
    }
    var lock = {
      targetElement,
      options: options || {}
    };
    locks = [].concat(_toConsumableArray(locks), [lock]);
    if (isIosDevice) {
      targetElement.ontouchstart = function(event) {
        if (event.targetTouches.length === 1) {
          initialClientY = event.targetTouches[0].clientY;
        }
      };
      targetElement.ontouchmove = function(event) {
        if (event.targetTouches.length === 1) {
          handleScroll(event, targetElement);
        }
      };
      if (!documentListenerAdded) {
        document.addEventListener("touchmove", preventDefault, hasPassiveEvents ? { passive: false } : void 0);
        documentListenerAdded = true;
      }
    } else {
      setOverflowHidden(options);
    }
  };

  // src/Materials.ts
  var MaterialTypes;
  (function(MaterialTypes3) {
    MaterialTypes3[MaterialTypes3["air"] = 0] = "air";
    MaterialTypes3[MaterialTypes3["sand"] = 1] = "sand";
    MaterialTypes3[MaterialTypes3["wall"] = 2] = "wall";
  })(MaterialTypes || (MaterialTypes = {}));
  var Materials = [];
  Materials[0] = {
    name: "air",
    color: "#000000",
    fallSpeed: 0
  };
  Materials[1] = {
    name: "sand",
    color: "#d2b48c",
    fallSpeed: 1
  };
  Materials[2] = {
    name: "wall",
    color: "#767676",
    fallSpeed: 0
  };
  function getMaterial(id) {
    return Materials[id] || Materials[0];
  }

  // src/util/HEX2RGB.ts
  var hexToRgb = (hex) => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b).substring(1).match(/.{2}/g).map((x) => parseInt(x, 16));

  // src/config.ts
  var config = {
    background: "#000000",
    foreground: "#FFFFFF",
    dotScale: 0.5,
    dotColor: "#FAFAFA",
    toolSize: 58
  };
  var config_default = config;

  // src/Renderer.ts
  var renderCache = {};
  var Renderer = class {
    constructor(game) {
      this.game = game;
      this.statStart = [2, 4];
      this.statPad = 12;
      this.frameLatency = 0;
      this.fps = 0;
      this.tempCan = document.createElement("canvas");
      this.tempCan.width = game.canvas.width;
      this.tempCan.height = game.canvas.height;
      this.tempCtx = this.tempCan.getContext("2d");
      this.imgData = this.tempCtx.createImageData(game.canvas.width, game.canvas.height);
      this.pixData = this.imgData.data;
    }
    initFont() {
      this.game.ctx.font = "Pixeloid 16px";
      this.game.ctx.fillStyle = config_default.foreground;
    }
    addStat(text) {
      this.statTop += this.statPad;
      let ctx = this.game.ctx;
      this.initFont();
      ctx.textAlign = "left";
      ctx.fillText(text, this.statStart[1], this.statTop);
    }
    startFrame() {
      this.statTop = this.statStart[0];
      this.startedFrame = Date.now();
      this.fps++;
      setTimeout(() => this.fps--, 1e3);
      this.pixData.fill(0);
      this.game.ctx.fillStyle = config_default.background;
      this.game.ctx.fillRect(0, 0, this.game.canvas.width, this.game.canvas.height);
    }
    renderPixel(x, y, type) {
      let color = renderCache[type] || (renderCache[type] = hexToRgb(getMaterial(type).color));
      let i = (this.imgData.width * (y - 1) + x) * 4;
      this.pixData[i] = color[0];
      this.pixData[i + 1] = color[1];
      this.pixData[i + 2] = color[2];
      this.pixData[i + 3] = 255;
    }
    finishFrame() {
      let ctx = this.game.ctx;
      this.tempCtx.putImageData(this.imgData, 0, 0);
      ctx.drawImage(this.tempCan, 0, 0);
      this.frameLatency = Date.now() - this.startedFrame;
      this.addStat(`FPS: ${this.fps}`);
      this.addStat(`LAT: ${this.frameLatency}ms`);
      this.addStat(`PXL: ${this.game.pixelAmount.toLocaleString()}`);
      this.addStat(`SIZ: ${this.game.canvas.width}x${this.game.canvas.height}`);
      this.initFont();
      ctx.textAlign = "right";
      if (this.game.canvas.width > 700)
        ctx.fillText("Try a smaller screen resolution!", this.game.canvas.width - 6, 12);
    }
    update() {
      let t = this;
      setTimeout(function() {
        t.startFrame();
        t.game.pixels.forEach((p, x) => {
          p.forEach((pp, y) => {
            if (p && pp)
              t.renderPixel(x, y + 1, t.game.getPixel(x, y));
          });
        });
        t.finishFrame();
        requestAnimationFrame(t.update.bind(t));
      }, 0);
    }
    startRender() {
      requestAnimationFrame(this.update.bind(this));
    }
  };

  // src/Vec2.ts
  var Vec2 = class {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
    add(x, y) {
      this.x += x;
      this.y += y;
      return this;
    }
    sub(x, y) {
      this.x -= x;
      this.y -= y;
      return this;
    }
    set(x, y) {
      this.x = x;
      this.y = y;
      return this;
    }
    duplicate() {
      return new Vec2(this.x, this.y);
    }
    equals(other) {
      return this.x == other.x && this.y == other.y;
    }
    toString() {
      return `${this.x}, ${this.y}`;
    }
    toArray() {
      return [this.x, this.y];
    }
  };

  // src/util/pointAlongLine.ts
  function pointAlongLine(point1, point2, percentage) {
    percentage = percentage / 100;
    return new Vec2(point1.x * (1 - percentage) + point2.x * percentage, point1.y * (1 - percentage) + point2.y * percentage);
  }

  // src/Pen.ts
  var Pen = class {
    constructor(game) {
      this.game = game;
      this.sizes = [1, 5, 10, 25, 50];
      this.selsize = 1;
      this.material = MaterialTypes.sand;
      this.selectedMat = MaterialTypes.sand;
      this.isDrawing = false;
      this.mousePos = new Vec2(0, 0);
      this.penUpdater = setInterval(this.updatePenElement.bind(this), 1);
      game.canvas.onmousedown = game.canvas.ontouchstart = this.startDrawing.bind(this);
      game.canvas.onmousemove = game.canvas.ontouchmove = this.drawAt.bind(this);
      game.canvas.onmouseup = game.canvas.ontouchend = this.stopDrawing.bind(this);
      game.canvas.onmouseleave = function() {
        this.mousePos.set(0, 0);
        this.stopDrawing();
      }.bind(this);
    }
    get size() {
      return this.sizes[this.selsize];
    }
    startDrawing(e) {
      this.isDrawing = true;
      this.drawAt(e);
    }
    drawAt(e) {
      if (window.TouchEvent && e instanceof TouchEvent) {
        this.mousePos.set(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      } else if (e instanceof MouseEvent) {
        this.mousePos.set(e.offsetX, e.offsetY);
      }
      this.update();
    }
    stopDrawing() {
      this.isDrawing = false;
      this.lastMousePos = void 0;
    }
    updatePenElement() {
      let penElement = __default("pen");
      if (this.mousePos.x && this.mousePos.y) {
        penElement.style.display = "block";
        penElement.style.backgroundColor = getMaterial(this.material).color;
        penElement.style.width = penElement.style.height = this.size + "px";
        penElement.style.left = this.mousePos.x - this.size / 2 + "px";
        penElement.style.top = this.mousePos.y - this.size / 2 + "px";
      } else
        penElement.style.display = "none";
    }
    update() {
      if (this.isDrawing) {
        if (this.lastMousePos) {
          let points = [];
          let pe = this;
          for (let i = 1; i <= 100; i++) {
            points.push(pointAlongLine(pe.lastMousePos, pe.mousePos, i));
          }
          points = points.map((p) => p.set(Math.round(p.x), Math.round(p.y)));
          points = [...new Set(points)];
          points.forEach((point) => {
            this.draw(point);
          });
        } else {
          this.draw(this.mousePos);
        }
        this.lastMousePos = this.mousePos.duplicate();
      }
    }
    draw(pos) {
      let t = this;
      new Array(this.size).fill(0).forEach((_2, x) => {
        new Array(this.size).fill(0).forEach((_3, y) => {
          (t.game.pixels[Math.round(pos.x + x - t.size / 2)] || [])[Math.round(pos.y + y - t.size / 2)] = t.material;
        });
      });
    }
  };

  // src/util/rand.ts
  var rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  var rand_default = rand;

  // src/Physics.ts
  var Physics = class {
    constructor(game) {
      this.game = game;
    }
    update() {
      let t = this;
      this.game.pixels.forEach((p, x) => {
        let lastIndex = 0;
        let pa = new Array(p.length).fill(0).map((_2, i) => p[p.length - 1 - i]);
        pa.filter((a) => a != MaterialTypes.air).forEach((mat, yo) => {
          yo = pa.indexOf(mat, lastIndex);
          lastIndex = yo + 1;
          let y = t.game.canvas.height - (yo + 1);
          let pos = new Vec2(x, y);
          let materialProps = getMaterial(mat);
          if (materialProps.fallSpeed) {
            if (y < t.game.canvas.height - 1 && !t.game.getPixel(pos.x, pos.y + 1)) {
              let newPos = pos.duplicate().add(0, materialProps.fallSpeed);
              let posDet = rand_default(1, 12);
              if (posDet < 2) {
                newPos.sub(1, 0);
              } else if (posDet > 11) {
                newPos.add(1, 0);
              }
              if (t.game.getPixel(newPos.x, newPos.y)) {
                return;
              }
              t.game.setPixel(pos.x, pos.y, MaterialTypes.air);
              t.game.setPixel(newPos.x, newPos.y, mat);
            }
          }
        });
      });
    }
  };

  // src/Toolbar.ts
  function initToolbar(game) {
    let tools = [...document.querySelectorAll("#toolbar img")];
    let sizes = [];
    game.pen.sizes.forEach((s, i) => {
      let selector = document.createElement("canvas");
      selector.width = selector.height = config_default.toolSize;
      __default("sizes").appendChild(selector);
      sizes.push(selector);
      let selctx = selector.getContext("2d");
      selctx.beginPath();
      selctx.arc(config_default.toolSize / 2, config_default.toolSize / 2, Math.max(1, s * config_default.dotScale), 0, Math.PI * 2);
      selctx.closePath();
      selctx.fillStyle = "#FAFAFA";
      selctx.fill();
    });
    function resetBar(el) {
      tools.map((t) => t.classList.remove("selected"));
      tools[el].classList.add("selected");
    }
    function resetSizes(el) {
      sizes.map((t) => t.classList.remove("selected"));
      sizes[el].classList.add("selected");
    }
    tools[0].onclick = function(e) {
      game.pen.material = game.pen.selectedMat;
      resetBar(0);
    };
    tools[1].onclick = function(e) {
      game.pen.material = MaterialTypes.air;
      resetBar(1);
    };
    sizes.forEach((s, i) => {
      s.onclick = function() {
        game.pen.selsize = i;
        resetSizes(i);
      };
    });
    resetBar(0);
    resetSizes(game.pen.selsize);
  }

  // src/Game.ts
  var Game = class {
    constructor() {
      this.pixels = [];
      this.ticker = setInterval(this.tick.bind(this), 1);
      this.canvas = __default("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.ctx.imageSmoothingEnabled = false;
      this.canvas.width = window.innerWidth + 2;
      this.canvas.height = window.innerHeight;
      this.fillPixels(MaterialTypes.air);
      this.pen = new Pen(this);
      this.renderer = new Renderer(this);
      this.phys = new Physics(this);
      this.renderer.startRender();
      initToolbar(this);
    }
    get pixelAmount() {
      return this.pixels.map((p) => p.filter((p2) => p2 != 0).length).reduce((a, b) => a + b);
    }
    getPixel(x, y) {
      try {
        return this.pixels[x][y];
      } catch (e) {
      }
    }
    setPixel(x, y, type) {
      try {
        this.pixels[x][y] = type;
      } catch (e) {
      }
    }
    fillPixels(type) {
      let posX = 0;
      while (posX < this.canvas.width) {
        this.pixels[posX] = new Array(this.canvas.height).fill(type);
        posX++;
      }
    }
    tick() {
      this.phys.update();
      this.pen.update();
    }
  };

  // src/script.ts
  window.Engine = new Game();
  disableBodyScroll(__default("scroll-lock"));
})();
