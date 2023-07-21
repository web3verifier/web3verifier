/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/url.ts":
/*!********************!*\
  !*** ./src/url.ts ***!
  \********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SECURITY_SERVER: () => (/* binding */ SECURITY_SERVER),
/* harmony export */   SOLANA_BLOCKCHAIN_SERVER: () => (/* binding */ SOLANA_BLOCKCHAIN_SERVER)
/* harmony export */ });
var SECURITY_SERVER = "https://192.168.15.6:4433";
//export const SOLANA_BLOCKCHAIN_SERVER  = "https://api.mainnet-beta.solana.com" 
var SOLANA_BLOCKCHAIN_SERVER = "https://solana-mainnet.g.alchemy.com/v2/T7lJiNxz10BQyNLVP9x4T26e7crdnyFU";

/***/ }),

/***/ "./src/util.ts":
/*!*********************!*\
  !*** ./src/util.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   split: () => (/* binding */ split)
/* harmony export */ });
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function split(src, delimiter, keys) {
  var splited = src.split(delimiter);
  var keyvalue = {};
  var _iterator = _createForOfIteratorHelper(splited),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var s = _step.value;
      var _iterator2 = _createForOfIteratorHelper(keys),
        _step2;
      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var key = _step2.value;
          if (s.indexOf(key + "=") !== -1) {
            var length = (key + "=").length;
            var value = s.substring(length, s.length);
            keyvalue[key] = value;
            continue;
          }
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  if (Object.keys(keyvalue).length !== keys.length) {
    throw Error("expect key " + keys + " is not proper");
  }
  return keyvalue;
}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!***********************!*\
  !*** ./src/verify.ts ***!
  \***********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./util */ "./src/util.ts");
/* harmony import */ var _url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url */ "./src/url.ts");


