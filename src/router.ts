import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));
router.setRoutes([
  { path: "/welcome", component: "home-page" },
  { path: "/", component: "home-page" },
  { path: "/chatroom", component: "chat-page" },
  { path: "(.*)", redirect: "/" },
]);
