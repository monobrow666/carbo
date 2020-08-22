let fakeFoods = [
  { id: 0, brand: "", name: "apple", updatedAt: new Date() },
  { id: 1, brand: "", name: "orange", updatedAt: new Date() },
  { id: 2, brand: "", name: "peach", updatedAt: new Date() },
  { id: 3, brand: "", name: "grapes", updatedAt: new Date() },
];

function getFoodById(id) {
  return fakeFoods.find(function (food) {
    return food.id == id;
  });
}

function getFoods() {
  return fakeFoods;
}

function saveFood(food) {
  food.updatedAt = new Date();

  db.collection('foods').add(food)
    .then(function (docRef) {
      console.log("doc written with ID:", docRef.id);
    })
    .catch(function (error) {
      console.error("error:", error);
    });
}

