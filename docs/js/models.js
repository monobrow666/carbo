let fakeFoods = [
  { id: 0, brand: "", name: "apple", updatedAt: new Date() },
  { id: 1, brand: "", name: "orange", updatedAt: new Date() },
  { id: 2, brand: "", name: "peach", updatedAt: new Date() },
  { id: 3, brand: "", name: "grapes", updatedAt: new Date() },
];

async function getFoodById(id) {
  const docRef = await db.collection('foods').doc(id);
  const doc = await docRef.get();
  const food = viewModel(doc);

  // Update when the food was viewed
  food.lastViewedAt = new Date();
  await docRef.update( food );

  return food;
}

async function getRecentFoods() {
  let foods = [];

  const docRef = await db.collection('foods').orderBy('updatedAt', 'desc').limit(10).get();
  for ( doc of docRef.docs ) {
    foods.push( viewModel(doc) );
  }

  return foods;
}

// Cloud Firestore doesn't have great built-in search features. This function
// uses a hack to search specific fields.
async function searchFoods(term) {
  term = term.toLowerCase().trim();
  let tempFoods = {};
  let foods = [];

  const searchRef = await db.collection('foods')
    // .where( 'keywords', 'array-contains', term.toLowerCase().trim() )
    // .orderBy('name')
    // .limit(10)
    .get();

  for ( doc of searchRef.docs ) {
    const data = doc.data();
    const re = new RegExp(`${term}`, 'gi');
    if (data.brand.match(re) || data.name.match(re) || data.notes.match(re)) {
      foods.push( viewModel(doc) );
    }
  }

  return foods;
}

async function saveFood(food) {
  food.updatedAt = new Date();

  // Because Cloud Firestore doesn't have good built-in searching, we have
  // to build our own keyword list.
  generateKeywords(food);

  if ( food.id ) {
    const foodId = food.id;
    delete food.id;
    // TODO handle errors
    const foodRef = await db.collection('foods').doc( foodId );
    await foodRef.update( food );
    return foodId;
  } else {
    // TODO handle errors
    const docRef = await db.collection('foods').add( food );
    return docRef.id;
  }
}

// Builds an array of keywords that can be used for text searches.
function generateKeywords(food) {
  const keywords = [];
  const nameKeywords = splitField(food.name);
  const brandKeywords = splitField(food.brand);
  const notesKeywords = splitField(food.notes);
  food.keywords = keywords.concat(nameKeywords, brandKeywords, notesKeywords);
}

function splitField(field) {
  const lowercaseField = field.toLowerCase();
  const separatorRegExp = /[ ,.;:()]+/;
  const values = lowercaseField.split(separatorRegExp);
  values.push(lowercaseField);
  return values;
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
