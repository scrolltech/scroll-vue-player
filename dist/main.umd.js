(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["main"] = factory();
	else
		root["main"] = factory();
})((typeof self !== 'undefined' ? self : this), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "fb15");
/******/ })
/************************************************************************/
/******/ ({

/***/ "8875":
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;// addapted from the document.currentScript polyfill by Adam Miller
// MIT license
// source: https://github.com/amiller-gh/currentScript-polyfill

// added support for Firefox https://bugzilla.mozilla.org/show_bug.cgi?id=1620505

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
				__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
				(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(typeof self !== 'undefined' ? self : this, function () {
  function getCurrentScript () {
    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript')
    // for chrome
    if (!descriptor && 'currentScript' in document && document.currentScript) {
      return document.currentScript
    }

    // for other browsers with native support for currentScript
    if (descriptor && descriptor.get !== getCurrentScript && document.currentScript) {
      return document.currentScript
    }
  
    // IE 8-10 support script readyState
    // IE 11+ & Firefox support stack trace
    try {
      throw new Error();
    }
    catch (err) {
      // Find the second match for the "at" string to get file src url from stack.
      var ieStackRegExp = /.*at [^(]*\((.*):(.+):(.+)\)$/ig,
        ffStackRegExp = /@([^@]*):(\d+):(\d+)\s*$/ig,
        stackDetails = ieStackRegExp.exec(err.stack) || ffStackRegExp.exec(err.stack),
        scriptLocation = (stackDetails && stackDetails[1]) || false,
        line = (stackDetails && stackDetails[2]) || false,
        currentLocation = document.location.href.replace(document.location.hash, ''),
        pageSource,
        inlineScriptSourceRegExp,
        inlineScriptSource,
        scripts = document.getElementsByTagName('script'); // Live NodeList collection
  
      if (scriptLocation === currentLocation) {
        pageSource = document.documentElement.outerHTML;
        inlineScriptSourceRegExp = new RegExp('(?:[^\\n]+?\\n){0,' + (line - 2) + '}[^<]*<script>([\\d\\D]*?)<\\/script>[\\d\\D]*', 'i');
        inlineScriptSource = pageSource.replace(inlineScriptSourceRegExp, '$1').trim();
      }
  
      for (var i = 0; i < scripts.length; i++) {
        // If ready state is interactive, return the script tag
        if (scripts[i].readyState === 'interactive') {
          return scripts[i];
        }
  
        // If src matches, return the script tag
        if (scripts[i].src === scriptLocation) {
          return scripts[i];
        }
  
        // If inline source matches, return the script tag
        if (
          scriptLocation === currentLocation &&
          scripts[i].innerHTML &&
          scripts[i].innerHTML.trim() === inlineScriptSource
        ) {
          return scripts[i];
        }
      }
  
      // If no match, return null
      return null;
    }
  };

  return getCurrentScript
}));


/***/ }),

/***/ "fb15":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/setPublicPath.js
// This file is imported into lib/wc client bundles.

if (typeof window !== 'undefined') {
  var currentScript = window.document.currentScript
  if (true) {
    var getCurrentScript = __webpack_require__("8875")
    currentScript = getCurrentScript()

    // for backward compatibility, because previously we directly included the polyfill
    if (!('currentScript' in document)) {
      Object.defineProperty(document, 'currentScript', { get: getCurrentScript })
    }
  }

  var src = currentScript && currentScript.src.match(/(.+\/)[^/]+\.js(\?.*)?$/)
  if (src) {
    __webpack_require__.p = src[1] // eslint-disable-line
  }
}

// Indicate to webpack that this file can be concatenated
/* harmony default export */ var setPublicPath = (null);

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js?{"cacheDirectory":"node_modules/.cache/vue-loader","cacheIdentifier":"c2ecb1c6-vue-loader-template"}!./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/AudioPlayer.vue?vue&type=template&id=7023f042&
var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('audio',{ref:"audioEl",attrs:{"src":_vm.src},on:{"loadedmetadata":_vm.onLoadedMetaData,"loadeddata":_vm.onLodedData,"timeupdate":_vm.onTimeUpdate,"play":_vm.onPlay,"playing":_vm.onPlaying,"waiting":_vm.onBuffering,"pause":_vm.onPause,"ended":_vm.onEnded,"error":_vm.onError}}),_c('div',{ref:"playerEl",class:[
      'audio-player',
      _vm.paused ? '' : 'audio-player-playing',
      _vm.disabled ? 'audio-player-disabled' : ''
    ]},[_c('div',{ref:"playButton",staticClass:"player-button gold-button",on:{"click":_vm.handleMouseClick}},[_c('i',{class:['icon', _vm.paused ? 'audio-play-icon' : 'audio-pause-icon']})]),_c('div',{ref:"currentTimeEl",staticClass:"player-time player-current-time"},[_vm._v(" "+_vm._s(_vm.currentTimeText)+" ")]),_c('div',{ref:"playerSeekbarEl",staticClass:"player-seekbar"},[_c('div',{ref:"progressEl",class:['progress', _vm.buffering ? 'indeterminate-progress' : ''],on:{"mousemove":_vm.handleMouseMove,"touchmove":_vm.handleMouseMove,"mousedown":_vm.handleMouseDown,"touchstart":_vm.handleMouseDown,"mouseup":_vm.handleMouseUp,"mouseleave":_vm.handleMouseUp,"touchend":_vm.handleMouseUp,"touchcancel":_vm.handleMouseUp}},[_c('div',{directives:[{name:"show",rawName:"v-show",value:(!_vm.buffering),expression:"!buffering"}],ref:"progressDotEl",staticClass:"progress-pin"}),_c('div',{ref:"progressBarEl",staticClass:"progress-bar",staticStyle:{"width":"0"},attrs:{"role":"progressbar","aria-valuemin":"0","aria-valuemax":"100"}})])]),_c('div',{ref:"endTimeEl",staticClass:"player-time player-end-time"},[_vm._v(" "+_vm._s(_vm.endTimeText)+" ")])])])}
