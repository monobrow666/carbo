const routes = [
  { path: "/", component: HomePage, props: true },
  { path: "/search", component: SearchPage },
  { path: "*", component: HomePage }
];

const router = new VueRouter({
  routes,
});
