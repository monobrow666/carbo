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

async function getFoods() {
//  return fakeFoods;
  const docRef = await db.collection('foods').get();
  let foods = [];
  for ( doc of docRef.docs ) {
    const data = doc.data();
    foods.push({
      id: doc.id,
      brand: data.brand,
      name: data.name,
      servingSize: data.servingSize,
      servingSizeUnit: data.servingSizeUnit,
      carbs: data.carbs,
      notes: data.notes,
      updatedAt: data.updatedAt,
    });
  }
  console.log('foods:', foods);
  return foods;
}

async function saveFood(food) {
  food.updatedAt = new Date();

//  const docRef = db.collection('foods').add(food);
//    .then(function (docRef) {
//      console.log("doc written with ID:", docRef.id);
//    })
//    .catch(function (error) {
//      console.error("error:", error);
//    });
  const docRef = await db.collection('foods').add(food);
  // TODO handle errors
  console.log("doc written with ID:", docRef.id);
  return docRef.id;
}