var staticRenderFns = []


// CONCATENATED MODULE: ./src/components/AudioPlayer.vue?vue&type=template&id=7023f042&

// CONCATENATED MODULE: ./node_modules/cache-loader/dist/cjs.js??ref--12-0!./node_modules/thread-loader/dist/cjs.js!./node_modules/babel-loader/lib!./node_modules/cache-loader/dist/cjs.js??ref--0-0!./node_modules/vue-loader/lib??vue-loader-options!./src/components/AudioPlayer.vue?vue&type=script&lang=js&
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
const formatTime = (secNum, format) => {
  if (!secNum) {
    return "00:00";
  }

  const minutes = Math.floor(secNum / 60);
  const seconds = Math.floor(secNum - minutes * 60);

  if (format === "ISO-8601") {
    return "T" + minutes + "M" + seconds + "S";
  }

  return ("0" + minutes).slice(-2) + ":" + ("0" + seconds).slice(-2);
};

let mousedown = false;
/* harmony default export */ var AudioPlayervue_type_script_lang_js_ = ({
  name: "AudioPlayer",
  props: ["src", "disabled"],

  data() {
    return {
      paused: true,
      buffering: false,
      endTime: 0,
      currentTime: 0
    };
  },

  watch: {
    paused: function (newValue, oldValue) {
      const audioEl = this.$refs.audioEl;
      if (newValue !== oldValue) newValue ? !audioEl.paused && audioEl.pause() : audioEl.play();
    },
    buffering: function (newValue, oldValue) {
      if (newValue !== oldValue && newValue) this.$refs.progressBarEl.style.width = "100%";
    }
  },
  computed: {
    endTimeText: function () {
      return this.endTime ? formatTime(this.endTime) : "--:--";
    },
    currentTimeText: function () {
      return formatTime(this.currentTime);
    }
  },
  methods: {
    onLoadedMetaData() {
      this.endTime = this.$refs.audioEl.duration;
      this.$emit("loadedmetadata");
    },

    onLodedData() {
      this.endTime = this.$refs.audioEl.duration;
      this.buffering = false;
    },

    handleMouseClick(e) {
      const {
        playButton,
        audioEl
      } = this.$refs;
      this.$emit("click", e);
      if (this.disabled) return;
      if (audioEl.readyState <= 1) this.buffering = true;
      if (playButton.contains(e.target)) this.paused = !this.paused;
    },

    onTimeUpdate() {
      if (mousedown) return;
      const {
        audioEl
      } = this.$refs;
      if (!this.endTime) this.endTime = audioEl.duration;

      if (audioEl.readyState > 1 && audioEl.currentTime) {
        if (!audioEl.paused) this.paused = false;else this.buffering = false;
        this.currentTime = audioEl.currentTime;
        this.handleProgess();
      }
    },

    handleMouseDown() {
      if (mousedown || this.disabled) return;
      mousedown = true;
    },

    handleMouseUp(e) {
      if (!mousedown || this.disabled) return;
      mousedown && this.scrub(e);
      mousedown = false;
    },

    handleMouseMove(e) {
      const isTouchEvent = e.type.includes("touch");
      const {
        progressEl
      } = this.$refs;
      const touchPointY = isTouchEvent ? e.touches[0].clientY : e.clientY;
      const progressElOffset = progressEl.getBoundingClientRect();
      if (!mousedown || this.disabled) return;
      if (e.cancelable) e.preventDefault();
      mousedown && this.scrub(e);

      if (touchPointY <= progressElOffset.top || touchPointY >= progressElOffset.top + progressEl.clientHeight) {
        mousedown = false;
        this.scrub(e);
      }
    },

    handleProgess() {
      const {
        progressBarEl,
        progressDotEl,
        audioEl
      } = this.$refs;
      const percent = audioEl.currentTime / audioEl.duration * 100;
      progressBarEl.style.width = `${percent}%`;
      progressDotEl.style.left = `${percent}%`;
    },

    scrub(e) {
      const isTouchEvent = e.type.includes("touch");
      const {
        progressBarEl,
        progressEl,
        progressDotEl,
        audioEl
      } = this.$refs;
      const progressOffset = progressEl.getBoundingClientRect();
      const progressWidth = progressEl.clientWidth;
      let slidePosition = (isTouchEvent ? e.changedTouches[0].clientX : e.clientX) - progressOffset.left;

      if (slidePosition < 0) {
        slidePosition = 0;
      } else if (slidePosition > progressWidth) {
        slidePosition = progressWidth - 1;
      }

      if (slidePosition >= 0 && slidePosition <= progressWidth - 1) {
        const scrubTime = slidePosition / progressWidth * audioEl.duration;
        const percent = scrubTime / audioEl.duration * 100;
        if (!this.buffering) progressBarEl.style.width = `${percent}%`;
        progressDotEl.style.left = `${percent}%`;
        this.currentTime = scrubTime;

        if (["click", "mouseup", "touchend", "touchcancel", "touchleave", "mouseleave"].includes(e.type) || !mousedown && ["touchmove", "mousemove"].includes(e.type) || slidePosition === 0 || slidePosition === progressWidth) {
          audioEl.currentTime = scrubTime;
        }
      }
    },

    onPlay(e) {
      if (window.currentlyPlaying && window.currentlyPlaying !== e.target) {
        window.currentlyPlaying.pause();
      }

      window.currentlyPlaying = e.target;
      this.paused = false;
    },

    onPlaying() {
      this.buffering = false;
    },

    onPause() {
      this.paused = true;
    },

    onEnded() {
      this.paused = true;
      this.currentTime = 0;
      this.$refs.audioEl.currentTime = 0;
      this.handleProgess();
    },

    onBuffering() {
      this.buffering = true;
    },

    onError(e) {
      this.paused = true;
      this.buffering = false;
      this.$emit("error", e);
    }

  }
});
// CONCATENATED MODULE: ./src/components/AudioPlayer.vue?vue&type=script&lang=js&
 /* harmony default export */ var components_AudioPlayervue_type_script_lang_js_ = (AudioPlayervue_type_script_lang_js_); 
