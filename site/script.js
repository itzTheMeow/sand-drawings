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

  // src/Renderer.ts
  var renderCache = {};
  var Renderer = class {
    constructor(game) {
      this.game = game;
      this.imgData = game.ctx.createImageData(game.canvas.width, game.canvas.height);
      this.pixData = this.imgData.data;
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
      this.game.ctx.putImageData(this.imgData, 0, 0);
    }
    update() {
      let t = this;
      this.game.pixels.forEach((p, x) => {
        p.forEach((pp, y) => {
          t.renderPixel(x, y + 1, t.game.getPixel(x, y));
        });
      });
      this.finishFrame();
      requestAnimationFrame(this.update.bind(this));
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
      this.size = 5;
      this.material = MaterialTypes.sand;
      this.isDrawing = false;
      this.mousePos = new Vec2(0, 0);
      game.canvas.onmousedown = game.canvas.ontouchstart = this.startDrawing.bind(this);
      game.canvas.onmousemove = game.canvas.ontouchmove = this.drawAt.bind(this);
      game.canvas.onmouseup = game.canvas.ontouchend = this.stopDrawing.bind(this);
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
      for (let x = pos.x; x < pos.x + this.size; x++) {
        for (let y = pos.y; y < pos.y + this.size; y++) {
          (this.game.pixels[Math.round(x - this.size / 2)] || {})[Math.round(y - this.size / 2)] = this.material;
        }
      }
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
      let x = this.game.canvas.width;
      let y = 0;
      while (x > 0) {
        y = 0;
        while (y < this.game.canvas.height) {
          let pos = new Vec2(x, y);
          let mat = this.game.getPixel(...pos.toArray());
          let materialProps = getMaterial(mat);
          if (materialProps.fallSpeed) {
            if (y < this.game.canvas.height - 1 && !this.game.getPixel(pos.x, pos.y + 1)) {
              let tryFall = function(tried) {
                let newPos = pos.duplicate().add(0, materialProps.fallSpeed);
                let posDet = rand_default(1, 12);
                if (posDet < 2) {
                  newPos.sub(1, 0);
                } else if (posDet > 11) {
                  newPos.add(1, 0);
                }
                if (t.game.getPixel(newPos.x, newPos.y)) {
                  if (tried !== 3)
                    tryFall(tried + 1);
                  return;
                }
                t.game.setPixel(pos.x, pos.y, MaterialTypes.air);
                t.game.setPixel(newPos.x, newPos.y, mat);
              };
              let t = this;
              tryFall(0);
            }
          }
          y++;
        }
        x--;
      }
    }
  };

  // src/Game.ts
  var Game = class {
    constructor() {
      this.pixels = [];
      this.ticker = setInterval(this.tick.bind(this), 1);
      this.canvas = __default("canvas");
      this.ctx = this.canvas.getContext("2d");
      this.canvas.width = window.innerWidth + 2;
      this.canvas.height = window.innerHeight;
      this.fillPixels(MaterialTypes.air);
      this.pen = new Pen(this);
      this.renderer = new Renderer(this);
      this.phys = new Physics(this);
      this.renderer.startRender();
    }
    getPixel(x, y) {
      return this.pixels[x][y];
    }
    setPixel(x, y, type) {
      this.pixels[x][y] = type;
    }
    fillPixels(type) {
      let posX = 0;
      while (posX < this.canvas.width + 10) {
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
