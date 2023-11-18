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
var router_1 = require("@vaadin/router");
var state_1 = require("../state");
var Home = /** @class */ (function (_super) {
    __extends(Home, _super);
    function Home() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Home.prototype.connectedCallback = function () {
        console.log(state_1.state.data);
        var cs = state_1.state.getState();
        if (cs.rtdbRoomId && cs.userId) {
            state_1.state.accessToRoom();
            router_1.Router.go("/chatroom");
        }
        this.render();
        var selection = this.querySelector(".selection");
        selection.addEventListener("change", function (e) {
            var roomIdEl = document.getElementById("room-id__container");
            var targetSel = e.target;
            if (targetSel.value == "new-room") {
                roomIdEl.style.display = "none";
            }
            if (targetSel.value == "existant-room") {
                roomIdEl.style.display = "block";
            }
        });
        var form = this.querySelector(".form");
        form.addEventListener("submit", function (e) {
            var data = state_1.state.getState();
            e.preventDefault();
            var target = e.target;
            state_1.state.setEmailAndFullname(target["email-input"].value, target["name-input"].value);
            state_1.state.signIn(function (err) {
                if (err)
                    console.error("hubo un error en el signIn");
                console.log(target["room-id"].value);
                if (target["room-id"].value) {
                    state_1.state.setRoomId(target["room-id"].value);
                    state_1.state.accessToRoom();
                }
                else {
                    state_1.state.askNewRoom(function () {
                        state_1.state.accessToRoom();
                    });
                }
            });
            router_1.Router.go("/chatroom");
        });
    };
    Home.prototype.render = function () {
        this.innerHTML = "\n        <div class=\"home__container container\">\n        <form class=\"form\" id=\"form\">\n        <h1>Bienvenidxs!</h1>\n        <div>\n        <label class=\"label-input\">Tu email</label>\n        <input  class=\"input-box\" type=\"email\" name=\"email-input\"></input>\n        </div>\n        <div>\n        <label class=\"label-input\">Tu nombre</label>\n        <input  class=\"input-box\" type=\"text\" name=\"name-input\"></input>\n        </div>\n        <div>\n        <label class=\"label-input\">Room</label>\n        <select id=\"room-selection\" form=\"form\" class=\"selection\">\n        <option value=\"new-room\">Nuevo Room</option>\n        <option value=\"existant-room\">Room existente</option>\n        </select>\n        </div>\n        <div id=\"room-id__container\">\n        <label class=\"label-input\">Room Id</label>\n        <input  class=\"input-box\" type=\"text\" name=\"room-id\"></input>\n        </div>\n        <button class=\"submit-button\">Comenzar</button> \n        </form>\n        </div>\n        ";
        var style = document.createElement("style");
        style.innerHTML = "\n      \n        .home__container{\n          \n          \n          }\n          .form{\n            width:65vw;\n            background-color:white;\n            padding:20px;\n            border-radius: 30px;\n            box-sizing: border-box;\n        }\n\n        input{\n          transition-delay:9999s;\n          transition-property:background;\n        }\n        .label-input{\n          display:block;\n          padding: 5px 5px 5px 15px;\n          transform-origin: left center;\n        }\n\n        .input-box{\n          width:100%;\n          padding:10px 15px;\n          border-radius: 1px;\n          box-sizing: border-box;\n          border: 1px solid ;\n        }\n        .selection{\n          padding:10px 15px;\n          width:100px;\n          border-radius: 1px;\n          box-sizing: border-box;\n          border: 1px solid ;\n     \n        }\n        .submit-button{\n            border-radius: 1px;\n            height:30px;\n            border-style:none;\n            background-color:red;\n            border-radius: 1px;\n            box-sizing: border-box;\n            color:white;\n            margin-top: 15px\n        }\n        #room-id__container{\n            display:none;\n        }\n        ";
        this.appendChild(style);
    };
    return Home;
}(HTMLElement));
customElements.define("home-page", Home);
/*
  .form{
            position:relative;
            top:50%;
            display:flex;
            flex-direction:column;
            justify-content:space-between;
            gap:15px;
            width:65vw;
            background-color:white;
            padding:20px;
            border-radius: 30px;
            box-sizing: border-box;
        }
 */
