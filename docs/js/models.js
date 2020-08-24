let fakeFoods = [
  { id: 0, brand: "", name: "apple", updatedAt: new Date() },
  { id: 1, brand: "", name: "orange", updatedAt: new Date() },
  { id: 2, brand: "", name: "peach", updatedAt: new Date() },
  { id: 3, brand: "", name: "grapes", updatedAt: new Date() },
];

async function getFoodById(id) {
  const doc = await db.collection('foods').doc(id).get();
  return viewModel(doc);
}

async function getRecentFoods() {
  let foods = [];

  const docRef = await db.collection('foods').orderBy('updatedAt', 'desc').limit(10).get();
  for ( doc of docRef.docs ) {
    foods.push( viewModel(doc) );
  }

  return foods;
}

async function searchFoods(term) {
  term = term.toLowerCase();
  let tempFoods = {};
  let foods = [];

  const nameRef = await db.collection('foods').orderBy('name').startAt(term).endAt(term+'\uf8ff').limit(10).get();
  const brandRef = await db.collection('foods').orderBy('brand').startAt(term).endAt(term+'\uf8ff').limit(10).get();
  const notesRef = await db.collection('foods').orderBy('notes').startAt(term).endAt(term+'\uf8ff').limit(10).get();

  for ( nameDoc of nameRef.docs ) {
    tempFoods[nameDoc.id] = viewModel(nameDoc);
  }
  for ( brandDoc of brandRef.docs ) {
    tempFoods[brandDoc.id] = viewModel(brandDoc);
  }
  for ( notesDoc of notesRef.docs ) {
    tempFoods[notesDoc.id] = viewModel(notesDoc);
  }

  for ( const property in tempFoods ) {
    foods.push( tempFoods[property] );
  }

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
  const docRef = await db.collection('foods').add( food.convertToLowerCase() );
  // TODO handle errors
  return docRef.id;
}

function convertToLowerCase(food) {
  food.name = food.name.toLowerCase();
  food.brand = food.brand.toLowerCase();
  food.notes = food.notes.toLowerCase();
}

function viewModel(doc) {
  const data = doc.data();
  return {
    id: doc.id,
    brand: data.brand,
    name: data.name,
    servingSize: data.servingSize,
    servingSizeUnit: data.servingSizeUnit,
    carbs: data.carbs,
    notes: data.notes,
    updatedAt: data.updatedAt.toDate(),
  };
}
