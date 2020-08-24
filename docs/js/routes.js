const routes = [
  { path: "/", name: 'home', component: HomePage },
  { path: "/search", name: 'search', component: SearchPage },
  { path: "/foods", name: 'foods', component: FoodsPage },
  { path: "/food/new", name: 'addFood', component: FoodEditPage },
  { path: "/food/:id/edit", name: 'editFood', component: FoodEditPage },
  { path: "/food/:id", name: 'foodDetail', component: FoodDetailPage },
  { path: "*", name: 'notFound', component: NotFoundPage }
];

const router = new VueRouter({
  routes,
});
