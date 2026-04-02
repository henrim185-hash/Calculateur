import { createRouter, createWebHistory } from "vue-router";

// Import des pages
import calcul_avec_bulletins from "../views/calcul_avec_bulletins.vue";
import calcul_sans_bulletins from "../views/calcul_sans_bulletins.vue";
import formules from "../views/formules.vue";

const routes = [
  {
    path: "/",
    name: "calcul_avec_bulletins",
    component: calcul_avec_bulletins,
  },
  {
    path: "/calcul_sans_bulletins",
    name: "calcul_sans_bulletins",
    component: calcul_sans_bulletins,
  },
  { path: "/formules", name: "formules", component: formules },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
