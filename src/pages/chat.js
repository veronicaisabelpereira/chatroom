"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../state");
var Chat = /** @class */ (function (_super) {
    __extends(Chat, _super);
    function Chat() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        //
        //Inicializa messages un objeto del tipo Message vacio
        _this.messages = [];
        return _this;
    }
    Chat.prototype.connectedCallback = function () {
        var _this = this;
        //se subscribe al estado
        state_1.state.subscribe(function () {
            var cs = state_1.state.getState();
            //toma del cs los msjs y el roomId
            _this.messages = cs.messages;
            _this.room = cs.roomId;
            console.log(_this.messages);
            console.log("room id:", cs.roomId);
            //renderiza componente ya con estos datos
            _this.render();
        });
        this.render();
    };
    //Escucha el submit
    Chat.prototype.addListeners = function () {
        var form = this.querySelector(".submit-message");
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            //toma la info ingresada en el campo para escribir
            //La carga al state mediante los metodos setMessage y pushMessage
            var target = e.target;
            var message = target["new-message"].value;
            state_1.state.setMessage(message);
            state_1.state.pushMessage(message);
        });
        //Funcion para scrolear
        var messagesContainer = this.querySelector(".messages__container");
        function scrollToBottom() {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
        scrollToBottom();
    };
    //Funcion que dibuja el componenente
    Chat.prototype.render = function () {
        var cs = state_1.state.getState();
        this.innerHTML = "\n    <div class=\"chat-container\">\n    <div class=\"chat-card\">\n    <h1>Chat</h1>\n    <h2>Room: ".concat(this.room, "</h2>\n    <div class=\"messages__container\">\n    ").concat(this.messages
            .map(function (m) {
            return "\n        <label class=\"message-label\">".concat(m.fullName == cs.fullName ? "" : m.fullName, "</label>\n        <div class= \"").concat(m.fullName == cs.fullName ? "box sent" : "box received", "\">").concat(m.message, "</div>");
        })
            .join(""), "\n      </div>\n      <form class=\"submit-message\">\n      <input class=\"chat-input\"type=\"text\" name=\"new-message\"></input>\n      <button class=\"send-button\">Enviar</button> \n      </form>\n      </div>\n    </div>\n         ");
        var style = document.createElement("style");
        style.innerHTML = "\n        .chat-container{\n          font-family:'Roboto';\n          display:grid;\n          justify-content:center;\n          height:100vh;\n          align-content:center;\n        }\n        .chat-card{\n            display:flex;\n            flex-direction:column;\n            justify-content:space-between;\n            gap:15px;\n            width:85vw;\n            background-color:white;\n            padding:20px;\n            border-radius: 30px;\n            box-sizing: border-box;\n          }\n          \n          @media(min-width:960px){\n            .chat-card{\n            width:65vw;\n          }\n        }\n        .messages__container{\n            padding:10px;\n            background-color: #938274;\n            min-width:100%;\n            height:50vh;\n            overflow-x:hidden;\n            overflow-y:auto;\n            display:flex;\n            flex-direction:column;\n            gap:3px;\n        }\n        .message-label{\n            color:white;\n        }\n        .box{ \n            max-width:160px;\n            border-radius:6px;\n            padding:15px;\n            word-wrap: break-word;\n             max-width: 30vw;\n        }\n        .box.received{\n            background-color: red;\n            color:white;\n          }\n          .box.sent{\n            margin-left: auto;\n            background-color: green;\n            color:white;\n        }\n        .submit-message{\n            display:flex;\n            flex-direction:column;\n        }\n        .chat-input{\n          border-radius:1px;\n          padding:10px;\n        }\n        .send-button{\n            font-weight:500;\n            font-family:'Roboto';\n            appearance: button;\n            border-radius: 1px;\n            border-width: 0;\n            padding: 0 25px;\n            font-size: 100%;\n            background-color:red;\n            color:white;\n            box-sizing: border-box;\n            margin: 12px 0 0;\n            padding:10px;\n            text-align: center;\n            transition: all .2s,box-shadow .08s ease-in;\n        }\n        ";
        this.appendChild(style);
        this.addListeners();
    };
    return Chat;
}(HTMLElement));
customElements.define("chat-page", Chat);
