import React, { useState } from 'react';

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

var css_248z = ".ac-container {\n    position: fixed;\n    bottom: 10px;\n    right: 10px;\n}\n\n.ac-chat-button {\n    height: 50px;\n    width: 50px;\n    border-radius: 50%;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    cursor: pointer;\n    color: white;\n}\n\n.ac-chatbox {\n    background: white;\n    width: 300px;\n    height: 400px;\n    bottom: 60px;\n    visibility: hidden;\n    opacity: 0;\n    transition: 0.4s;\n    position: absolute;\n    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);\n    border-radius: 20px;\n    right: 0px;\n    transform: translateY(10px);\n    overflow: hidden;\n}\n\n.ac-chatbox.ac-show {\n    visibility: visible;\n    opacity: 1;\n    transform: translateY(0px);\n}\n\n.ac-chatbox-hero {\n    padding: 30px;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-weight: bold;\n    font-size: 20px;\n    gap: 10px;\n}\n\n.ac-chatbox-hero-icon {\n    width: 30px\n}\n\n.ac-chat-hero-icon img {\n    width: 100%;\n}\n\n.ac-chatbox-container {\n    padding: 20px;\n    padding-top: 0px;\n    font-size: 13px;\n}\n\n.ac-preset-question {\n    border-radius: 10px;\n    border: 1px solid green;\n    color: green;\n    padding: 10px;\n    display: block;\n    width: 100%;\n}\n\n.ac-preset-question-list {\n    display: flex;\n    flex-direction: column;\n    gap: 10px;\n}\n\n.ac-preset-question:hover {\n    background: green;\n    color: white;\n}";
styleInject(css_248z);

function Chatbot(props) {
    var _a = useState(false), show = _a[0], setShow = _a[1];
    var containerClass = props.containerClass, buttonClass = props.buttonClass, chatboxClass = props.chatboxClass, presetQuestions = props.presetQuestions;
    return (React.createElement("div", { className: "ac-container " + containerClass },
        React.createElement("button", { className: "ac-chat-button " + buttonClass, onClick: function () { return setShow(!show); } },
            React.createElement("img", { src: "https://ayushma.ohc.network/ayushma.svg", alt: "Ayushma" })),
        React.createElement("div", { className: "ac-chatbox " + (show ? "ac-show" : "") },
            React.createElement("div", { className: "ac-chatbox-hero" },
                React.createElement("div", { className: 'ac-chatbox-hero-icon' },
                    React.createElement("img", { src: "https://ayushma.ohc.network/ayushma.svg", alt: "Ayushma" })),
                "Ayushma"),
            React.createElement("div", { className: 'ac-chatbox-container' },
                React.createElement("p", null, "Hey! I am Ayushma, your digital personal health assistant. I can help you with queries regarding patient health and ICU protocols."),
                React.createElement("br", null),
                presetQuestions && (React.createElement("div", { className: 'ac-preset-question-list' }, presetQuestions.map(function (question, index) { return (React.createElement("button", { key: index, className: 'ac-preset-question' }, question)); })))))));
}

export default Chatbot;
