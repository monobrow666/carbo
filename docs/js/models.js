let fakeFoods = [
  { id: 0, brand: "", name: "apple", updatedAt: new Date() },
  { id: 1, brand: "", name: "orange", updatedAt: new Date() },
  { id: 2, brand: "", name: "peach", updatedAt: new Date() },
  { id: 3, brand: "", name: "grapes", updatedAt: new Date() },
];

const Food = function (id) {
  console.log('Food.id:', id);
  console.log('Food.find:',fakeFoods.find((food) => food.id === id));
};

const FoodCollection = function () {
  return {
    find: function (id) {
      return new Food(id);
    },
    search: function (term) {
      return fakeFoods;
    },
  }
};

