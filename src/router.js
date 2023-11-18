"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@vaadin/router");
var router = new router_1.Router(document.querySelector(".root"));
router.setRoutes([
    { path: "/", component: "home-page" },
    { path: "/chatroom", component: "chat-page" },
    { path: ".*", redirect: "/" },
]);
