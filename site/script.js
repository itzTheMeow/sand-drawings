(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __markAsModule = (target) => __defProp(target, "__esModule", { value: true });
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[Object.keys(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __reExport = (target, module, desc) => {
    if (module && typeof module === "object" || typeof module === "function") {
      for (let key of __getOwnPropNames(module))
        if (!__hasOwnProp.call(target, key) && key !== "default")
          __defProp(target, key, { get: () => module[key], enumerable: !(desc = __getOwnPropDesc(module, key)) || desc.enumerable });
    }
    return target;
  };
  var __toModule = (module) => {
    return __reExport(__markAsModule(__defProp(module != null ? __create(__getProtoOf(module)) : {}, "default", module && module.__esModule && "default" in module ? { get: () => module.default, enumerable: true } : { value: module, enumerable: true })), module);
  };

  // node_modules/howler/dist/howler.js
  var require_howler = __commonJS({
    "node_modules/howler/dist/howler.js"(exports) {
      (function() {
        "use strict";
        var HowlerGlobal2 = function() {
          this.init();
        };
        HowlerGlobal2.prototype = {
          init: function() {
            var self = this || Howler2;
            self._counter = 1e3;
            self._html5AudioPool = [];
            self.html5PoolSize = 10;
            self._codecs = {};
            self._howls = [];
            self._muted = false;
            self._volume = 1;
            self._canPlayEvent = "canplaythrough";
            self._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
            self.masterGain = null;
            self.noAudio = false;
            self.usingWebAudio = true;
            self.autoSuspend = true;
            self.ctx = null;
            self.autoUnlock = true;
            self._setup();
            return self;
          },
          volume: function(vol) {
            var self = this || Howler2;
            vol = parseFloat(vol);
            if (!self.ctx) {
              setupAudioContext();
            }
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              self._volume = vol;
              if (self._muted) {
                return self;
              }
              if (self.usingWebAudio) {
                self.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              }
              for (var i = 0; i < self._howls.length; i++) {
                if (!self._howls[i]._webAudio) {
                  var ids = self._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound2 = self._howls[i]._soundById(ids[j]);
                    if (sound2 && sound2._node) {
                      sound2._node.volume = sound2._volume * vol;
                    }
                  }
                }
              }
              return self;
            }
            return self._volume;
          },
          mute: function(muted) {
            var self = this || Howler2;
            if (!self.ctx) {
              setupAudioContext();
            }
            self._muted = muted;
            if (self.usingWebAudio) {
              self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler2.ctx.currentTime);
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (!self._howls[i]._webAudio) {
                var ids = self._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound2 = self._howls[i]._soundById(ids[j]);
                  if (sound2 && sound2._node) {
                    sound2._node.muted = muted ? true : sound2._muted;
                  }
                }
              }
            }
            return self;
          },
          stop: function() {
            var self = this || Howler2;
            for (var i = 0; i < self._howls.length; i++) {
              self._howls[i].stop();
            }
            return self;
          },
          unload: function() {
            var self = this || Howler2;
            for (var i = self._howls.length - 1; i >= 0; i--) {
              self._howls[i].unload();
            }
            if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== "undefined") {
              self.ctx.close();
              self.ctx = null;
              setupAudioContext();
            }
            return self;
          },
          codecs: function(ext) {
            return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
          },
          _setup: function() {
            var self = this || Howler2;
            self.state = self.ctx ? self.ctx.state || "suspended" : "suspended";
            self._autoSuspend();
            if (!self.usingWebAudio) {
              if (typeof Audio !== "undefined") {
                try {
                  var test = new Audio();
                  if (typeof test.oncanplaythrough === "undefined") {
                    self._canPlayEvent = "canplay";
                  }
                } catch (e) {
                  self.noAudio = true;
                }
              } else {
                self.noAudio = true;
              }
            }
            try {
              var test = new Audio();
              if (test.muted) {
                self.noAudio = true;
              }
            } catch (e) {
            }
            if (!self.noAudio) {
              self._setupCodecs();
            }
            return self;
          },
          _setupCodecs: function() {
            var self = this || Howler2;
            var audioTest = null;
            try {
              audioTest = typeof Audio !== "undefined" ? new Audio() : null;
            } catch (err) {
              return self;
            }
            if (!audioTest || typeof audioTest.canPlayType !== "function") {
              return self;
            }
            var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
            var ua = self._navigator ? self._navigator.userAgent : "";
            var checkOpera = ua.match(/OPR\/([0-6].)/g);
            var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
            var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
            var safariVersion = ua.match(/Version\/(.*?) /);
            var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
            self._codecs = {
              mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
              mpeg: !!mpegTest,
              opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
              ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
              wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
              aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
              caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
              m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
              weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
              dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
              flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
            };
            return self;
          },
          _unlockAudio: function() {
            var self = this || Howler2;
            if (self._audioUnlocked || !self.ctx) {
              return;
            }
            self._audioUnlocked = false;
            self.autoUnlock = false;
            if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
              self._mobileUnloaded = true;
              self.unload();
            }
            self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);
            var unlock = function(e) {
              while (self._html5AudioPool.length < self.html5PoolSize) {
                try {
                  var audioNode = new Audio();
                  audioNode._unlocked = true;
                  self._releaseHtml5Audio(audioNode);
                } catch (e2) {
                  self.noAudio = true;
                  break;
                }
              }
              for (var i = 0; i < self._howls.length; i++) {
                if (!self._howls[i]._webAudio) {
                  var ids = self._howls[i]._getSoundIds();
                  for (var j = 0; j < ids.length; j++) {
                    var sound2 = self._howls[i]._soundById(ids[j]);
                    if (sound2 && sound2._node && !sound2._node._unlocked) {
                      sound2._node._unlocked = true;
                      sound2._node.load();
                    }
                  }
                }
              }
              self._autoResume();
              var source = self.ctx.createBufferSource();
              source.buffer = self._scratchBuffer;
              source.connect(self.ctx.destination);
              if (typeof source.start === "undefined") {
                source.noteOn(0);
              } else {
                source.start(0);
              }
              if (typeof self.ctx.resume === "function") {
                self.ctx.resume();
              }
              source.onended = function() {
                source.disconnect(0);
                self._audioUnlocked = true;
                document.removeEventListener("touchstart", unlock, true);
                document.removeEventListener("touchend", unlock, true);
                document.removeEventListener("click", unlock, true);
                document.removeEventListener("keydown", unlock, true);
                for (var i2 = 0; i2 < self._howls.length; i2++) {
                  self._howls[i2]._emit("unlock");
                }
              };
            };
            document.addEventListener("touchstart", unlock, true);
            document.addEventListener("touchend", unlock, true);
            document.addEventListener("click", unlock, true);
            document.addEventListener("keydown", unlock, true);
            return self;
          },
          _obtainHtml5Audio: function() {
            var self = this || Howler2;
            if (self._html5AudioPool.length) {
              return self._html5AudioPool.pop();
            }
            var testPlay = new Audio().play();
            if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
              testPlay.catch(function() {
                console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
              });
            }
            return new Audio();
          },
          _releaseHtml5Audio: function(audio) {
            var self = this || Howler2;
            if (audio._unlocked) {
              self._html5AudioPool.push(audio);
            }
            return self;
          },
          _autoSuspend: function() {
            var self = this;
            if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (self._howls[i]._webAudio) {
                for (var j = 0; j < self._howls[i]._sounds.length; j++) {
                  if (!self._howls[i]._sounds[j]._paused) {
                    return self;
                  }
                }
              }
            }
            if (self._suspendTimer) {
              clearTimeout(self._suspendTimer);
            }
            self._suspendTimer = setTimeout(function() {
              if (!self.autoSuspend) {
                return;
              }
              self._suspendTimer = null;
              self.state = "suspending";
              var handleSuspension = function() {
                self.state = "suspended";
                if (self._resumeAfterSuspend) {
                  delete self._resumeAfterSuspend;
                  self._autoResume();
                }
              };
              self.ctx.suspend().then(handleSuspension, handleSuspension);
            }, 3e4);
            return self;
          },
          _autoResume: function() {
            var self = this;
            if (!self.ctx || typeof self.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
              return;
            }
            if (self.state === "running" && self.ctx.state !== "interrupted" && self._suspendTimer) {
              clearTimeout(self._suspendTimer);
              self._suspendTimer = null;
            } else if (self.state === "suspended" || self.state === "running" && self.ctx.state === "interrupted") {
              self.ctx.resume().then(function() {
                self.state = "running";
                for (var i = 0; i < self._howls.length; i++) {
                  self._howls[i]._emit("resume");
                }
              });
              if (self._suspendTimer) {
                clearTimeout(self._suspendTimer);
                self._suspendTimer = null;
              }
            } else if (self.state === "suspending") {
              self._resumeAfterSuspend = true;
            }
            return self;
          }
        };
        var Howler2 = new HowlerGlobal2();
        var Howl3 = function(o) {
          var self = this;
          if (!o.src || o.src.length === 0) {
            console.error("An array of source files must be passed with any new Howl.");
            return;
          }
          self.init(o);
        };
        Howl3.prototype = {
          init: function(o) {
            var self = this;
            if (!Howler2.ctx) {
              setupAudioContext();
            }
            self._autoplay = o.autoplay || false;
            self._format = typeof o.format !== "string" ? o.format : [o.format];
            self._html5 = o.html5 || false;
            self._muted = o.mute || false;
            self._loop = o.loop || false;
            self._pool = o.pool || 5;
            self._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
            self._rate = o.rate || 1;
            self._sprite = o.sprite || {};
            self._src = typeof o.src !== "string" ? o.src : [o.src];
            self._volume = o.volume !== void 0 ? o.volume : 1;
            self._xhr = {
              method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
              headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
              withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
            };
            self._duration = 0;
            self._state = "unloaded";
            self._sounds = [];
            self._endTimers = {};
            self._queue = [];
            self._playLock = false;
            self._onend = o.onend ? [{ fn: o.onend }] : [];
            self._onfade = o.onfade ? [{ fn: o.onfade }] : [];
            self._onload = o.onload ? [{ fn: o.onload }] : [];
            self._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
            self._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
            self._onpause = o.onpause ? [{ fn: o.onpause }] : [];
            self._onplay = o.onplay ? [{ fn: o.onplay }] : [];
            self._onstop = o.onstop ? [{ fn: o.onstop }] : [];
            self._onmute = o.onmute ? [{ fn: o.onmute }] : [];
            self._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
            self._onrate = o.onrate ? [{ fn: o.onrate }] : [];
            self._onseek = o.onseek ? [{ fn: o.onseek }] : [];
            self._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
            self._onresume = [];
            self._webAudio = Howler2.usingWebAudio && !self._html5;
            if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
              Howler2._unlockAudio();
            }
            Howler2._howls.push(self);
            if (self._autoplay) {
              self._queue.push({
                event: "play",
                action: function() {
                  self.play();
                }
              });
            }
            if (self._preload && self._preload !== "none") {
              self.load();
            }
            return self;
          },
          load: function() {
            var self = this;
            var url = null;
            if (Howler2.noAudio) {
              self._emit("loaderror", null, "No audio support.");
              return;
            }
            if (typeof self._src === "string") {
              self._src = [self._src];
            }
            for (var i = 0; i < self._src.length; i++) {
              var ext, str;
              if (self._format && self._format[i]) {
                ext = self._format[i];
              } else {
                str = self._src[i];
                if (typeof str !== "string") {
                  self._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                  continue;
                }
                ext = /^data:audio\/([^;,]+);/i.exec(str);
                if (!ext) {
                  ext = /\.([^.]+)$/.exec(str.split("?", 1)[0]);
                }
                if (ext) {
                  ext = ext[1].toLowerCase();
                }
              }
              if (!ext) {
                console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
              }
              if (ext && Howler2.codecs(ext)) {
                url = self._src[i];
                break;
              }
            }
            if (!url) {
              self._emit("loaderror", null, "No codec support for selected audio sources.");
              return;
            }
            self._src = url;
            self._state = "loading";
            if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
              self._html5 = true;
              self._webAudio = false;
            }
            new Sound2(self);
            if (self._webAudio) {
              loadBuffer(self);
            }
            return self;
          },
          play: function(sprite, internal) {
            var self = this;
            var id = null;
            if (typeof sprite === "number") {
              id = sprite;
              sprite = null;
            } else if (typeof sprite === "string" && self._state === "loaded" && !self._sprite[sprite]) {
              return null;
            } else if (typeof sprite === "undefined") {
              sprite = "__default";
              if (!self._playLock) {
                var num = 0;
                for (var i = 0; i < self._sounds.length; i++) {
                  if (self._sounds[i]._paused && !self._sounds[i]._ended) {
                    num++;
                    id = self._sounds[i]._id;
                  }
                }
                if (num === 1) {
                  sprite = null;
                } else {
                  id = null;
                }
              }
            }
            var sound2 = id ? self._soundById(id) : self._inactiveSound();
            if (!sound2) {
              return null;
            }
            if (id && !sprite) {
              sprite = sound2._sprite || "__default";
            }
            if (self._state !== "loaded") {
              sound2._sprite = sprite;
              sound2._ended = false;
              var soundId = sound2._id;
              self._queue.push({
                event: "play",
                action: function() {
                  self.play(soundId);
                }
              });
              return soundId;
            }
            if (id && !sound2._paused) {
              if (!internal) {
                self._loadQueue("play");
              }
              return sound2._id;
            }
            if (self._webAudio) {
              Howler2._autoResume();
            }
            var seek = Math.max(0, sound2._seek > 0 ? sound2._seek : self._sprite[sprite][0] / 1e3);
            var duration = Math.max(0, (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3 - seek);
            var timeout = duration * 1e3 / Math.abs(sound2._rate);
            var start = self._sprite[sprite][0] / 1e3;
            var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3;
            sound2._sprite = sprite;
            sound2._ended = false;
            var setParams = function() {
              sound2._paused = false;
              sound2._seek = seek;
              sound2._start = start;
              sound2._stop = stop;
              sound2._loop = !!(sound2._loop || self._sprite[sprite][2]);
            };
            if (seek >= stop) {
              self._ended(sound2);
              return;
            }
            var node = sound2._node;
            if (self._webAudio) {
              var playWebAudio = function() {
                self._playLock = false;
                setParams();
                self._refreshBuffer(sound2);
                var vol = sound2._muted || self._muted ? 0 : sound2._volume;
                node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                sound2._playStart = Howler2.ctx.currentTime;
                if (typeof node.bufferSource.start === "undefined") {
                  sound2._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
                } else {
                  sound2._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
                }
                if (timeout !== Infinity) {
                  self._endTimers[sound2._id] = setTimeout(self._ended.bind(self, sound2), timeout);
                }
                if (!internal) {
                  setTimeout(function() {
                    self._emit("play", sound2._id);
                    self._loadQueue();
                  }, 0);
                }
              };
              if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
                playWebAudio();
              } else {
                self._playLock = true;
                self.once("resume", playWebAudio);
                self._clearTimer(sound2._id);
              }
            } else {
              var playHtml5 = function() {
                node.currentTime = seek;
                node.muted = sound2._muted || self._muted || Howler2._muted || node.muted;
                node.volume = sound2._volume * Howler2.volume();
                node.playbackRate = sound2._rate;
                try {
                  var play = node.play();
                  if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                    self._playLock = true;
                    setParams();
                    play.then(function() {
                      self._playLock = false;
                      node._unlocked = true;
                      if (!internal) {
                        self._emit("play", sound2._id);
                      } else {
                        self._loadQueue();
                      }
                    }).catch(function() {
                      self._playLock = false;
                      self._emit("playerror", sound2._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                      sound2._ended = true;
                      sound2._paused = true;
                    });
                  } else if (!internal) {
                    self._playLock = false;
                    setParams();
                    self._emit("play", sound2._id);
                  }
                  node.playbackRate = sound2._rate;
                  if (node.paused) {
                    self._emit("playerror", sound2._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    return;
                  }
                  if (sprite !== "__default" || sound2._loop) {
                    self._endTimers[sound2._id] = setTimeout(self._ended.bind(self, sound2), timeout);
                  } else {
                    self._endTimers[sound2._id] = function() {
                      self._ended(sound2);
                      node.removeEventListener("ended", self._endTimers[sound2._id], false);
                    };
                    node.addEventListener("ended", self._endTimers[sound2._id], false);
                  }
                } catch (err) {
                  self._emit("playerror", sound2._id, err);
                }
              };
              if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
                node.src = self._src;
                node.load();
              }
              var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
              if (node.readyState >= 3 || loadedNoReadyState) {
                playHtml5();
              } else {
                self._playLock = true;
                self._state = "loading";
                var listener = function() {
                  self._state = "loaded";
                  playHtml5();
                  node.removeEventListener(Howler2._canPlayEvent, listener, false);
                };
                node.addEventListener(Howler2._canPlayEvent, listener, false);
                self._clearTimer(sound2._id);
              }
            }
            return sound2._id;
          },
          pause: function(id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "pause",
                action: function() {
                  self.pause(id);
                }
              });
              return self;
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self._clearTimer(ids[i]);
              var sound2 = self._soundById(ids[i]);
              if (sound2 && !sound2._paused) {
                sound2._seek = self.seek(ids[i]);
                sound2._rateSeek = 0;
                sound2._paused = true;
                self._stopFade(ids[i]);
                if (sound2._node) {
                  if (self._webAudio) {
                    if (!sound2._node.bufferSource) {
                      continue;
                    }
                    if (typeof sound2._node.bufferSource.stop === "undefined") {
                      sound2._node.bufferSource.noteOff(0);
                    } else {
                      sound2._node.bufferSource.stop(0);
                    }
                    self._cleanBuffer(sound2._node);
                  } else if (!isNaN(sound2._node.duration) || sound2._node.duration === Infinity) {
                    sound2._node.pause();
                  }
                }
              }
              if (!arguments[1]) {
                self._emit("pause", sound2 ? sound2._id : null);
              }
            }
            return self;
          },
          stop: function(id, internal) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "stop",
                action: function() {
                  self.stop(id);
                }
              });
              return self;
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              self._clearTimer(ids[i]);
              var sound2 = self._soundById(ids[i]);
              if (sound2) {
                sound2._seek = sound2._start || 0;
                sound2._rateSeek = 0;
                sound2._paused = true;
                sound2._ended = true;
                self._stopFade(ids[i]);
                if (sound2._node) {
                  if (self._webAudio) {
                    if (sound2._node.bufferSource) {
                      if (typeof sound2._node.bufferSource.stop === "undefined") {
                        sound2._node.bufferSource.noteOff(0);
                      } else {
                        sound2._node.bufferSource.stop(0);
                      }
                      self._cleanBuffer(sound2._node);
                    }
                  } else if (!isNaN(sound2._node.duration) || sound2._node.duration === Infinity) {
                    sound2._node.currentTime = sound2._start || 0;
                    sound2._node.pause();
                    if (sound2._node.duration === Infinity) {
                      self._clearSound(sound2._node);
                    }
                  }
                }
                if (!internal) {
                  self._emit("stop", sound2._id);
                }
              }
            }
            return self;
          },
          mute: function(muted, id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "mute",
                action: function() {
                  self.mute(muted, id);
                }
              });
              return self;
            }
            if (typeof id === "undefined") {
              if (typeof muted === "boolean") {
                self._muted = muted;
              } else {
                return self._muted;
              }
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound2 = self._soundById(ids[i]);
              if (sound2) {
                sound2._muted = muted;
                if (sound2._interval) {
                  self._stopFade(sound2._id);
                }
                if (self._webAudio && sound2._node) {
                  sound2._node.gain.setValueAtTime(muted ? 0 : sound2._volume, Howler2.ctx.currentTime);
                } else if (sound2._node) {
                  sound2._node.muted = Howler2._muted ? true : muted;
                }
                self._emit("mute", sound2._id);
              }
            }
            return self;
          },
          volume: function() {
            var self = this;
            var args = arguments;
            var vol, id;
            if (args.length === 0) {
              return self._volume;
            } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                vol = parseFloat(args[0]);
              }
            } else if (args.length >= 2) {
              vol = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound2;
            if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
              if (self._state !== "loaded" || self._playLock) {
                self._queue.push({
                  event: "volume",
                  action: function() {
                    self.volume.apply(self, args);
                  }
                });
                return self;
              }
              if (typeof id === "undefined") {
                self._volume = vol;
              }
              id = self._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound2 = self._soundById(id[i]);
                if (sound2) {
                  sound2._volume = vol;
                  if (!args[2]) {
                    self._stopFade(id[i]);
                  }
                  if (self._webAudio && sound2._node && !sound2._muted) {
                    sound2._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                  } else if (sound2._node && !sound2._muted) {
                    sound2._node.volume = vol * Howler2.volume();
                  }
                  self._emit("volume", sound2._id);
                }
              }
            } else {
              sound2 = id ? self._soundById(id) : self._sounds[0];
              return sound2 ? sound2._volume : 0;
            }
            return self;
          },
          fade: function(from, to, len, id) {
            var self = this;
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "fade",
                action: function() {
                  self.fade(from, to, len, id);
                }
              });
              return self;
            }
            from = Math.min(Math.max(0, parseFloat(from)), 1);
            to = Math.min(Math.max(0, parseFloat(to)), 1);
            len = parseFloat(len);
            self.volume(from, id);
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              var sound2 = self._soundById(ids[i]);
              if (sound2) {
                if (!id) {
                  self._stopFade(ids[i]);
                }
                if (self._webAudio && !sound2._muted) {
                  var currentTime = Howler2.ctx.currentTime;
                  var end = currentTime + len / 1e3;
                  sound2._volume = from;
                  sound2._node.gain.setValueAtTime(from, currentTime);
                  sound2._node.gain.linearRampToValueAtTime(to, end);
                }
                self._startFadeInterval(sound2, from, to, len, ids[i], typeof id === "undefined");
              }
            }
            return self;
          },
          _startFadeInterval: function(sound2, from, to, len, id, isGroup) {
            var self = this;
            var vol = from;
            var diff = to - from;
            var steps = Math.abs(diff / 0.01);
            var stepLen = Math.max(4, steps > 0 ? len / steps : len);
            var lastTick = Date.now();
            sound2._fadeTo = to;
            sound2._interval = setInterval(function() {
              var tick = (Date.now() - lastTick) / len;
              lastTick = Date.now();
              vol += diff * tick;
              vol = Math.round(vol * 100) / 100;
              if (diff < 0) {
                vol = Math.max(to, vol);
              } else {
                vol = Math.min(to, vol);
              }
              if (self._webAudio) {
                sound2._volume = vol;
              } else {
                self.volume(vol, sound2._id, true);
              }
              if (isGroup) {
                self._volume = vol;
              }
              if (to < from && vol <= to || to > from && vol >= to) {
                clearInterval(sound2._interval);
                sound2._interval = null;
                sound2._fadeTo = null;
                self.volume(to, sound2._id);
                self._emit("fade", sound2._id);
              }
            }, stepLen);
          },
          _stopFade: function(id) {
            var self = this;
            var sound2 = self._soundById(id);
            if (sound2 && sound2._interval) {
              if (self._webAudio) {
                sound2._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
              }
              clearInterval(sound2._interval);
              sound2._interval = null;
              self.volume(sound2._fadeTo, id);
              sound2._fadeTo = null;
              self._emit("fade", id);
            }
            return self;
          },
          loop: function() {
            var self = this;
            var args = arguments;
            var loop, id, sound2;
            if (args.length === 0) {
              return self._loop;
            } else if (args.length === 1) {
              if (typeof args[0] === "boolean") {
                loop = args[0];
                self._loop = loop;
              } else {
                sound2 = self._soundById(parseInt(args[0], 10));
                return sound2 ? sound2._loop : false;
              }
            } else if (args.length === 2) {
              loop = args[0];
              id = parseInt(args[1], 10);
            }
            var ids = self._getSoundIds(id);
            for (var i = 0; i < ids.length; i++) {
              sound2 = self._soundById(ids[i]);
              if (sound2) {
                sound2._loop = loop;
                if (self._webAudio && sound2._node && sound2._node.bufferSource) {
                  sound2._node.bufferSource.loop = loop;
                  if (loop) {
                    sound2._node.bufferSource.loopStart = sound2._start || 0;
                    sound2._node.bufferSource.loopEnd = sound2._stop;
                    if (self.playing(ids[i])) {
                      self.pause(ids[i], true);
                      self.play(ids[i], true);
                    }
                  }
                }
              }
            }
            return self;
          },
          rate: function() {
            var self = this;
            var args = arguments;
            var rate, id;
            if (args.length === 0) {
              id = self._sounds[0]._id;
            } else if (args.length === 1) {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else {
                rate = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              rate = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            var sound2;
            if (typeof rate === "number") {
              if (self._state !== "loaded" || self._playLock) {
                self._queue.push({
                  event: "rate",
                  action: function() {
                    self.rate.apply(self, args);
                  }
                });
                return self;
              }
              if (typeof id === "undefined") {
                self._rate = rate;
              }
              id = self._getSoundIds(id);
              for (var i = 0; i < id.length; i++) {
                sound2 = self._soundById(id[i]);
                if (sound2) {
                  if (self.playing(id[i])) {
                    sound2._rateSeek = self.seek(id[i]);
                    sound2._playStart = self._webAudio ? Howler2.ctx.currentTime : sound2._playStart;
                  }
                  sound2._rate = rate;
                  if (self._webAudio && sound2._node && sound2._node.bufferSource) {
                    sound2._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
                  } else if (sound2._node) {
                    sound2._node.playbackRate = rate;
                  }
                  var seek = self.seek(id[i]);
                  var duration = (self._sprite[sound2._sprite][0] + self._sprite[sound2._sprite][1]) / 1e3 - seek;
                  var timeout = duration * 1e3 / Math.abs(sound2._rate);
                  if (self._endTimers[id[i]] || !sound2._paused) {
                    self._clearTimer(id[i]);
                    self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound2), timeout);
                  }
                  self._emit("rate", sound2._id);
                }
              }
            } else {
              sound2 = self._soundById(id);
              return sound2 ? sound2._rate : self._rate;
            }
            return self;
          },
          seek: function() {
            var self = this;
            var args = arguments;
            var seek, id;
            if (args.length === 0) {
              if (self._sounds.length) {
                id = self._sounds[0]._id;
              }
            } else if (args.length === 1) {
              var ids = self._getSoundIds();
              var index = ids.indexOf(args[0]);
              if (index >= 0) {
                id = parseInt(args[0], 10);
              } else if (self._sounds.length) {
                id = self._sounds[0]._id;
                seek = parseFloat(args[0]);
              }
            } else if (args.length === 2) {
              seek = parseFloat(args[0]);
              id = parseInt(args[1], 10);
            }
            if (typeof id === "undefined") {
              return 0;
            }
            if (typeof seek === "number" && (self._state !== "loaded" || self._playLock)) {
              self._queue.push({
                event: "seek",
                action: function() {
                  self.seek.apply(self, args);
                }
              });
              return self;
            }
            var sound2 = self._soundById(id);
            if (sound2) {
              if (typeof seek === "number" && seek >= 0) {
                var playing = self.playing(id);
                if (playing) {
                  self.pause(id, true);
                }
                sound2._seek = seek;
                sound2._ended = false;
                self._clearTimer(id);
                if (!self._webAudio && sound2._node && !isNaN(sound2._node.duration)) {
                  sound2._node.currentTime = seek;
                }
                var seekAndEmit = function() {
                  if (playing) {
                    self.play(id, true);
                  }
                  self._emit("seek", id);
                };
                if (playing && !self._webAudio) {
                  var emitSeek = function() {
                    if (!self._playLock) {
                      seekAndEmit();
                    } else {
                      setTimeout(emitSeek, 0);
                    }
                  };
                  setTimeout(emitSeek, 0);
                } else {
                  seekAndEmit();
                }
              } else {
                if (self._webAudio) {
                  var realTime = self.playing(id) ? Howler2.ctx.currentTime - sound2._playStart : 0;
                  var rateSeek = sound2._rateSeek ? sound2._rateSeek - sound2._seek : 0;
                  return sound2._seek + (rateSeek + realTime * Math.abs(sound2._rate));
                } else {
                  return sound2._node.currentTime;
                }
              }
            }
            return self;
          },
          playing: function(id) {
            var self = this;
            if (typeof id === "number") {
              var sound2 = self._soundById(id);
              return sound2 ? !sound2._paused : false;
            }
            for (var i = 0; i < self._sounds.length; i++) {
              if (!self._sounds[i]._paused) {
                return true;
              }
            }
            return false;
          },
          duration: function(id) {
            var self = this;
            var duration = self._duration;
            var sound2 = self._soundById(id);
            if (sound2) {
              duration = self._sprite[sound2._sprite][1] / 1e3;
            }
            return duration;
          },
          state: function() {
            return this._state;
          },
          unload: function() {
            var self = this;
            var sounds = self._sounds;
            for (var i = 0; i < sounds.length; i++) {
              if (!sounds[i]._paused) {
                self.stop(sounds[i]._id);
              }
              if (!self._webAudio) {
                self._clearSound(sounds[i]._node);
                sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
                sounds[i]._node.removeEventListener(Howler2._canPlayEvent, sounds[i]._loadFn, false);
                sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
                Howler2._releaseHtml5Audio(sounds[i]._node);
              }
              delete sounds[i]._node;
              self._clearTimer(sounds[i]._id);
            }
            var index = Howler2._howls.indexOf(self);
            if (index >= 0) {
              Howler2._howls.splice(index, 1);
            }
            var remCache = true;
            for (i = 0; i < Howler2._howls.length; i++) {
              if (Howler2._howls[i]._src === self._src || self._src.indexOf(Howler2._howls[i]._src) >= 0) {
                remCache = false;
                break;
              }
            }
            if (cache && remCache) {
              delete cache[self._src];
            }
            Howler2.noAudio = false;
            self._state = "unloaded";
            self._sounds = [];
            self = null;
            return null;
          },
          on: function(event, fn, id, once) {
            var self = this;
            var events = self["_on" + event];
            if (typeof fn === "function") {
              events.push(once ? { id, fn, once } : { id, fn });
            }
            return self;
          },
          off: function(event, fn, id) {
            var self = this;
            var events = self["_on" + event];
            var i = 0;
            if (typeof fn === "number") {
              id = fn;
              fn = null;
            }
            if (fn || id) {
              for (i = 0; i < events.length; i++) {
                var isId = id === events[i].id;
                if (fn === events[i].fn && isId || !fn && isId) {
                  events.splice(i, 1);
                  break;
                }
              }
            } else if (event) {
              self["_on" + event] = [];
            } else {
              var keys = Object.keys(self);
              for (i = 0; i < keys.length; i++) {
                if (keys[i].indexOf("_on") === 0 && Array.isArray(self[keys[i]])) {
                  self[keys[i]] = [];
                }
              }
            }
            return self;
          },
          once: function(event, fn, id) {
            var self = this;
            self.on(event, fn, id, 1);
            return self;
          },
          _emit: function(event, id, msg) {
            var self = this;
            var events = self["_on" + event];
            for (var i = events.length - 1; i >= 0; i--) {
              if (!events[i].id || events[i].id === id || event === "load") {
                setTimeout(function(fn) {
                  fn.call(this, id, msg);
                }.bind(self, events[i].fn), 0);
                if (events[i].once) {
                  self.off(event, events[i].fn, events[i].id);
                }
              }
            }
            self._loadQueue(event);
            return self;
          },
          _loadQueue: function(event) {
            var self = this;
            if (self._queue.length > 0) {
              var task = self._queue[0];
              if (task.event === event) {
                self._queue.shift();
                self._loadQueue();
              }
              if (!event) {
                task.action();
              }
            }
            return self;
          },
          _ended: function(sound2) {
            var self = this;
            var sprite = sound2._sprite;
            if (!self._webAudio && sound2._node && !sound2._node.paused && !sound2._node.ended && sound2._node.currentTime < sound2._stop) {
              setTimeout(self._ended.bind(self, sound2), 100);
              return self;
            }
            var loop = !!(sound2._loop || self._sprite[sprite][2]);
            self._emit("end", sound2._id);
            if (!self._webAudio && loop) {
              self.stop(sound2._id, true).play(sound2._id);
            }
            if (self._webAudio && loop) {
              self._emit("play", sound2._id);
              sound2._seek = sound2._start || 0;
              sound2._rateSeek = 0;
              sound2._playStart = Howler2.ctx.currentTime;
              var timeout = (sound2._stop - sound2._start) * 1e3 / Math.abs(sound2._rate);
              self._endTimers[sound2._id] = setTimeout(self._ended.bind(self, sound2), timeout);
            }
            if (self._webAudio && !loop) {
              sound2._paused = true;
              sound2._ended = true;
              sound2._seek = sound2._start || 0;
              sound2._rateSeek = 0;
              self._clearTimer(sound2._id);
              self._cleanBuffer(sound2._node);
              Howler2._autoSuspend();
            }
            if (!self._webAudio && !loop) {
              self.stop(sound2._id, true);
            }
            return self;
          },
          _clearTimer: function(id) {
            var self = this;
            if (self._endTimers[id]) {
              if (typeof self._endTimers[id] !== "function") {
                clearTimeout(self._endTimers[id]);
              } else {
                var sound2 = self._soundById(id);
                if (sound2 && sound2._node) {
                  sound2._node.removeEventListener("ended", self._endTimers[id], false);
                }
              }
              delete self._endTimers[id];
            }
            return self;
          },
          _soundById: function(id) {
            var self = this;
            for (var i = 0; i < self._sounds.length; i++) {
              if (id === self._sounds[i]._id) {
                return self._sounds[i];
              }
            }
            return null;
          },
          _inactiveSound: function() {
            var self = this;
            self._drain();
            for (var i = 0; i < self._sounds.length; i++) {
              if (self._sounds[i]._ended) {
                return self._sounds[i].reset();
              }
            }
            return new Sound2(self);
          },
          _drain: function() {
            var self = this;
            var limit = self._pool;
            var cnt = 0;
            var i = 0;
            if (self._sounds.length < limit) {
              return;
            }
            for (i = 0; i < self._sounds.length; i++) {
              if (self._sounds[i]._ended) {
                cnt++;
              }
            }
            for (i = self._sounds.length - 1; i >= 0; i--) {
              if (cnt <= limit) {
                return;
              }
              if (self._sounds[i]._ended) {
                if (self._webAudio && self._sounds[i]._node) {
                  self._sounds[i]._node.disconnect(0);
                }
                self._sounds.splice(i, 1);
                cnt--;
              }
            }
          },
          _getSoundIds: function(id) {
            var self = this;
            if (typeof id === "undefined") {
              var ids = [];
              for (var i = 0; i < self._sounds.length; i++) {
                ids.push(self._sounds[i]._id);
              }
              return ids;
            } else {
              return [id];
            }
          },
          _refreshBuffer: function(sound2) {
            var self = this;
            sound2._node.bufferSource = Howler2.ctx.createBufferSource();
            sound2._node.bufferSource.buffer = cache[self._src];
            if (sound2._panner) {
              sound2._node.bufferSource.connect(sound2._panner);
            } else {
              sound2._node.bufferSource.connect(sound2._node);
            }
            sound2._node.bufferSource.loop = sound2._loop;
            if (sound2._loop) {
              sound2._node.bufferSource.loopStart = sound2._start || 0;
              sound2._node.bufferSource.loopEnd = sound2._stop || 0;
            }
            sound2._node.bufferSource.playbackRate.setValueAtTime(sound2._rate, Howler2.ctx.currentTime);
            return self;
          },
          _cleanBuffer: function(node) {
            var self = this;
            var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
            if (Howler2._scratchBuffer && node.bufferSource) {
              node.bufferSource.onended = null;
              node.bufferSource.disconnect(0);
              if (isIOS) {
                try {
                  node.bufferSource.buffer = Howler2._scratchBuffer;
                } catch (e) {
                }
              }
            }
            node.bufferSource = null;
            return self;
          },
          _clearSound: function(node) {
            var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
            if (!checkIE) {
              node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
            }
          }
        };
        var Sound2 = function(howl) {
          this._parent = howl;
          this.init();
        };
        Sound2.prototype = {
          init: function() {
            var self = this;
            var parent = self._parent;
            self._muted = parent._muted;
            self._loop = parent._loop;
            self._volume = parent._volume;
            self._rate = parent._rate;
            self._seek = 0;
            self._paused = true;
            self._ended = true;
            self._sprite = "__default";
            self._id = ++Howler2._counter;
            parent._sounds.push(self);
            self.create();
            return self;
          },
          create: function() {
            var self = this;
            var parent = self._parent;
            var volume = Howler2._muted || self._muted || self._parent._muted ? 0 : self._volume;
            if (parent._webAudio) {
              self._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
              self._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
              self._node.paused = true;
              self._node.connect(Howler2.masterGain);
            } else if (!Howler2.noAudio) {
              self._node = Howler2._obtainHtml5Audio();
              self._errorFn = self._errorListener.bind(self);
              self._node.addEventListener("error", self._errorFn, false);
              self._loadFn = self._loadListener.bind(self);
              self._node.addEventListener(Howler2._canPlayEvent, self._loadFn, false);
              self._endFn = self._endListener.bind(self);
              self._node.addEventListener("ended", self._endFn, false);
              self._node.src = parent._src;
              self._node.preload = parent._preload === true ? "auto" : parent._preload;
              self._node.volume = volume * Howler2.volume();
              self._node.load();
            }
            return self;
          },
          reset: function() {
            var self = this;
            var parent = self._parent;
            self._muted = parent._muted;
            self._loop = parent._loop;
            self._volume = parent._volume;
            self._rate = parent._rate;
            self._seek = 0;
            self._rateSeek = 0;
            self._paused = true;
            self._ended = true;
            self._sprite = "__default";
            self._id = ++Howler2._counter;
            return self;
          },
          _errorListener: function() {
            var self = this;
            self._parent._emit("loaderror", self._id, self._node.error ? self._node.error.code : 0);
            self._node.removeEventListener("error", self._errorFn, false);
          },
          _loadListener: function() {
            var self = this;
            var parent = self._parent;
            parent._duration = Math.ceil(self._node.duration * 10) / 10;
            if (Object.keys(parent._sprite).length === 0) {
              parent._sprite = { __default: [0, parent._duration * 1e3] };
            }
            if (parent._state !== "loaded") {
              parent._state = "loaded";
              parent._emit("load");
              parent._loadQueue();
            }
            self._node.removeEventListener(Howler2._canPlayEvent, self._loadFn, false);
          },
          _endListener: function() {
            var self = this;
            var parent = self._parent;
            if (parent._duration === Infinity) {
              parent._duration = Math.ceil(self._node.duration * 10) / 10;
              if (parent._sprite.__default[1] === Infinity) {
                parent._sprite.__default[1] = parent._duration * 1e3;
              }
              parent._ended(self);
            }
            self._node.removeEventListener("ended", self._endFn, false);
          }
        };
        var cache = {};
        var loadBuffer = function(self) {
          var url = self._src;
          if (cache[url]) {
            self._duration = cache[url].duration;
            loadSound(self);
            return;
          }
          if (/^data:[^;]+;base64,/.test(url)) {
            var data = atob(url.split(",")[1]);
            var dataView = new Uint8Array(data.length);
            for (var i = 0; i < data.length; ++i) {
              dataView[i] = data.charCodeAt(i);
            }
            decodeAudioData(dataView.buffer, self);
          } else {
            var xhr = new XMLHttpRequest();
            xhr.open(self._xhr.method, url, true);
            xhr.withCredentials = self._xhr.withCredentials;
            xhr.responseType = "arraybuffer";
            if (self._xhr.headers) {
              Object.keys(self._xhr.headers).forEach(function(key) {
                xhr.setRequestHeader(key, self._xhr.headers[key]);
              });
            }
            xhr.onload = function() {
              var code = (xhr.status + "")[0];
              if (code !== "0" && code !== "2" && code !== "3") {
                self._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
                return;
              }
              decodeAudioData(xhr.response, self);
            };
            xhr.onerror = function() {
              if (self._webAudio) {
                self._html5 = true;
                self._webAudio = false;
                self._sounds = [];
                delete cache[url];
                self.load();
              }
            };
            safeXhrSend(xhr);
          }
        };
        var safeXhrSend = function(xhr) {
          try {
            xhr.send();
          } catch (e) {
            xhr.onerror();
          }
        };
        var decodeAudioData = function(arraybuffer, self) {
          var error = function() {
            self._emit("loaderror", null, "Decoding audio data failed.");
          };
          var success = function(buffer) {
            if (buffer && self._sounds.length > 0) {
              cache[self._src] = buffer;
              loadSound(self, buffer);
            } else {
              error();
            }
          };
          if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
            Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
          } else {
            Howler2.ctx.decodeAudioData(arraybuffer, success, error);
          }
        };
        var loadSound = function(self, buffer) {
          if (buffer && !self._duration) {
            self._duration = buffer.duration;
          }
          if (Object.keys(self._sprite).length === 0) {
            self._sprite = { __default: [0, self._duration * 1e3] };
          }
          if (self._state !== "loaded") {
            self._state = "loaded";
            self._emit("load");
            self._loadQueue();
          }
        };
        var setupAudioContext = function() {
          if (!Howler2.usingWebAudio) {
            return;
          }
          try {
            if (typeof AudioContext !== "undefined") {
              Howler2.ctx = new AudioContext();
            } else if (typeof webkitAudioContext !== "undefined") {
              Howler2.ctx = new webkitAudioContext();
            } else {
              Howler2.usingWebAudio = false;
            }
          } catch (e) {
            Howler2.usingWebAudio = false;
          }
          if (!Howler2.ctx) {
            Howler2.usingWebAudio = false;
          }
          var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
          var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
          var version = appVersion ? parseInt(appVersion[1], 10) : null;
          if (iOS && version && version < 9) {
            var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
            if (Howler2._navigator && !safari) {
              Howler2.usingWebAudio = false;
            }
          }
          if (Howler2.usingWebAudio) {
            Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
            Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
            Howler2.masterGain.connect(Howler2.ctx.destination);
          }
          Howler2._setup();
        };
        if (typeof define === "function" && define.amd) {
          define([], function() {
            return {
              Howler: Howler2,
              Howl: Howl3
            };
          });
        }
        if (typeof exports !== "undefined") {
          exports.Howler = Howler2;
          exports.Howl = Howl3;
        }
        if (typeof global !== "undefined") {
          global.HowlerGlobal = HowlerGlobal2;
          global.Howler = Howler2;
          global.Howl = Howl3;
          global.Sound = Sound2;
        } else if (typeof window !== "undefined") {
          window.HowlerGlobal = HowlerGlobal2;
          window.Howler = Howler2;
          window.Howl = Howl3;
          window.Sound = Sound2;
        }
      })();
      (function() {
        "use strict";
        HowlerGlobal.prototype._pos = [0, 0, 0];
        HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
        HowlerGlobal.prototype.stereo = function(pan) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          for (var i = self._howls.length - 1; i >= 0; i--) {
            self._howls[i].stereo(pan);
          }
          return self;
        };
        HowlerGlobal.prototype.pos = function(x, y, z) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          y = typeof y !== "number" ? self._pos[1] : y;
          z = typeof z !== "number" ? self._pos[2] : z;
          if (typeof x === "number") {
            self._pos = [x, y, z];
            if (typeof self.ctx.listener.positionX !== "undefined") {
              self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
              self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
              self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
            } else {
              self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
            }
          } else {
            return self._pos;
          }
          return self;
        };
        HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
          var self = this;
          if (!self.ctx || !self.ctx.listener) {
            return self;
          }
          var or = self._orientation;
          y = typeof y !== "number" ? or[1] : y;
          z = typeof z !== "number" ? or[2] : z;
          xUp = typeof xUp !== "number" ? or[3] : xUp;
          yUp = typeof yUp !== "number" ? or[4] : yUp;
          zUp = typeof zUp !== "number" ? or[5] : zUp;
          if (typeof x === "number") {
            self._orientation = [x, y, z, xUp, yUp, zUp];
            if (typeof self.ctx.listener.forwardX !== "undefined") {
              self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
              self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
            } else {
              self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
            }
          } else {
            return or;
          }
          return self;
        };
        Howl.prototype.init = function(_super) {
          return function(o) {
            var self = this;
            self._orientation = o.orientation || [1, 0, 0];
            self._stereo = o.stereo || null;
            self._pos = o.pos || null;
            self._pannerAttr = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
            };
            self._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
            self._onpos = o.onpos ? [{ fn: o.onpos }] : [];
            self._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
            return _super.call(this, o);
          };
        }(Howl.prototype.init);
        Howl.prototype.stereo = function(pan, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "stereo",
              action: function() {
                self.stereo(pan, id);
              }
            });
            return self;
          }
          var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
          if (typeof id === "undefined") {
            if (typeof pan === "number") {
              self._stereo = pan;
              self._pos = [pan, 0, 0];
            } else {
              return self._stereo;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound2 = self._soundById(ids[i]);
            if (sound2) {
              if (typeof pan === "number") {
                sound2._stereo = pan;
                sound2._pos = [pan, 0, 0];
                if (sound2._node) {
                  sound2._pannerAttr.panningModel = "equalpower";
                  if (!sound2._panner || !sound2._panner.pan) {
                    setupPanner(sound2, pannerType);
                  }
                  if (pannerType === "spatial") {
                    if (typeof sound2._panner.positionX !== "undefined") {
                      sound2._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                      sound2._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                      sound2._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                    } else {
                      sound2._panner.setPosition(pan, 0, 0);
                    }
                  } else {
                    sound2._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                  }
                }
                self._emit("stereo", sound2._id);
              } else {
                return sound2._stereo;
              }
            }
          }
          return self;
        };
        Howl.prototype.pos = function(x, y, z, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "pos",
              action: function() {
                self.pos(x, y, z, id);
              }
            });
            return self;
          }
          y = typeof y !== "number" ? 0 : y;
          z = typeof z !== "number" ? -0.5 : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self._pos = [x, y, z];
            } else {
              return self._pos;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound2 = self._soundById(ids[i]);
            if (sound2) {
              if (typeof x === "number") {
                sound2._pos = [x, y, z];
                if (sound2._node) {
                  if (!sound2._panner || sound2._panner.pan) {
                    setupPanner(sound2, "spatial");
                  }
                  if (typeof sound2._panner.positionX !== "undefined") {
                    sound2._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound2._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound2._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound2._panner.setPosition(x, y, z);
                  }
                }
                self._emit("pos", sound2._id);
              } else {
                return sound2._pos;
              }
            }
          }
          return self;
        };
        Howl.prototype.orientation = function(x, y, z, id) {
          var self = this;
          if (!self._webAudio) {
            return self;
          }
          if (self._state !== "loaded") {
            self._queue.push({
              event: "orientation",
              action: function() {
                self.orientation(x, y, z, id);
              }
            });
            return self;
          }
          y = typeof y !== "number" ? self._orientation[1] : y;
          z = typeof z !== "number" ? self._orientation[2] : z;
          if (typeof id === "undefined") {
            if (typeof x === "number") {
              self._orientation = [x, y, z];
            } else {
              return self._orientation;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound2 = self._soundById(ids[i]);
            if (sound2) {
              if (typeof x === "number") {
                sound2._orientation = [x, y, z];
                if (sound2._node) {
                  if (!sound2._panner) {
                    if (!sound2._pos) {
                      sound2._pos = self._pos || [0, 0, -0.5];
                    }
                    setupPanner(sound2, "spatial");
                  }
                  if (typeof sound2._panner.orientationX !== "undefined") {
                    sound2._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                    sound2._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                    sound2._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
                  } else {
                    sound2._panner.setOrientation(x, y, z);
                  }
                }
                self._emit("orientation", sound2._id);
              } else {
                return sound2._orientation;
              }
            }
          }
          return self;
        };
        Howl.prototype.pannerAttr = function() {
          var self = this;
          var args = arguments;
          var o, id, sound2;
          if (!self._webAudio) {
            return self;
          }
          if (args.length === 0) {
            return self._pannerAttr;
          } else if (args.length === 1) {
            if (typeof args[0] === "object") {
              o = args[0];
              if (typeof id === "undefined") {
                if (!o.pannerAttr) {
                  o.pannerAttr = {
                    coneInnerAngle: o.coneInnerAngle,
                    coneOuterAngle: o.coneOuterAngle,
                    coneOuterGain: o.coneOuterGain,
                    distanceModel: o.distanceModel,
                    maxDistance: o.maxDistance,
                    refDistance: o.refDistance,
                    rolloffFactor: o.rolloffFactor,
                    panningModel: o.panningModel
                  };
                }
                self._pannerAttr = {
                  coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
                  coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
                  coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
                  distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self._distanceModel,
                  maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self._maxDistance,
                  refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self._refDistance,
                  rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
                  panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self._panningModel
                };
              }
            } else {
              sound2 = self._soundById(parseInt(args[0], 10));
              return sound2 ? sound2._pannerAttr : self._pannerAttr;
            }
          } else if (args.length === 2) {
            o = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            sound2 = self._soundById(ids[i]);
            if (sound2) {
              var pa = sound2._pannerAttr;
              pa = {
                coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
                coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
                coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
                distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
                maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
                refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
                rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
                panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
              };
              var panner = sound2._panner;
              if (panner) {
                panner.coneInnerAngle = pa.coneInnerAngle;
                panner.coneOuterAngle = pa.coneOuterAngle;
                panner.coneOuterGain = pa.coneOuterGain;
                panner.distanceModel = pa.distanceModel;
                panner.maxDistance = pa.maxDistance;
                panner.refDistance = pa.refDistance;
                panner.rolloffFactor = pa.rolloffFactor;
                panner.panningModel = pa.panningModel;
              } else {
                if (!sound2._pos) {
                  sound2._pos = self._pos || [0, 0, -0.5];
                }
                setupPanner(sound2, "spatial");
              }
            }
          }
          return self;
        };
        Sound.prototype.init = function(_super) {
          return function() {
            var self = this;
            var parent = self._parent;
            self._orientation = parent._orientation;
            self._stereo = parent._stereo;
            self._pos = parent._pos;
            self._pannerAttr = parent._pannerAttr;
            _super.call(this);
            if (self._stereo) {
              parent.stereo(self._stereo);
            } else if (self._pos) {
              parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
            }
          };
        }(Sound.prototype.init);
        Sound.prototype.reset = function(_super) {
          return function() {
            var self = this;
            var parent = self._parent;
            self._orientation = parent._orientation;
            self._stereo = parent._stereo;
            self._pos = parent._pos;
            self._pannerAttr = parent._pannerAttr;
            if (self._stereo) {
              parent.stereo(self._stereo);
            } else if (self._pos) {
              parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
            } else if (self._panner) {
              self._panner.disconnect(0);
              self._panner = void 0;
              parent._refreshBuffer(self);
            }
            return _super.call(this);
          };
        }(Sound.prototype.reset);
        var setupPanner = function(sound2, type) {
          type = type || "spatial";
          if (type === "spatial") {
            sound2._panner = Howler.ctx.createPanner();
            sound2._panner.coneInnerAngle = sound2._pannerAttr.coneInnerAngle;
            sound2._panner.coneOuterAngle = sound2._pannerAttr.coneOuterAngle;
            sound2._panner.coneOuterGain = sound2._pannerAttr.coneOuterGain;
            sound2._panner.distanceModel = sound2._pannerAttr.distanceModel;
            sound2._panner.maxDistance = sound2._pannerAttr.maxDistance;
            sound2._panner.refDistance = sound2._pannerAttr.refDistance;
            sound2._panner.rolloffFactor = sound2._pannerAttr.rolloffFactor;
            sound2._panner.panningModel = sound2._pannerAttr.panningModel;
            if (typeof sound2._panner.positionX !== "undefined") {
              sound2._panner.positionX.setValueAtTime(sound2._pos[0], Howler.ctx.currentTime);
              sound2._panner.positionY.setValueAtTime(sound2._pos[1], Howler.ctx.currentTime);
              sound2._panner.positionZ.setValueAtTime(sound2._pos[2], Howler.ctx.currentTime);
            } else {
              sound2._panner.setPosition(sound2._pos[0], sound2._pos[1], sound2._pos[2]);
            }
            if (typeof sound2._panner.orientationX !== "undefined") {
              sound2._panner.orientationX.setValueAtTime(sound2._orientation[0], Howler.ctx.currentTime);
              sound2._panner.orientationY.setValueAtTime(sound2._orientation[1], Howler.ctx.currentTime);
              sound2._panner.orientationZ.setValueAtTime(sound2._orientation[2], Howler.ctx.currentTime);
            } else {
              sound2._panner.setOrientation(sound2._orientation[0], sound2._orientation[1], sound2._orientation[2]);
            }
          } else {
            sound2._panner = Howler.ctx.createStereoPanner();
            sound2._panner.pan.setValueAtTime(sound2._stereo, Howler.ctx.currentTime);
          }
          sound2._panner.connect(sound2._node);
          if (!sound2._paused) {
            sound2._parent.pause(sound2._id, true).play(sound2._id, true);
          }
        };
      })();
    }
  });

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
  var import_howler = __toModule(require_howler());
  var MaterialTypes;
  (function(MaterialTypes3) {
    MaterialTypes3[MaterialTypes3["air"] = 0] = "air";
    MaterialTypes3[MaterialTypes3["sand"] = 1] = "sand";
    MaterialTypes3[MaterialTypes3["wall"] = 2] = "wall";
  })(MaterialTypes || (MaterialTypes = {}));
  function sound(data) {
    return new import_howler.Howl({
      src: data[0],
      loop: true,
      preload: true,
      sprite: {
        draw: [data[1], data[2]]
      },
      volume: 0.8
    });
  }
  var Materials = [];
  Materials[0] = {
    name: "air",
    color: "#000000",
    fallSpeed: 0,
    sound: null
  };
  Materials[1] = {
    name: "sand",
    color: "#d2b48c",
    fallSpeed: 1,
    sound: sound(["sound/sand.mp3", 3600, 300])
  };
  Materials[2] = {
    name: "wall",
    color: "#767676",
    fallSpeed: 0,
    sound: null
  };
  function getMaterial(id) {
    return Materials[id] || Materials[0];
  }

  // src/util/HEX2RGB.ts
  var hexToRgb = (hex) => hex.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b).substring(1).match(/.{2}/g).map((x) => parseInt(x, 16));

  // src/config.ts
  var config = {
    productName: "Sand Drawings",
    version: "0.1.0",
    background: "#000000",
    foreground: "#FFFFFF",
    dotScale: 0.5,
    dotColor: "#60727b",
    toolSize: 58
  };
  var config_default = config;

  // src/Renderer.ts
  var renderCache = {};
  var Renderer = class {
    constructor(game) {
      this.game = game;
      this.statStart = [2, 4];
      this.statPad = 14;
      this.frameLatency = 0;
      this.fps = 0;
      this.initData();
    }
    initData() {
      if (this.tempCan)
        this.tempCan.remove();
      this.tempCan = document.createElement("canvas");
      this.tempCan.width = this.game.canvas.width;
      this.tempCan.height = this.game.canvas.height;
      this.tempCtx = this.tempCan.getContext("2d");
      this.imgData = this.tempCtx.createImageData(this.game.canvas.width, this.game.canvas.height);
      this.pixData = this.imgData.data;
    }
    initFont() {
      this.game.ctx.font = "12px Pixeloid";
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
      this.addStat(`${config_default.productName} v${config_default.version}`);
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
      let sound2 = getMaterial(this.material).sound;
      if (sound2)
        sound2.play("draw");
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
      let sound2 = getMaterial(this.material).sound;
      if (sound2)
        sound2.stop();
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
          let pixs = t.game.pixels[Math.round(pos.x + x - t.size / 2)];
          let pix = Math.round(pos.y + y - t.size / 2);
          if (!pixs || pixs[pix] == void 0)
            return;
          pixs[pix] = t.material;
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
    let tools = [
      ...document.querySelectorAll("#toolbar img")
    ];
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
      selctx.fillStyle = config_default.dotColor;
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
    tools[2].onclick = function(e) {
    };
    sizes.forEach((s, i) => {
      s.onclick = function() {
        game.pen.selsize = i;
        resetSizes(i);
      };
    });
    resetBar(0);
    resetSizes(game.pen.selsize);
    window.addEventListener("wheel", (e) => {
      let down = e.deltaY >= 0;
      let sz = down ? Math.max(0, game.pen.selsize - 1) : Math.min(game.pen.sizes.length - 1, game.pen.selsize + 1);
      game.pen.selsize = sz;
      resetSizes(sz);
    });
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
      let oldSize = [window.innerWidth, window.innerHeight];
      setInterval(function() {
        let newSize = [window.innerWidth, window.innerHeight];
        if (oldSize[0] !== newSize[0] || oldSize[1] !== newSize[1]) {
          oldSize = newSize;
          this.resize();
        }
      }.bind(this), 100);
    }
    resize() {
      this.canvas.width = window.innerWidth + 2;
      this.canvas.height = window.innerHeight;
      this.fillPixels(MaterialTypes.air);
      this.renderer.initData();
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
    fillPixels(type, force = false) {
      let posX = 0;
      this.pixels = this.pixels.slice(0, this.canvas.width);
      while (posX < this.canvas.width) {
        let arr = new Array(this.canvas.height).fill(type);
        let px = this.pixels[posX] || [];
        if (!force && px.length)
          px.map((p, i) => arr[i] = p);
        this.pixels[posX] = arr.slice(0, this.canvas.height);
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
/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.2.3
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
/*!
 *  howler.js v2.2.3
 *  howlerjs.com
 *
 *  (c) 2013-2020, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */
