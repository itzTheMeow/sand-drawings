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
  var Materials = {
    0: {
      name: "air",
      color: "#000000",
      fallSpeed: 0
    },
    1: {
      name: "sand",
      color: "#FF0000",
      fallSpeed: 1
    }
  };
  var MaterialTypes;
  (function(MaterialTypes3) {
    MaterialTypes3[MaterialTypes3["air"] = 0] = "air";
    MaterialTypes3[MaterialTypes3["sand"] = 1] = "sand";
  })(MaterialTypes || (MaterialTypes = {}));
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
      let x = 0;
      let y = 0;
      while (x < this.game.canvas.width - 1) {
        y = this.game.canvas.height;
        while (y >= 0) {
          let mat = this.game.pixels[x][y];
          this.renderPixel(x, y, mat);
          y--;
        }
        x++;
      }
      this.finishFrame();
      requestAnimationFrame(this.update.bind(this));
    }
    startRender() {
      requestAnimationFrame(this.update.bind(this));
    }
  };

  // src/Pen.ts
  var Pen = class {
    constructor(game) {
      this.game = game;
      this.size = 5;
      this.isDrawing = false;
      this.mousePos = { x: 0, y: 0 };
      this.update = function() {
        if (this.isDrawing) {
          for (var x = this.mousePos.x; x < this.mousePos.x + this.size; x++) {
            for (var y = this.mousePos.y; y < this.mousePos.y + this.size; y++) {
              (this.game.pixels[Math.round(x - this.size / 2)] || {})[Math.round(y - this.size / 2)] = 1;
            }
          }
        }
      };
      game.canvas.onmousedown = this.startDrawing.bind(this);
      game.canvas.onmouseup = this.stopDrawing.bind(this);
      game.canvas.ontouchstart = this.startDrawing.bind(this);
      game.canvas.ontouchend = this.stopDrawing.bind(this);
      game.canvas.onmousemove = function(e) {
        this.mousePos = {
          x: e.offsetX,
          y: e.offsetY
        };
        this.update();
      }.bind(this);
      game.canvas.ontouchmove = function(e) {
        this.mousePos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
        this.update();
      }.bind(this);
    }
    startDrawing(e) {
      this.isDrawing = true;
      if (e.touches)
        this.mousePos = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY
        };
      else
        this.mousePos = {
          x: e.offsetX,
          y: e.offsetY
        };
      this.update();
    }
    stopDrawing() {
      this.isDrawing = false;
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
      this.renderer.startRender();
    }
    fillPixels(type) {
      let posX = 0;
      let posY = 0;
      while (posX < this.canvas.width + 10) {
        this.pixels[posX] = new Array(this.canvas.height);
        posY = 0;
        while (posY < this.canvas.height + 1) {
          this.pixels[posX][posY] = type;
          posY++;
        }
        posX++;
      }
    }
    tick() {
      this.pen.update();
    }
  };

  // src/script.ts
  window.Engine = new Game();
  disableBodyScroll(__default("scroll-lock"));
})();
