import { createRouter, createWebHistory } from "vue-router";
import AdminLogin from "../views/AdminLogin.vue";
import Dashboard from "../views/Dashboard.vue";
import Students from "../views/Students.vue";
import Tutors from "../views/Tutors.vue";
import Finance from "../views/Finance.vue";
import Suppliers from "../views/Suppliers.vue";
import SupplierManagement from "../views/SupplierManagement.vue";
import FeeManagement from "../views/FeeManagement.vue";

const routes = [
  { path: "/admin-login", component: AdminLogin },
  { path: "/", component: Dashboard, meta: { requiresAuth: true } },
  { path: "/students", component: Students, meta: { requiresAuth: true } },
  { path: "/tutors", component: Tutors, meta: { requiresAuth: true } },
  { path: "/finance", component: Finance, meta: { requiresAuth: true } },
  { path: "/suppliers", component: Suppliers, meta: { requiresAuth: true } },
  { path: "/supplier-management", component: SupplierManagement, meta: { requiresAuth: true } },
  { path: "/fee-management", component: FeeManagement, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard to Protect Routes
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem("adminToken");

  if (to.meta.requiresAuth && !isAuthenticated) {
    next("/admin-login");
  } else {
    next();
  }
});

export default router;