function send(url, callback) {
  var connect = new XMLHttpRequest();
  connect.open('GET', url, true);
  connect.onreadystatechange = function () {
    if (connect.readyState === 4 && connect.status === 200) {
      callback(connect.responseText);
    } else if (connect.status >= 307 && connect.readyState === 4) {
      alert('error');
    }
  };
  connect.send(null);
}
function isIFrame(input) {
  return input !== null && input.tagName === 'IFRAME';
}
function postMessage(iframe, msg) {
  if (isIFrame(iframe) && iframe.contentWindow) {
    iframe.contentWindow.postMessage(msg, _url__WEBPACK_IMPORTED_MODULE_1__.SECURITY_SERVER);
  }
}
var iframe = document.createElement('iframe');
iframe.src = _url__WEBPACK_IMPORTED_MODULE_1__.SECURITY_SERVER + '/verify_core_v0.7.html';
var web3verifier = document.getElementById('web3verifier');
web3verifier.appendChild(iframe);
window.addEventListener('message', function (event) {
  if (event.origin !== _url__WEBPACK_IMPORTED_MODULE_1__.SECURITY_SERVER) {
    return;
  }
  if (event.data === 'web3verifier_getverifytype@') {
    var el = document.getElementById("web3verifier");
    var type = el.getAttribute("verify_type");
    postMessage(iframe, 'verify_type=' + type);
  } else if (event.data === 'web3verifier_getcallbackfunc_tokensignedbyserver@') {
    var _el = document.getElementById("web3verifier");
    var token = _el.getAttribute("token_signed_by_server");
    var callback = _el.getAttribute("callback_func");
    postMessage(iframe, "callback_func=" + callback + "&token_signed_by_server=" + token);
  } else if (event.data.indexOf("web3verifier_callbackfunc@") !== -1) {
    var length = "web3verifier_callbackfunc=".length;
    var reqs_string = event.data.substring(length, event.data.length);
    var reqs = (0,_util__WEBPACK_IMPORTED_MODULE_0__.split)(reqs_string, "&", ["client_id", "token_signed_by_client", "callback_func"]);
    var funcname = reqs["callback_func"];
    eval(funcname)(reqs["client_id"], reqs["token_signed_by_client"]);
    /*    } else if ( event.data === 'web3verifier_getnonce@'){
            send( './web3verifier_getnonce', (nonce: string) => {
                let host = window.location.hostname
                let port = window.location.port
                let url = ''
                if ( port === '80' ) {
                    url = 'https://' + host
                } else {
                    url = 'https://' + host + ':' + port
                }
                postMessage(iframe, 'nonce_url=' + 'nonce=' + nonce + '&' + 'topurl=' + url);
            } )
        } else if ( event.data === 'web3verifier_getrequirement@' ){
            send( './web3verifier_getrequirement', (requirement: string) => {
                postMessage(iframe, 'requirement=' + requirement);
            } )
        } else if ( event.data === 'request topurl@' ){
            const topurl = window.top!.location.href;
            postMessage(iframe, 'encoded_top_url=' + encodeURIComponent(topurl));
    */
  } else {
    return;
  }
}, false);
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFLSixLQUFLLENBQUNFLElBQUksS0FBSyxtREFBbUQsRUFBRTtJQUM1RSxJQUFJQyxHQUFFLEdBQUdWLFFBQVEsQ0FBQ0csY0FBYyxDQUFDLGNBQWMsQ0FBQztJQUNoRCxJQUFJVSxLQUFLLEdBQU1ILEdBQUcsQ0FBQ0UsWUFBWSxDQUFDLHdCQUF3QixDQUFDO0lBQ3pELElBQUk1QixRQUFRLEdBQUcwQixHQUFHLENBQUNFLFlBQVksQ0FBQyxlQUFlLENBQUM7SUFDaERoQixXQUFXLENBQUNDLE1BQU0sRUFBRSxnQkFBZ0IsR0FBR2IsUUFBUSxHQUFHLDBCQUEwQixHQUFHNkIsS0FBSyxDQUFDO0dBQ3hGLE1BQU0sSUFBS04sS0FBSyxDQUFDRSxJQUFJLENBQUNuQyxPQUFPLENBQUMsNEJBQTRCLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRTtJQUNqRSxJQUFNQyxNQUFNLEdBQUcsNEJBQTRCLENBQUNBLE1BQU07SUFDbEQsSUFBTXVDLFdBQVcsR0FBVVAsS0FBSyxDQUFDRSxJQUFJLENBQUNqQyxTQUFTLENBQUNELE1BQU0sRUFBRWdDLEtBQUssQ0FBQ0UsSUFBSSxDQUFDbEMsTUFBTSxDQUFDO0lBQzFFLElBQUl3QyxJQUFJLEdBQUd6RCw0Q0FBSyxDQUFFd0QsV0FBVyxFQUFFLEdBQUcsRUFBRSxDQUFDLFdBQVcsRUFBRSx3QkFBd0IsRUFBRSxlQUFlLENBQUMsQ0FBRTtJQUM5RixJQUFJRSxRQUFRLEdBQUdELElBQUksQ0FBQyxlQUFlLENBQUM7SUFDcENFLElBQUksQ0FBQ0QsUUFBUSxDQUFDLENBQUVELElBQUksQ0FBQyxXQUFXLENBQUMsRUFBRUEsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUU7SUFFM0U7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBb0JLLE1BQU07SUFDSDs7QUFFUixDQUFDLEVBQUUsS0FBSyxDQUFDLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly92ZXJpZnkvLi9zcmMvdXJsLnRzIiwid2VicGFjazovL3ZlcmlmeS8uL3NyYy91dGlsLnRzIiwid2VicGFjazovL3ZlcmlmeS93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly92ZXJpZnkvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL3ZlcmlmeS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL3ZlcmlmeS93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL3ZlcmlmeS8uL3NyYy92ZXJpZnkudHMiXSwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNvbnN0IFNFQ1VSSVRZX1NFUlZFUiA9IFwiaHR0cHM6Ly8xOTIuMTY4LjE1LjY6NDQzM1wiXG5cbi8vZXhwb3J0IGNvbnN0IFNPTEFOQV9CTE9DS0NIQUlOX1NFUlZFUiAgPSBcImh0dHBzOi8vYXBpLm1haW5uZXQtYmV0YS5zb2xhbmEuY29tXCIgXG5leHBvcnQgY29uc3QgU09MQU5BX0JMT0NLQ0hBSU5fU0VSVkVSICA9IFwiaHR0cHM6Ly9zb2xhbmEtbWFpbm5ldC5nLmFsY2hlbXkuY29tL3YyL1Q3bEppTnh6MTBCUXlOTFZQOXg0VDI2ZTdjcmRueUZVXCJcbiIsImV4cG9ydCBpbnRlcmZhY2UgS2V5VmFsdWUge1xuICAgIFtrZXk6IHN0cmluZ106IHN0cmluZztcbn1cbmV4cG9ydCBmdW5jdGlvbiBzcGxpdCggc3JjOnN0cmluZywgZGVsaW1pdGVyOnN0cmluZywga2V5czpzdHJpbmdbXSApOiBLZXlWYWx1ZSB7XG5cbiAgICBsZXQgc3BsaXRlZDogc3RyaW5nW10gPSBzcmMuc3BsaXQoZGVsaW1pdGVyKVxuXG4gICAgbGV0IGtleXZhbHVlOiBLZXlWYWx1ZSA9IHt9XG4gICAgZm9yICggY29uc3QgcyBvZiBzcGxpdGVkICl7XG4gICAgICAgIGZvciAoIGNvbnN0IGtleSBvZiBrZXlzICl7XG4gICAgICAgICAgICBpZiAoIHMuaW5kZXhPZihrZXkrXCI9XCIpICE9PSAtMSApe1xuICAgICAgICAgICAgICAgIGNvbnN0IGxlbmd0aCA9IChrZXkrXCI9XCIpLmxlbmd0aFxuICAgICAgICAgICAgICAgIGNvbnN0IHZhbHVlID0gcy5zdWJzdHJpbmcobGVuZ3RoLHMubGVuZ3RoKVxuICAgICAgICAgICAgICAgIGtleXZhbHVlW2tleV0gPSB2YWx1ZVxuICAgICAgICAgICAgICAgIGNvbnRpbnVlXG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgaWYgKCBPYmplY3Qua2V5cyhrZXl2YWx1ZSkubGVuZ3RoICE9PSBrZXlzLmxlbmd0aCApe1xuICAgICAgICB0aHJvdyBFcnJvciggXCJleHBlY3Qga2V5IFwiICsga2V5cyArIFwiIGlzIG5vdCBwcm9wZXJcIilcbiAgICB9XG4gICAgcmV0dXJuIGtleXZhbHVlXG5cbn0gIiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHQvLyBubyBtb2R1bGUuaWQgbmVlZGVkXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbiIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJpbXBvcnQgeyBzcGxpdCB9IGZyb20gXCIuL3V0aWxcIlxuaW1wb3J0IHsgU0VDVVJJVFlfU0VSVkVSIH0gZnJvbSBcIi4vdXJsXCJcblxuZnVuY3Rpb24gc2VuZCggdXJsOiBzdHJpbmcgfCBVUkwsIGNhbGxiYWNrOiB7IChub25jZTogYW55KTogdm9pZDsgKHJlcXVpcmVtZW50OiBhbnkpOiB2b2lkOyAoYXJnMDogc3RyaW5nKTogdm9pZDsgfSApIHtcbiAgICBsZXQgY29ubmVjdCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgIGNvbm5lY3Qub3BlbignR0VUJywgdXJsLCB0cnVlKTtcbiAgICBjb25uZWN0Lm9ucmVhZHlzdGF0ZWNoYW5nZSA9ICgpID0+IHtcbiAgICAgICAgaWYgKGNvbm5lY3QucmVhZHlTdGF0ZSA9PT0gNCAmJiBjb25uZWN0LnN0YXR1cyA9PT0gMjAwKSB7XG4gICAgICAgICAgICBjYWxsYmFjayggY29ubmVjdC5yZXNwb25zZVRleHQgKTtcbiAgICAgICAgfSBlbHNlIGlmIChjb25uZWN0LnN0YXR1cyA+PSAzMDcgJiYgY29ubmVjdC5yZWFkeVN0YXRlID09PSA0KSB7XG4gICAgICAgICAgICBhbGVydCgnZXJyb3InKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25uZWN0LnNlbmQobnVsbCk7XG59XG5mdW5jdGlvbiBpc0lGcmFtZShpbnB1dDogSFRNTEVsZW1lbnQgfCBudWxsKTogaW5wdXQgaXMgSFRNTElGcmFtZUVsZW1lbnR7XG4gICAgcmV0dXJuIGlucHV0ICE9PSBudWxsICYmIGlucHV0LnRhZ05hbWUgPT09ICdJRlJBTUUnO1xufVxuZnVuY3Rpb24gcG9zdE1lc3NhZ2UoaWZyYW1lOkhUTUxJRnJhbWVFbGVtZW50LCBtc2c6IHN0cmluZyl7XG4gICAgaWYgKGlzSUZyYW1lKGlmcmFtZSkgJiYgaWZyYW1lLmNvbnRlbnRXaW5kb3cpIHtcbiAgICAgICAgaWZyYW1lLmNvbnRlbnRXaW5kb3cucG9zdE1lc3NhZ2UobXNnICwgU0VDVVJJVFlfU0VSVkVSKTtcbiAgICB9XG59XG5cbmxldCBpZnJhbWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpZnJhbWUnKVxuaWZyYW1lLnNyYyA9IFNFQ1VSSVRZX1NFUlZFUiArICcvdmVyaWZ5X2NvcmVfdjAuNy5odG1sJ1xubGV0IHdlYjN2ZXJpZmllcjpIVE1MRWxlbWVudCB8IG51bGwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2ViM3ZlcmlmaWVyJylcbndlYjN2ZXJpZmllciEuYXBwZW5kQ2hpbGQoaWZyYW1lKVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC5vcmlnaW4gIT09IFNFQ1VSSVRZX1NFUlZFUiApe1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICggZXZlbnQuZGF0YSA9PT0gJ3dlYjN2ZXJpZmllcl9nZXR2ZXJpZnl0eXBlQCcpe1xuICAgICAgICBsZXQgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcIndlYjN2ZXJpZmllclwiKVxuICAgICAgICBsZXQgdHlwZSAgICAgPSBlbCEuZ2V0QXR0cmlidXRlKFwidmVyaWZ5X3R5cGVcIilcbiAgICAgICAgcG9zdE1lc3NhZ2UoaWZyYW1lLCAndmVyaWZ5X3R5cGU9JyArIHR5cGUgKTtcbiAgICB9IGVsc2UgaWYgKCBldmVudC5kYXRhID09PSAnd2ViM3ZlcmlmaWVyX2dldGNhbGxiYWNrZnVuY190b2tlbnNpZ25lZGJ5c2VydmVyQCcpIHtcbiAgICAgICAgbGV0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ3ZWIzdmVyaWZpZXJcIilcbiAgICAgICAgbGV0IHRva2VuICAgID0gZWwhLmdldEF0dHJpYnV0ZShcInRva2VuX3NpZ25lZF9ieV9zZXJ2ZXJcIilcbiAgICAgICAgbGV0IGNhbGxiYWNrID0gZWwhLmdldEF0dHJpYnV0ZShcImNhbGxiYWNrX2Z1bmNcIilcbiAgICAgICAgcG9zdE1lc3NhZ2UoaWZyYW1lLCBcImNhbGxiYWNrX2Z1bmM9XCIgKyBjYWxsYmFjayArIFwiJnRva2VuX3NpZ25lZF9ieV9zZXJ2ZXI9XCIgKyB0b2tlbilcbiAgICB9IGVsc2UgaWYgKCBldmVudC5kYXRhLmluZGV4T2YoXCJ3ZWIzdmVyaWZpZXJfY2FsbGJhY2tmdW5jQFwiKSAhPT0gLTEgKXtcbiAgICAgICAgY29uc3QgbGVuZ3RoID0gXCJ3ZWIzdmVyaWZpZXJfY2FsbGJhY2tmdW5jPVwiLmxlbmd0aFxuICAgICAgICBjb25zdCByZXFzX3N0cmluZzpzdHJpbmcgPSBldmVudC5kYXRhLnN1YnN0cmluZyhsZW5ndGgsIGV2ZW50LmRhdGEubGVuZ3RoKVxuICAgICAgICBsZXQgcmVxcyA9IHNwbGl0KCByZXFzX3N0cmluZywgXCImXCIsIFtcImNsaWVudF9pZFwiLCBcInRva2VuX3NpZ25lZF9ieV9jbGllbnRcIiwgXCJjYWxsYmFja19mdW5jXCJdIClcbiAgICAgICAgbGV0IGZ1bmNuYW1lID0gcmVxc1tcImNhbGxiYWNrX2Z1bmNcIl1cbiAgICAgICAgZXZhbChmdW5jbmFtZSkoIHJlcXNbXCJjbGllbnRfaWRcIl0sIHJlcXNbXCJ0b2tlbl9zaWduZWRfYnlfY2xpZW50XCJdIClcblxuLyogICAgfSBlbHNlIGlmICggZXZlbnQuZGF0YSA9PT0gJ3dlYjN2ZXJpZmllcl9nZXRub25jZUAnKXtcbiAgICAgICAgc2VuZCggJy4vd2ViM3ZlcmlmaWVyX2dldG5vbmNlJywgKG5vbmNlOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICAgIGxldCBob3N0ID0gd2luZG93LmxvY2F0aW9uLmhvc3RuYW1lXG4gICAgICAgICAgICBsZXQgcG9ydCA9IHdpbmRvdy5sb2NhdGlvbi5wb3J0XG4gICAgICAgICAgICBsZXQgdXJsID0gJydcbiAgICAgICAgICAgIGlmICggcG9ydCA9PT0gJzgwJyApIHtcbiAgICAgICAgICAgICAgICB1cmwgPSAnaHR0cHM6Ly8nICsgaG9zdFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICB1cmwgPSAnaHR0cHM6Ly8nICsgaG9zdCArICc6JyArIHBvcnRcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHBvc3RNZXNzYWdlKGlmcmFtZSwgJ25vbmNlX3VybD0nICsgJ25vbmNlPScgKyBub25jZSArICcmJyArICd0b3B1cmw9JyArIHVybCk7XG4gICAgICAgIH0gKVxuICAgIH0gZWxzZSBpZiAoIGV2ZW50LmRhdGEgPT09ICd3ZWIzdmVyaWZpZXJfZ2V0cmVxdWlyZW1lbnRAJyApe1xuICAgICAgICBzZW5kKCAnLi93ZWIzdmVyaWZpZXJfZ2V0cmVxdWlyZW1lbnQnLCAocmVxdWlyZW1lbnQ6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgcG9zdE1lc3NhZ2UoaWZyYW1lLCAncmVxdWlyZW1lbnQ9JyArIHJlcXVpcmVtZW50KTtcbiAgICAgICAgfSApXG4gICAgfSBlbHNlIGlmICggZXZlbnQuZGF0YSA9PT0gJ3JlcXVlc3QgdG9wdXJsQCcgKXtcbiAgICAgICAgY29uc3QgdG9wdXJsID0gd2luZG93LnRvcCEubG9jYXRpb24uaHJlZjtcbiAgICAgICAgcG9zdE1lc3NhZ2UoaWZyYW1lLCAnZW5jb2RlZF90b3BfdXJsPScgKyBlbmNvZGVVUklDb21wb25lbnQodG9wdXJsKSk7XG4qL1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG59LCBmYWxzZSk7XG5cblxuXG4iXSwibmFtZXMiOlsiU0VDVVJJVFlfU0VSVkVSIiwiU09MQU5BX0JMT0NLQ0hBSU5fU0VSVkVSIiwic3BsaXQiLCJzcmMiLCJkZWxpbWl0ZXIiLCJrZXlzIiwic3BsaXRlZCIsImtleXZhbHVlIiwiX2l0ZXJhdG9yIiwiX2NyZWF0ZUZvck9mSXRlcmF0b3JIZWxwZXIiLCJfc3RlcCIsInMiLCJuIiwiZG9uZSIsInZhbHVlIiwiX2l0ZXJhdG9yMiIsIl9zdGVwMiIsImtleSIsImluZGV4T2YiLCJsZW5ndGgiLCJzdWJzdHJpbmciLCJlcnIiLCJlIiwiZiIsIk9iamVjdCIsIkVycm9yIiwic2VuZCIsInVybCIsImNhbGxiYWNrIiwiY29ubmVjdCIsIlhNTEh0dHBSZXF1ZXN0Iiwib3BlbiIsIm9ucmVhZHlzdGF0ZWNoYW5nZSIsInJlYWR5U3RhdGUiLCJzdGF0dXMiLCJyZXNwb25zZVRleHQiLCJhbGVydCIsImlzSUZyYW1lIiwiaW5wdXQiLCJ0YWdOYW1lIiwicG9zdE1lc3NhZ2UiLCJpZnJhbWUiLCJtc2ciLCJjb250ZW50V2luZG93IiwiZG9jdW1lbnQiLCJjcmVhdGVFbGVtZW50Iiwid2ViM3ZlcmlmaWVyIiwiZ2V0RWxlbWVudEJ5SWQiLCJhcHBlbmRDaGlsZCIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJldmVudCIsIm9yaWdpbiIsImRhdGEiLCJlbCIsInR5cGUiLCJnZXRBdHRyaWJ1dGUiLCJ0b2tlbiIsInJlcXNfc3RyaW5nIiwicmVxcyIsImZ1bmNuYW1lIiwiZXZhbCJdLCJzb3VyY2VSb290IjoiIn0=