// CONCATENATED MODULE: ./node_modules/vue-loader/lib/runtime/componentNormalizer.js
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file (except for modules).
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

function normalizeComponent (
  scriptExports,
  render,
  staticRenderFns,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier, /* server only */
  shadowMode /* vue-cli only */
) {
  // Vue.extend constructor export interop
  var options = typeof scriptExports === 'function'
    ? scriptExports.options
    : scriptExports

  // render functions
  if (render) {
    options.render = render
    options.staticRenderFns = staticRenderFns
    options._compiled = true
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true
  }

  // scopedId
  if (scopeId) {
    options._scopeId = 'data-v-' + scopeId
  }

  var hook
  if (moduleIdentifier) { // server build
    hook = function (context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext) // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context)
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier)
      }
    }
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook
  } else if (injectStyles) {
    hook = shadowMode
      ? function () {
        injectStyles.call(
          this,
          (options.functional ? this.parent : this).$root.$options.shadowRoot
        )
      }
      : injectStyles
  }

  if (hook) {
    if (options.functional) {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook
      // register for functional component in vue file
      var originalRender = options.render
      options.render = function renderWithStyleInjection (h, context) {
        hook.call(context)
        return originalRender(h, context)
      }
    } else {
      // inject component registration as beforeCreate hook
      var existing = options.beforeCreate
      options.beforeCreate = existing
        ? [].concat(existing, hook)
        : [hook]
    }
  }

  return {
    exports: scriptExports,
    options: options
  }
}

// CONCATENATED MODULE: ./src/components/AudioPlayer.vue





/* normalize component */

var component = normalizeComponent(
  components_AudioPlayervue_type_script_lang_js_,
  render,
  staticRenderFns,
  false,
  null,
  null,
  null
  
)

/* harmony default export */ var AudioPlayer = (component.exports);
// CONCATENATED MODULE: ./node_modules/@vue/cli-service/lib/commands/build/entry-lib.js


/* harmony default export */ var entry_lib = __webpack_exports__["default"] = (AudioPlayer);



/***/ })

/******/ })["default"];
});
//# sourceMappingURL=main.umd.js.map