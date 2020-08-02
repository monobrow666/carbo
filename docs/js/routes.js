const routes = [
  { path: "/", component: HomePage },
  { path: "/search", component: SearchPage },
  { path: "/foods", component: FoodsPage },
  { path: "/food/new", component: FoodEditPage },
  { path: "/food/:id/edit", component: FoodEditPage },
  { path: "/food/:id", component: FoodDetailPage },
  { path: "*", component: NotFoundPage }
];

const router = new VueRouter({
  routes,
});
