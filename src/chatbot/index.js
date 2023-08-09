/* eslint-disable */
import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { fetchEventSource } from '@microsoft/fetch-event-source';

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/*\n! tailwindcss v3.3.3 | MIT License | https://tailwindcss.com\n*//*\n1. Prevent padding and border from affecting element width. (https://github.com/mozdevs/cssremedy/issues/4)\n2. Allow adding a border to an element by just adding a border-width. (https://github.com/tailwindcss/tailwindcss/pull/116)\n*/\n\n*,\n::before,\n::after {\n  box-sizing: border-box; /* 1 */\n  border-width: 0; /* 2 */\n  border-style: solid; /* 2 */\n  border-color: #e5e7eb; /* 2 */\n}\n\n::before,\n::after {\n  --tw-content: '';\n}\n\n/*\n1. Use a consistent sensible line-height in all browsers.\n2. Prevent adjustments of font size after orientation changes in iOS.\n3. Use a more readable tab size.\n4. Use the user's configured `sans` font-family by default.\n5. Use the user's configured `sans` font-feature-settings by default.\n6. Use the user's configured `sans` font-variation-settings by default.\n*/\n\nhtml {\n  line-height: 1.5; /* 1 */\n  -webkit-text-size-adjust: 100%; /* 2 */\n  -moz-tab-size: 4; /* 3 */\n  -o-tab-size: 4;\n     tab-size: 4; /* 3 */\n  font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, \"Helvetica Neue\", Arial, \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\", \"Noto Color Emoji\"; /* 4 */\n  font-feature-settings: normal; /* 5 */\n  font-variation-settings: normal; /* 6 */\n}\n\n/*\n1. Remove the margin in all browsers.\n2. Inherit line-height from `html` so users can set them as a class directly on the `html` element.\n*/\n\nbody {\n  margin: 0; /* 1 */\n  line-height: inherit; /* 2 */\n}\n\n/*\n1. Add the correct height in Firefox.\n2. Correct the inheritance of border color in Firefox. (https://bugzilla.mozilla.org/show_bug.cgi?id=190655)\n3. Ensure horizontal rules are visible by default.\n*/\n\nhr {\n  height: 0; /* 1 */\n  color: inherit; /* 2 */\n  border-top-width: 1px; /* 3 */\n}\n\n/*\nAdd the correct text decoration in Chrome, Edge, and Safari.\n*/\n\nabbr:where([title]) {\n  -webkit-text-decoration: underline dotted;\n          text-decoration: underline dotted;\n}\n\n/*\nRemove the default font size and weight for headings.\n*/\n\nh1,\nh2,\nh3,\nh4,\nh5,\nh6 {\n  font-size: inherit;\n  font-weight: inherit;\n}\n\n/*\nReset links to optimize for opt-in styling instead of opt-out.\n*/\n\na {\n  color: inherit;\n  text-decoration: inherit;\n}\n\n/*\nAdd the correct font weight in Edge and Safari.\n*/\n\nb,\nstrong {\n  font-weight: bolder;\n}\n\n/*\n1. Use the user's configured `mono` font family by default.\n2. Correct the odd `em` font sizing in all browsers.\n*/\n\ncode,\nkbd,\nsamp,\npre {\n  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, \"Liberation Mono\", \"Courier New\", monospace; /* 1 */\n  font-size: 1em; /* 2 */\n}\n\n/*\nAdd the correct font size in all browsers.\n*/\n\nsmall {\n  font-size: 80%;\n}\n\n/*\nPrevent `sub` and `sup` elements from affecting the line height in all browsers.\n*/\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline;\n}\n\nsub {\n  bottom: -0.25em;\n}\n\nsup {\n  top: -0.5em;\n}\n\n/*\n1. Remove text indentation from table contents in Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=999088, https://bugs.webkit.org/show_bug.cgi?id=201297)\n2. Correct table border color inheritance in all Chrome and Safari. (https://bugs.chromium.org/p/chromium/issues/detail?id=935729, https://bugs.webkit.org/show_bug.cgi?id=195016)\n3. Remove gaps between table borders by default.\n*/\n\ntable {\n  text-indent: 0; /* 1 */\n  border-color: inherit; /* 2 */\n  border-collapse: collapse; /* 3 */\n}\n\n/*\n1. Change the font styles in all browsers.\n2. Remove the margin in Firefox and Safari.\n3. Remove default padding in all browsers.\n*/\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  font-family: inherit; /* 1 */\n  font-feature-settings: inherit; /* 1 */\n  font-variation-settings: inherit; /* 1 */\n  font-size: 100%; /* 1 */\n  font-weight: inherit; /* 1 */\n  line-height: inherit; /* 1 */\n  color: inherit; /* 1 */\n  margin: 0; /* 2 */\n  padding: 0; /* 3 */\n}\n\n/*\nRemove the inheritance of text transform in Edge and Firefox.\n*/\n\nbutton,\nselect {\n  text-transform: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Remove default button styles.\n*/\n\nbutton,\n[type='button'],\n[type='reset'],\n[type='submit'] {\n  -webkit-appearance: button; /* 1 */\n  background-color: transparent; /* 2 */\n  background-image: none; /* 2 */\n}\n\n/*\nUse the modern Firefox focus style for all focusable elements.\n*/\n\n:-moz-focusring {\n  outline: auto;\n}\n\n/*\nRemove the additional `:invalid` styles in Firefox. (https://github.com/mozilla/gecko-dev/blob/2f9eacd9d3d995c937b4251a5557d95d494c9be1/layout/style/res/forms.css#L728-L737)\n*/\n\n:-moz-ui-invalid {\n  box-shadow: none;\n}\n\n/*\nAdd the correct vertical alignment in Chrome and Firefox.\n*/\n\nprogress {\n  vertical-align: baseline;\n}\n\n/*\nCorrect the cursor style of increment and decrement buttons in Safari.\n*/\n\n::-webkit-inner-spin-button,\n::-webkit-outer-spin-button {\n  height: auto;\n}\n\n/*\n1. Correct the odd appearance in Chrome and Safari.\n2. Correct the outline style in Safari.\n*/\n\n[type='search'] {\n  -webkit-appearance: textfield; /* 1 */\n  outline-offset: -2px; /* 2 */\n}\n\n/*\nRemove the inner padding in Chrome and Safari on macOS.\n*/\n\n::-webkit-search-decoration {\n  -webkit-appearance: none;\n}\n\n/*\n1. Correct the inability to style clickable types in iOS and Safari.\n2. Change font properties to `inherit` in Safari.\n*/\n\n::-webkit-file-upload-button {\n  -webkit-appearance: button; /* 1 */\n  font: inherit; /* 2 */\n}\n\n/*\nAdd the correct display in Chrome and Safari.\n*/\n\nsummary {\n  display: list-item;\n}\n\n/*\nRemoves the default spacing and border for appropriate elements.\n*/\n\nblockquote,\ndl,\ndd,\nh1,\nh2,\nh3,\nh4,\nh5,\nh6,\nhr,\nfigure,\np,\npre {\n  margin: 0;\n}\n\nfieldset {\n  margin: 0;\n  padding: 0;\n}\n\nlegend {\n  padding: 0;\n}\n\nol,\nul,\nmenu {\n  list-style: none;\n  margin: 0;\n  padding: 0;\n}\n\n/*\nReset default styling for dialogs.\n*/\ndialog {\n  padding: 0;\n}\n\n/*\nPrevent resizing textareas horizontally by default.\n*/\n\ntextarea {\n  resize: vertical;\n}\n\n/*\n1. Reset the default placeholder opacity in Firefox. (https://github.com/tailwindlabs/tailwindcss/issues/3300)\n2. Set the default placeholder color to the user's configured gray 400 color.\n*/\n\ninput::-moz-placeholder, textarea::-moz-placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\ninput::placeholder,\ntextarea::placeholder {\n  opacity: 1; /* 1 */\n  color: #9ca3af; /* 2 */\n}\n\n/*\nSet the default cursor for buttons.\n*/\n\nbutton,\n[role=\"button\"] {\n  cursor: pointer;\n}\n\n/*\nMake sure disabled buttons don't get the pointer cursor.\n*/\n:disabled {\n  cursor: default;\n}\n\n/*\n1. Make replaced elements `display: block` by default. (https://github.com/mozdevs/cssremedy/issues/14)\n2. Add `vertical-align: middle` to align replaced elements more sensibly by default. (https://github.com/jensimmons/cssremedy/issues/14#issuecomment-634934210)\n   This can trigger a poorly considered lint error in some tools but is included by design.\n*/\n\nimg,\nsvg,\nvideo,\ncanvas,\naudio,\niframe,\nembed,\nobject {\n  display: block; /* 1 */\n  vertical-align: middle; /* 2 */\n}\n\n/*\nConstrain images and videos to the parent width and preserve their intrinsic aspect ratio. (https://github.com/mozdevs/cssremedy/issues/14)\n*/\n\nimg,\nvideo {\n  max-width: 100%;\n  height: auto;\n}\n\n/* Make elements with the HTML hidden attribute stay hidden by default */\n[hidden] {\n  display: none;\n}\n\n*, ::before, ::after {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n\n::backdrop {\n  --tw-border-spacing-x: 0;\n  --tw-border-spacing-y: 0;\n  --tw-translate-x: 0;\n  --tw-translate-y: 0;\n  --tw-rotate: 0;\n  --tw-skew-x: 0;\n  --tw-skew-y: 0;\n  --tw-scale-x: 1;\n  --tw-scale-y: 1;\n  --tw-pan-x:  ;\n  --tw-pan-y:  ;\n  --tw-pinch-zoom:  ;\n  --tw-scroll-snap-strictness: proximity;\n  --tw-gradient-from-position:  ;\n  --tw-gradient-via-position:  ;\n  --tw-gradient-to-position:  ;\n  --tw-ordinal:  ;\n  --tw-slashed-zero:  ;\n  --tw-numeric-figure:  ;\n  --tw-numeric-spacing:  ;\n  --tw-numeric-fraction:  ;\n  --tw-ring-inset:  ;\n  --tw-ring-offset-width: 0px;\n  --tw-ring-offset-color: #fff;\n  --tw-ring-color: rgb(59 130 246 / 0.5);\n  --tw-ring-offset-shadow: 0 0 #0000;\n  --tw-ring-shadow: 0 0 #0000;\n  --tw-shadow: 0 0 #0000;\n  --tw-shadow-colored: 0 0 #0000;\n  --tw-blur:  ;\n  --tw-brightness:  ;\n  --tw-contrast:  ;\n  --tw-grayscale:  ;\n  --tw-hue-rotate:  ;\n  --tw-invert:  ;\n  --tw-saturate:  ;\n  --tw-sepia:  ;\n  --tw-drop-shadow:  ;\n  --tw-backdrop-blur:  ;\n  --tw-backdrop-brightness:  ;\n  --tw-backdrop-contrast:  ;\n  --tw-backdrop-grayscale:  ;\n  --tw-backdrop-hue-rotate:  ;\n  --tw-backdrop-invert:  ;\n  --tw-backdrop-opacity:  ;\n  --tw-backdrop-saturate:  ;\n  --tw-backdrop-sepia:  ;\n}\n.visible {\n  visibility: visible;\n}\n.invisible {\n  visibility: hidden;\n}\n.fixed {\n  position: fixed;\n}\n.absolute {\n  position: absolute;\n}\n.bottom-10 {\n  bottom: 2.5rem;\n}\n.bottom-14 {\n  bottom: 3.5rem;\n}\n.right-0 {\n  right: 0px;\n}\n.right-10 {\n  right: 2.5rem;\n}\n.block {\n  display: block;\n}\n.flex {\n  display: flex;\n}\n.h-12 {\n  height: 3rem;\n}\n.h-\\[400px\\] {\n  height: 400px;\n}\n.w-10 {\n  width: 2.5rem;\n}\n.w-12 {\n  width: 3rem;\n}\n.w-\\[300px\\] {\n  width: 300px;\n}\n.w-full {\n  width: 100%;\n}\n.flex-1 {\n  flex: 1 1 0%;\n}\n.translate-y-0 {\n  --tw-translate-y: 0px;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.translate-y-5 {\n  --tw-translate-y: 1.25rem;\n  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));\n}\n.cursor-pointer {\n  cursor: pointer;\n}\n.flex-col {\n  flex-direction: column;\n}\n.items-center {\n  align-items: center;\n}\n.justify-center {\n  justify-content: center;\n}\n.justify-between {\n  justify-content: space-between;\n}\n.gap-2 {\n  gap: 0.5rem;\n}\n.gap-4 {\n  gap: 1rem;\n}\n.overflow-hidden {\n  overflow: hidden;\n}\n.rounded {\n  border-radius: 0.25rem;\n}\n.rounded-full {\n  border-radius: 9999px;\n}\n.rounded-lg {\n  border-radius: 0.5rem;\n}\n.border {\n  border-width: 1px;\n}\n.border-gray-200 {\n  --tw-border-opacity: 1;\n  border-color: rgb(229 231 235 / var(--tw-border-opacity));\n}\n.border-green-600 {\n  --tw-border-opacity: 1;\n  border-color: rgb(22 163 74 / var(--tw-border-opacity));\n}\n.bg-gray-100 {\n  --tw-bg-opacity: 1;\n  background-color: rgb(243 244 246 / var(--tw-bg-opacity));\n}\n.bg-transparent {\n  background-color: transparent;\n}\n.bg-white {\n  --tw-bg-opacity: 1;\n  background-color: rgb(255 255 255 / var(--tw-bg-opacity));\n}\n.p-2 {\n  padding: 0.5rem;\n}\n.p-4 {\n  padding: 1rem;\n}\n.px-2 {\n  padding-left: 0.5rem;\n  padding-right: 0.5rem;\n}\n.px-4 {\n  padding-left: 1rem;\n  padding-right: 1rem;\n}\n.pt-0 {\n  padding-top: 0px;\n}\n.text-sm {\n  font-size: 0.875rem;\n  line-height: 1.25rem;\n}\n.text-xl {\n  font-size: 1.25rem;\n  line-height: 1.75rem;\n}\n.text-xs {\n  font-size: 0.75rem;\n  line-height: 1rem;\n}\n.font-black {\n  font-weight: 900;\n}\n.font-bold {\n  font-weight: 700;\n}\n.text-green-600 {\n  --tw-text-opacity: 1;\n  color: rgb(22 163 74 / var(--tw-text-opacity));\n}\n.text-white {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}\n.opacity-0 {\n  opacity: 0;\n}\n.opacity-100 {\n  opacity: 1;\n}\n.shadow {\n  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);\n  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);\n  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);\n}\n.outline-none {\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n}\n.transition-all {\n  transition-property: all;\n  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n  transition-duration: 150ms;\n}\n.hover\\:bg-green-600:hover {\n  --tw-bg-opacity: 1;\n  background-color: rgb(22 163 74 / var(--tw-bg-opacity));\n}\n.hover\\:text-white:hover {\n  --tw-text-opacity: 1;\n  color: rgb(255 255 255 / var(--tw-text-opacity));\n}";
styleInject(css_248z);

function ChatBar(props) {
    var value = props.value, onChange = props.onChange, onSubmit = props.onSubmit, placeholder = props.placeholder;
    return (React.createElement("form", { className: 'bg-gray-100 border border-gray-200 text-sm rounded w-full flex items-center justify-between', onSubmit: onSubmit },
        React.createElement("input", { type: "text", className: 'p-2 flex-1 outline-none bg-transparent', value: value, onChange: function (e) { return onChange(e.target.value); }, placeholder: placeholder }),
        React.createElement("button", { type: "submit", className: 'text-green-600 font-bold px-2 text-xs' }, "CHAT")));
}

var request = function (endpoint, method, data, options, onMessage) {
    if (method === void 0) { method = 'GET'; }
    if (data === void 0) { data = {}; }
    if (options === void 0) { options = {}; }
    if (onMessage === void 0) { onMessage = null; }
    return __awaiter(void 0, void 0, void 0, function () {
        var formdata, external, headers, auth, stream, noonce, url, payload, requestParams, requestOptions, response, txt, json, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    formdata = options.formdata, external = options.external, headers = options.headers, auth = options.auth, stream = options.stream;
                    noonce = (new Date().getTime() + Math.random()).toString();
                    if (formdata)
                        data.append('noonce', noonce);
                    else
                        data['noonce'] = noonce;
                    url = external ? endpoint : (options.base_url || "https://ayushma-api.ohc.network/api/") + endpoint;
                    payload = formdata ? data : JSON.stringify(data);
                    if (method === 'GET') {
                        requestParams = data
                            ? "?" + Object.keys(data)
                                .filter(function (key) { return data[key] !== null && data[key] !== undefined; })
                                .map(function (key) { return key + "=" + data[key]; })
                                .join('&')
                            : '';
                        url += requestParams;
                        payload = null;
                    }
                    requestOptions = {
                        method: method,
                        headers: __assign(__assign(__assign({ Accept: 'application/json' }, (formdata === true
                            ? {}
                            : {
                                'Content-Type': 'application/json',
                            })), { Authorization: "Bearer" + auth }), headers),
                        body: payload,
                    };
                    if (!stream) return [3 /*break*/, 1];
                    return [2 /*return*/, new Promise(function (resolve, reject) { return __awaiter(void 0, void 0, void 0, function () {
                            var streamOptions;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        streamOptions = __assign(__assign({}, requestOptions), { onmessage: function (e) {
                                                if (onMessage)
                                                    onMessage(e);
                                            }, onerror: function (error) {
                                                if (onMessage)
                                                    onMessage({ id: "", event: "", data: JSON.stringify({ error: error }) });
                                                reject({ error: error });
                                            }, onclose: function () {
                                                resolve();
                                            }, onopen: function (response) { return __awaiter(void 0, void 0, void 0, function () {
                                                return __generator(this, function (_a) {
                                                    if (response.ok && response.headers.get('content-type') === "text/event-stream") {
                                                        return [2 /*return*/]; // everything's good
                                                    }
                                                    else if (response.status >= 400 && response.status < 500 && response.status !== 429) {
                                                        // client-side errors are usually non-retriable:
                                                        throw { error: response.statusText };
                                                    }
                                                    else {
                                                        throw { error: response.statusText };
                                                    }
                                                });
                                            }); } });
                                        return [4 /*yield*/, fetchEventSource(url, streamOptions)];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                case 1: return [4 /*yield*/, fetch(url, requestOptions)];
                case 2:
                    response = _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 6, , 7]);
                    return [4 /*yield*/, response.clone().text()];
                case 4:
                    txt = _a.sent();
                    if (txt === '') {
                        return [2 /*return*/, {}];
                    }
                    return [4 /*yield*/, response.clone().json()];
                case 5:
                    json = _a.sent();
                    if (json && response.ok) {
                        return [2 /*return*/, json];
                    }
                    else {
                        throw json;
                    }
                case 6:
                    error_1 = _a.sent();
                    throw { error: error_1 };
                case 7: return [2 /*return*/];
            }
        });
    });
};
var messageBuffer = [];
var intervalHandle = null;
function handleMessage(data, onMessage, delay) {
    if (!delay || delay == 0) {
        onMessage(data);
        return;
    }
    messageBuffer.push(data);
    if (!intervalHandle) {
        intervalHandle = setInterval(function () {
            if (messageBuffer.length > 0) {
                var message = messageBuffer.shift();
                if (message)
                    onMessage(message);
            }
            else {
                intervalHandle && clearInterval(intervalHandle);
                intervalHandle = null;
            }
        }, delay);
    }
}
var API = {
    projects: {
        list: function (filters) {
            if (filters === void 0) { filters = { ordering: "-created_at" }; }
            return request("projects", "GET", filters);
        },
        get: function (id) { return request("projects/" + id); },
    },
    chat: {
        create: function (project_id, title, openai_api_key) { return request("projects/" + project_id + "/chats", "POST", { title: title }, openai_api_key ? {
            headers: {
                "OpenAI-Key": openai_api_key
            }
        } : {}); },
        get: function (project_id, id) { return request("projects/" + project_id + "/chats/" + id); },
        converse: function (project_id, chat_id, formdata, openai_api_key, onMessage, delay) {
            if (onMessage === void 0) { onMessage = null; }
            if (delay === void 0) { delay = null; }
            return request("projects/" + project_id + "/chats/" + chat_id + "/converse", "POST", formdata, {
                stream: true,
                formdata: true,
                headers: openai_api_key ? {
                    "OpenAI-Key": openai_api_key
                } : {}
            }, function (e) {
                if (onMessage) {
                    var data = JSON.parse(e.data);
                    if (data.error) {
                        throw Error(data.error);
                    }
                    handleMessage(data, onMessage, delay);
                }
            });
        },
    }
};

var getFormData = function (text) { return __awaiter(void 0, void 0, void 0, function () {
    var fd;
    return __generator(this, function (_a) {
        fd = new FormData();
        if (text) {
            fd.append("text", text);
        }
        fd.append("language", "en");
        fd.append("temperature", "0.1");
        fd.append("top_k", "100");
        return [2 /*return*/, fd];
    });
}); };

function Chatbot(props) {
    var _this = this;
    var _a = useState(false), show = _a[0], setShow = _a[1];
    var containerClass = props.containerClass, buttonClass = props.buttonClass, chatboxClass = props.chatboxClass, presetQuestions = props.presetQuestions, projectID = props.projectID;
    var _b = useState(""), value = _b[0], setValue = _b[1];
    var _c = useState(""), chatMessage = _c[0], setChatMessage = _c[1];
    var _d = useState(""), currentChat = _d[0], setCurrentChat = _d[1];
    var _e = useState(false), isTyping = _e[0], setIsTyping = _e[1];
    var createChat = function (value) { return __awaiter(_this, void 0, void 0, function () {
        var chat;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, API.chat.create(projectID, "New Chat")];
                case 1:
                    chat = _a.sent();
                    setCurrentChat(chat.external_id);
                    converse(value);
                    return [2 /*return*/];
            }
        });
    }); };
    var converse = function (value) { return __awaiter(_this, void 0, void 0, function () {
        var fd, conv;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getFormData(value)];
                case 1:
                    fd = _a.sent();
                    return [4 /*yield*/, API.chat.converse(projectID, currentChat, fd, undefined, streamChatMessage, 20)];
                case 2:
                    conv = _a.sent();
                    return [2 /*return*/];
            }
        });
    }); };
    var streamChatMessage = function (message) { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            if (value === "")
                setValue(message.input);
            setChatMessage(function (prevChatMessage) {
                var updatedChatMessage = prevChatMessage + message.delta;
                return updatedChatMessage;
            });
            if (message.stop) {
                //await chatQuery.refetch();
                setValue("");
                setIsTyping(false);
                setChatMessage("");
            }
            return [2 /*return*/];
        });
    }); };
    return (React.createElement("div", { className: twMerge("fixed bottom-10 right-10", containerClass) },
        React.createElement("button", { className: twMerge("h-12 w-12 rounded-full flex items-center justify-center cursor-pointer text-white", buttonClass), onClick: function () { return setShow(!show); } },
            React.createElement("img", { src: "https://ayushma.ohc.network/ayushma.svg", alt: "Ayushma" })),
        React.createElement("div", { className: "bg-white w-[300px] h-[400px] bottom-14 transition-all absolute shadow rounded-lg right-0 overflow-hidden flex items-center flex-col justify-between " + (show ? "visible opacity-100 translate-y-0" : "invisible opacity-0 translate-y-5") },
            React.createElement("div", null,
                React.createElement("div", { className: "p-4 flex items-center justify-center font-black text-xl gap-2" },
                    React.createElement("div", { className: 'w-10' },
                        React.createElement("img", { src: "https://ayushma.ohc.network/ayushma.svg", alt: "Ayushma", className: 'w-full' })),
                    "Ayushma"),
                React.createElement("div", { className: 'p-4 pt-0 text-sm' },
                    React.createElement("p", null, "Hey! I am Ayushma, your digital personal health assistant. I can help you with queries regarding patient health and ICU protocols."),
                    React.createElement("br", null),
                    presetQuestions && (React.createElement("div", { className: 'flex flex-col gap-4' }, presetQuestions.map(function (question, index) { return (React.createElement("button", { key: index, className: 'rounded border border-green-600 text-green-600 p-2 px-4 block w-full hover:bg-green-600 hover:text-white', onClick: function () { return createChat(question); } }, question)); })))),
                chatMessage),
            React.createElement("div", { className: 'p-2 w-full' },
                React.createElement(ChatBar, { value: value, onChange: function (value) { return setValue(value); }, onSubmit: function () {
                        if (!currentChat) {
                            createChat(value);
                        }
                    }, placeholder: 'Type your message here...' })))));
}

export default Chatbot;
